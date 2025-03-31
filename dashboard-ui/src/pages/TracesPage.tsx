import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Download, CheckCircle, XCircle, RefreshCw,
  AlertTriangle,
  Database
} from 'lucide-react';
import { mockData } from '@/data/data'; 
import { useNavigate } from 'react-router-dom';

interface Trace {
  id: number;
  name: string;
  service: string;
  status: string;
  duration: number;
  timestamp: string;
  traceId: string;
}

interface TraceDetails {
  id: number;
  name: string;
  service: string;
  status: string;
  duration: number;
  timestamp: string;
  traceId: string;
  spans: {
    name: string;
    service: string;
    startTime: string;
    duration: number;
    status: string;
    tags: { key: string; value: string }[];
  }[];
  logs: {
    timestamp: string;
    level: string;
    message: string;
  }[];
  attributes: { key: string; value: string }[];
}

const TracesPage = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [minDuration, setMinDuration] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showTraceDetails, setShowTraceDetails] = useState<boolean>(false);
  const [selectedTrace, setSelectedTrace] = useState<TraceDetails | null>(null);

  // Sample traces data
  const traces: Trace[] = [
    ...mockData.traces,
    {
      id: 999,
      name: 'POST /api/v1/users/authenticate',
      service: 'Authentication Service',
      status: 'error',
      duration: 240,
      timestamp: '2 min ago',
      traceId: 'db1f32a879e41c38'
    }
  ];
  
  // Filter traces
  const filteredTraces = traces.filter(trace => {
    if (selectedService !== 'all' && !trace.service.includes(selectedService)) return false;
    if (selectedStatus !== 'all' && trace.status !== selectedStatus) return false;
    if (minDuration && trace.duration < parseInt(minDuration)) return false;
    if (searchQuery && !trace.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !trace.service.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Trace details example
  const traceDetailsExample: TraceDetails = {
    id: 999,
    name: 'POST /api/v1/users/authenticate',
    service: 'Authentication Service',
    status: 'error',
    duration: 240,
    timestamp: '2 min ago',
    traceId: 'db1f32a879e41c38',
    spans: [
      {
        name: 'HTTP POST /api/v1/users/authenticate',
        service: 'Authentication Service',
        startTime: '10:15:23.123',
        duration: 240,
        status: 'error',
        tags: [
          { key: 'http.method', value: 'POST' },
          { key: 'http.status_code', value: '500' }
        ]
      },
      {
        name: 'Validate request',
        service: 'Authentication Service',
        startTime: '10:15:23.125',
        duration: 12,
        status: 'success',
        tags: [
          { key: 'component', value: 'RequestValidator' }
        ]
      },
      {
        name: 'Database query: find_user',
        service: 'Database Service',
        startTime: '10:15:23.138',
        duration: 160,
        status: 'error',
        tags: [
          { key: 'db.type', value: 'postgresql' },
          { key: 'db.operation', value: 'query' },
          { key: 'db.statement', value: 'SELECT * FROM users WHERE username = ?' },
          { key: 'error', value: 'Connection timeout' }
        ]
      },
      {
        name: 'Generate error response',
        service: 'Authentication Service',
        startTime: '10:15:23.300',
        duration: 5,
        status: 'success',
        tags: [
          { key: 'component', value: 'ErrorHandler' }
        ]
      }
    ],
    logs: [
      {
        timestamp: '10:15:23.123',
        level: 'INFO',
        message: 'Started processing authentication request'
      },
      {
        timestamp: '10:15:23.125',
        level: 'INFO',
        message: 'Request validation successful'
      },
      {
        timestamp: '10:15:23.138',
        level: 'INFO',
        message: 'Executing database query to find user'
      },
      {
        timestamp: '10:15:23.298',
        level: 'ERROR',
        message: 'Database query failed: Connection pool timeout (waiting for available connection)'
      },
      {
        timestamp: '10:15:23.300',
        level: 'INFO',
        message: 'Generating error response'
      },
      {
        timestamp: '10:15:23.305',
        level: 'INFO',
        message: 'Request processing completed with error'
      }
    ],
    attributes: [
      { key: 'request.id', value: 'REQ-12345' },
      { key: 'user.id', value: 'user-78901' },
      { key: 'client.ip', value: '192.168.1.42' },
      { key: 'error.message', value: 'Database connection pool timeout' }
    ]
  };

  // Show trace details
  const viewTraceDetails = (trace: Trace) => {
    // In a real app, you would fetch the trace details by ID
    // For this demo, we'll use our example trace details for the problem trace
    if (trace.id === 999) {
      setSelectedTrace(traceDetailsExample);
    } else {
      // Create a simpler trace detail for other traces
      const simpleTrace: TraceDetails = {
        ...trace,
        spans: [
          {
            name: trace.name,
            service: trace.service,
            startTime: new Date().toLocaleTimeString(),
            duration: trace.duration,
            status: trace.status,
            tags: [
              { key: 'component', value: 'ApiHandler' }
            ]
          }
        ],
        logs: [
          {
            timestamp: new Date().toLocaleTimeString(),
            level: 'INFO',
            message: 'Request processing started'
          },
          {
            timestamp: new Date().toLocaleTimeString(),
            level: trace.status === 'success' ? 'INFO' : 'ERROR',
            message: trace.status === 'success' ? 'Request processed successfully' : 'Request processing failed'
          }
        ],
        attributes: [
          { key: 'request.id', value: 'REQ-' + Math.floor(Math.random() * 10000) },
          { key: 'service.name', value: trace.service }
        ]
      };
      setSelectedTrace(simpleTrace);
    }
    setShowTraceDetails(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Distributed Traces</h1>
          <p className="text-gray-500">End-to-end request tracing across services</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Search Traces
          </button>
        </div>
      </div>
      
      {/* Trace Search & Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow p-4 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operation Name
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Filter by operation..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="all">All Services</option>
              <option value="Authentication">Authentication Service</option>
              <option value="Database">Database Service</option>
              <option value="API">API Service</option>
              <option value="User">User Service</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (greater than)
            </label>
            <input 
              type="text" 
              placeholder="e.g. 100ms"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={minDuration}
              onChange={(e) => setMinDuration(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
        <div className="flex mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            Apply Filters
          </button>
          <button 
            className="px-4 py-2 text-gray-700 ml-2 text-sm"
            onClick={() => {
              setSelectedService('all');
              setSelectedStatus('all');
              setMinDuration('');
              setSearchQuery('');
            }}
          >
            Reset
          </button>
        </div>
      </motion.div>
      
      {/* Traces Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trace ID
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTraces.map((trace) => (
              <tr 
                key={trace.id}
                className={`hover:bg-gray-50 cursor-pointer ${trace.id === 999 ? 'bg-yellow-50' : ''}`}
                onClick={() => viewTraceDetails(trace)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {trace.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : trace.id === 999 ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">{trace.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{trace.service}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${trace.id === 999 ? 'text-red-500 font-medium' : ''}`}>{trace.duration}ms</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {trace.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                  {trace.traceId.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </a>
            <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </a>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTraces.length}</span> of <span className="font-medium">{filteredTraces.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </a>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Trace Visualization Modal */}
      {showTraceDetails && selectedTrace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-6xl w-full m-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="px-4 py-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Trace Details</h3>
                <p className="text-sm text-gray-500">{selectedTrace.traceId}</p>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowTraceDetails(false)}
              >
                <span className="sr-only">Close</span>
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  {selectedTrace.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  )}
                  <h4 className="text-lg font-medium">
                    {selectedTrace.name}
                  </h4>
                </div>
                <div className="flex text-sm text-gray-600 mb-3">
                  <span className="mr-4">Duration: {selectedTrace.duration}ms</span>
                  <span className="mr-4">Service: {selectedTrace.service}</span>
                  <span>Started: {selectedTrace.timestamp}</span>
                </div>
                
                {selectedTrace.id === 999 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          This trace indicates performance issues in the database layer. AI analysis suggests database connection pool is exhausted.
                        </p>
                        <div className="mt-2">
                          <button 
                            className="text-sm text-yellow-700 font-medium hover:text-yellow-600"
                            onClick={() => navigate('/api/2')}
                          >
                            View API Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h4 className="text-md font-medium mb-3">Span Timeline</h4>
                <div className="relative border rounded-md p-4 overflow-x-auto">
                  {selectedTrace.spans.map((span, index) => {
                    // Calculate position and width based on duration
                    const totalDuration = selectedTrace.duration;
                    const startOffset = index === 0 ? 0 : 
                      (new Date(span.startTime).getTime() - new Date(selectedTrace.spans[0].startTime).getTime());
                    const startPercent = (startOffset / totalDuration) * 100;
                    const widthPercent = (span.duration / totalDuration) * 100;
                    
                    return (
                      <div key={index} className="flex items-center my-3">
                        <div className="w-1/3 pr-2 text-sm">
                          {span.name}
                          {span.status === 'error' && <span className="ml-2 text-red-500">⚠️</span>}
                        </div>
                        <div className="w-2/3 relative h-8 bg-gray-100 rounded">
                          <div 
                            className={`absolute top-0 h-8 rounded ${span.status === 'error' ? 'bg-red-400' : 'bg-blue-400'}`}
                            style={{ 
                              left: `${startPercent}%`, 
                              width: `${widthPercent}%`,
                              minWidth: '2px'
                            }}
                          />
                        </div>
                        <div className="ml-2 text-sm">{span.duration}ms</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-md font-medium mb-3">Logs</h4>
                <div className="border rounded-md p-3 bg-gray-50 font-mono text-xs overflow-x-auto">
                  {selectedTrace.logs.map((log, index) => (
                    <div key={index} className={`py-1 ${log.level === 'ERROR' ? 'text-red-600' : log.level === 'WARN' ? 'text-yellow-600' : ''}`}>
                      [{log.timestamp}] {log.level}: {log.message}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-3">Attributes</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTrace.attributes.map((attr, index) => (
                    <div key={index} className="border rounded-md p-2">
                      <span className="text-sm font-medium">{attr.key}:</span>
                      <span className="text-sm ml-2">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedTrace.id === 999 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-md font-medium mb-3">AI Analysis</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Database className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-blue-700">Database Connection Issue Detected</h5>
                        <p className="mt-1 text-sm text-blue-600">
                          Analysis shows that the database connection pool is exhausted (9/10 connections in use), causing connection timeout.
                          This is causing the high latency in the authentication endpoint.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-white p-3 rounded border border-blue-100">
                      <h6 className="text-sm font-medium text-blue-800 mb-2">Recommended Solution:</h6>
                      <p className="text-sm text-blue-700">
                        Increase database connection pool size from 10 to 25 to handle the current load.
                      </p>
                      <button 
                        className="mt-2 px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-md hover:bg-blue-200"
                        onClick={() => navigate('/api/2?tab=ai-diagnostic')}
                      >
                        View Remediation Options
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default TracesPage;