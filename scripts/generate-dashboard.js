const fs = require('fs');
const path = require('path');

// Ensure destination directory exists
const srcDir = path.join(process.cwd(), 'dashboard-ui/src');
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

const componentsDir = path.join(srcDir, 'components');
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

// Read detected APIs
const apiPath = path.join(process.cwd(), 'detected-apis.json');
if (!fs.existsSync(apiPath)) {
  console.error('detected-apis.json not found. Run detect-apis.js first.');
  process.exit(1);
}

const apis = JSON.parse(fs.readFileSync(apiPath, 'utf8'));

// Generate service health component
const serviceHealthCode = `
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServiceHealth.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const ServiceHealth = () => {
  const [health, setHealth] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        const response = await axios.get("API_URL/api/status");
        setHealth(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch service health');
        console.error('Error fetching health status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Loading service health...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="service-health">
      <h2>Service Health</h2>
      <div className="health-grid">
        {Object.entries(health).map(([service, status]) => (
          <div 
            key={service} 
            className={\`health-card \${status.status === 'up' ? 'healthy' : 'unhealthy'}\`}
          >
            <h3>{service}</h3>
            <div className="status">
              {status.status === 'up' ? '✅ Healthy' : '❌ Unhealthy'}
            </div>
            {status.error && <div className="error-message">{status.error}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceHealth;
`;

fs.writeFileSync(path.join(componentsDir, 'ServiceHealth.jsx'), serviceHealthCode);
console.log('Generated ServiceHealth component');

// Generate CSS for ServiceHealth
const serviceHealthCss = `
.service-health {
  margin-bottom: 2rem;
}

.health-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.health-card {
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.health-card.healthy {
  background-color: #f0fff4;
  border: 1px solid #68d391;
}

.health-card.unhealthy {
  background-color: #fff5f5;
  border: 1px solid #fc8181;
}

.health-card h3 {
  margin-top: 0;
  text-transform: capitalize;
}

.status {
  font-weight: bold;
  margin: 0.5rem 0;
}

.error-message {
  font-size: 0.85rem;
  color: #e53e3e;
  margin-top: 0.5rem;
}

.loading {
  padding: 1rem;
  text-align: center;
  color: #718096;
}

.error {
  padding: 1rem;
  text-align: center;
  color: #e53e3e;
  background-color: #fff5f5;
  border-radius: 0.5rem;
  border: 1px solid #fc8181;
}
`;

fs.writeFileSync(path.join(componentsDir, 'ServiceHealth.css'), serviceHealthCss);

// Generate API Panel components for each API
apis.forEach(api => {
  const safeComponentName = api.full_path
    .replace(/\//g, '_')
    .replace(/:/g, '')
    .replace(/^_/, '')
    + 'Panel';
  
  const apiPanelCode = `
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ApiPanel.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const ${safeComponentName} = () => {
  const [requestRate, setRequestRate] = useState([]);
  const [errorRate, setErrorRate] = useState([]);
  const [latency, setLatency] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        
        // Fetch request rate
        const requestRateQuery = \`sum(rate(http_requests_total{handler="${api.full_path}"}[5m]))\`;
        const requestRateResponse = await axios.get(\`\${API_URL}/api/metrics\`, {
          params: {
            query: requestRateQuery,
            start: Math.floor(Date.now()/1000 - 3600),
            end: Math.floor(Date.now()/1000)
          }
        });
        setRequestRate(requestRateResponse.data);
        
        // Fetch error rate
        const errorRateQuery = \`sum(rate(http_requests_total{handler="${api.full_path}",status_code=~"5.."}[5m])) / sum(rate(http_requests_total{handler="${api.full_path}"}[5m]) > 0) * 100 or vector(0)\`;
        const errorRateResponse = await axios.get(\`\${API_URL}/api/metrics\`, {
          params: {
            query: errorRateQuery,
            start: Math.floor(Date.now()/1000 - 3600),
            end: Math.floor(Date.now()/1000)
          }
        });
        setErrorRate(errorRateResponse.data);
        
        // Fetch latency percentiles
        const latencyQuery = \`histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{handler="${api.full_path}"}[5m])) by (le))\`;
        const latencyResponse = await axios.get(\`\${API_URL}/api/metrics\`, {
          params: {
            query: latencyQuery,
            start: Math.floor(Date.now()/1000 - 3600),
            end: Math.floor(Date.now()/1000)
          }
        });
        setLatency(latencyResponse.data);
        
        setError(null);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch metrics');
        console.error('Error fetching metrics:', err);
        setLoading(false);
      }
    };
    
    fetchMetrics();
    
    // Refresh data every minute
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Loading metrics...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="api-panel">
      <h2>${api.method} ${api.full_path}</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Request Rate</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={requestRate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tickFormatter={(time) => {
                  const date = new Date(time);
                  return \`\${date.getHours()}:\${String(date.getMinutes()).padStart(2, '0')}\`;
                }}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                formatter={(value) => [value.toFixed(2) + ' req/s', 'Request Rate']}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" name="Requests/sec" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="metric-card">
          <h3>Error Rate (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={errorRate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tickFormatter={(time) => {
                  const date = new Date(time);
                  return \`\${date.getHours()}:\${String(date.getMinutes()).padStart(2, '0')}\`;
                }}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                formatter={(value) => [value.toFixed(2) + '%', 'Error Rate']}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#FF3B30" name="Error %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="metric-card">
          <h3>P95 Latency (s)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={latency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tickFormatter={(time) => {
                  const date = new Date(time);
                  return \`\${date.getHours()}:\${String(date.getMinutes()).padStart(2, '0')}\`;
                }}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                formatter={(value) => [value.toFixed(3) + ' s', 'P95 Latency']}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#34C759" name="Seconds" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ${safeComponentName};
`;

  fs.writeFileSync(path.join(componentsDir, `${safeComponentName}.jsx`), apiPanelCode);
  console.log(`Generated component for ${api.method} ${api.full_path}`);
});

// Generate CSS for API Panels
const apiPanelCss = `
.api-panel {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.api-panel h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  color: #2D3748;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #F7FAFC;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.metric-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #4A5568;
}

.loading {
  padding: 1rem;
  text-align: center;
  color: #718096;
}

.error {
  padding: 1rem;
  text-align: center;
  color: #E53E3E;
  background-color: #FFF5F5;
  border-radius: 0.5rem;
  border: 1px solid #FC8181;
}
`;

fs.writeFileSync(path.join(componentsDir, 'ApiPanel.css'), apiPanelCss);

// Generate main Dashboard component
const apiImports = apis.map(api => {
  const safeComponentName = api.full_path
    .replace(/\//g, '_')
    .replace(/:/g, '')
    .replace(/^_/, '')
    + 'Panel';
  
  return `import ${safeComponentName} from './${safeComponentName}';`;
}).join('\n');

const apiComponents = apis.map(api => {
  const safeComponentName = api.full_path
    .replace(/\//g, '_')
    .replace(/:/g, '')
    .replace(/^_/, '')
    + 'Panel';
  
  return `        <${safeComponentName} key="${api.id}" />`;
}).join('\n');

const dashboardCode = `
import React from 'react';
import ServiceHealth from './ServiceHealth';
${apiImports}
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>API Monitoring Dashboard</h1>
      </header>
      
      <main className="dashboard-content">
        <ServiceHealth />
        
        <h2>API Endpoints</h2>
        <div className="api-panels">
${apiComponents}
        </div>
      </main>
      
      <footer className="dashboard-footer">
        <p>Atlan Observability Dashboard | {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Dashboard;
`;

fs.writeFileSync(path.join(componentsDir, 'Dashboard.jsx'), dashboardCode);
console.log('Generated Dashboard component');

// Generate CSS for the Dashboard
const dashboardCss = `
.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F7FAFC;
}

.dashboard-header {
  background-color: #2C5282;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.dashboard-content h2 {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  color: #2D3748;
  font-size: 1.5rem;
}

.api-panels {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-footer {
  background-color: #2D3748;
  color: #A0AEC0;
  padding: 1rem;
  text-align: center;
  font-size: 0.875rem;
}
`;

fs.writeFileSync(path.join(componentsDir, 'Dashboard.css'), dashboardCss);

// Generate App.js
const appCode = `
import React from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
`;

fs.writeFileSync(path.join(srcDir, 'App.js'), appCode);
console.log('Generated App.js');

// Generate App.css
const appCss = `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  color: #2D3748;
  line-height: 1.5;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
}

.App {
  width: 100%;
}
`;

fs.writeFileSync(path.join(srcDir, 'App.css'), appCss);
console.log('Generated App.css');

// Generate index.js
const indexCode = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

fs.writeFileSync(path.join(srcDir, 'index.js'), indexCode);
console.log('Generated index.js');

// Generate index.css
const indexCss = `
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`;

fs.writeFileSync(path.join(srcDir, 'index.css'), indexCss);
console.log('Generated index.css');

console.log('\nDashboard generation complete!');