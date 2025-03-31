const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3001;

// Environmental configuration
const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:9090';
const JAEGER_URL = process.env.JAEGER_URL || 'http://localhost:16686';
const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Endpoint to get metrics from Prometheus
app.get('/api/metrics', async (req, res) => {
  try {
    const { query, start, end, step = '15s' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const response = await axios.get(`${PROMETHEUS_URL}/api/v1/query_range`, {
      params: {
        query,
        start: start || (Date.now() / 1000 - 3600), // Default to 1 hour ago
        end: end || (Date.now() / 1000),
        step
      }
    });
    
    // Transform Prometheus data for easier consumption by charts
    if (response.data.status === 'success' && response.data.data.result.length > 0) {
      const result = response.data.data.result[0];
      const values = result.values.map(([timestamp, value]) => ({
        time: new Date(timestamp * 1000).toISOString(),
        value: parseFloat(value)
      }));
      
      res.json(values);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Endpoint to get traces from Jaeger
app.get('/api/traces', async (req, res) => {
  try {
    const { service, operation, limit = 10 } = req.query;
    
    if (!service) {
      return res.status(400).json({ error: 'Service parameter is required' });
    }
    
    // Construct Jaeger API URL
    let url = `${JAEGER_URL}/api/traces?service=${service}&limit=${limit}`;
    if (operation) {
      url += `&operation=${operation}`;
    }
    
    const response = await axios.get(url);
    
    // Transform Jaeger data for the dashboard
    const traces = response.data.data.map(trace => {
      const rootSpan = trace.spans.find(span => !span.references || span.references.length === 0);
      
      return {
        traceId: trace.traceID,
        name: rootSpan.operationName,
        status: rootSpan.tags.some(tag => tag.key === 'error' && tag.value) ? 'error' : 'success',
        duration: Math.round(rootSpan.duration / 1000), // Convert microseconds to milliseconds
        timestamp: new Date(rootSpan.startTime / 1000).toISOString()
      };
    });
    
    res.json(traces);
  } catch (error) {
    console.error('Error fetching traces:', error);
    res.status(500).json({ error: 'Failed to fetch traces' });
  }
});

// Endpoint to get logs from Elasticsearch
app.get('/api/logs', async (req, res) => {
  try {
    const { service, level, traceId, limit = 100 } = req.query;
    
    // Build Elasticsearch query
    const query = {
      size: limit,
      sort: [{ '@timestamp': { order: 'desc' } }],
      query: {
        bool: {
          must: []
        }
      }
    };
    
    if (service) {
      query.query.bool.must.push({ match: { 'service.name': service } });
    }
    
    if (level) {
      query.query.bool.must.push({ match: { 'log.level': level } });
    }
    
    if (traceId) {
      query.query.bool.must.push({ match: { 'trace.id': traceId } });
    }
    
    const response = await axios.post(`${ELASTICSEARCH_URL}/logs/_search`, query);
    
    // Transform Elasticsearch data
    const logs = response.data.hits.hits.map(hit => {
      const source = hit._source;
      return {
        timestamp: source['@timestamp'],
        level: source.log?.level || 'INFO',
        message: source.message,
        service: source.service?.name,
        traceId: source.trace?.id
      };
    });
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// API status endpoint to check connections to backends
app.get('/api/status', async (req, res) => {
  const status = {
    prometheus: { status: 'unknown' },
    jaeger: { status: 'unknown' },
    elasticsearch: { status: 'unknown' }
  };
  
  try {
    await axios.get(`${PROMETHEUS_URL}/-/ready`);
    status.prometheus = { status: 'up' };
  } catch (error) {
    status.prometheus = { 
      status: 'down', 
      error: error.message 
    };
  }
  
  try {
    await axios.get(`${JAEGER_URL}/api/services`);
    status.jaeger = { status: 'up' };
  } catch (error) {
    status.jaeger = { 
      status: 'down', 
      error: error.message 
    };
  }
  
  try {
    await axios.get(`${ELASTICSEARCH_URL}/_cluster/health`);
    status.elasticsearch = { status: 'up' };
  } catch (error) {
    status.elasticsearch = { 
      status: 'down', 
      error: error.message 
    };
  }
  
  res.json(status);
});

// Start server
app.listen(port, () => {
  console.log(`Dashboard API running on port ${port}`);
});