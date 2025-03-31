import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, ResponsiveContainer 
} from 'recharts';
import { 
  Search, ArrowRight, AlertTriangle, AlertCircle,
  Download, Plus, CheckCircle, XCircle, ExternalLink, Bell
} from 'lucide-react';
import { mockData } from '@/data/data'; 
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [hasNewAlerts, setHasNewAlerts] = useState(false);
  const [showAIDiagnostic, setShowAIDiagnostic] = useState(false);

  // Simulate a new alert coming in
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNewAlerts(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Helper functions
  const getTrendIndicator = (value:any, isInverse = false) => {
    if (value === 0) return { arrow: '→', color: 'text-gray-500' };
    
    const isPositive = value > 0;
    const arrow = isPositive ? '↑' : '↓';
    const color = (isPositive && !isInverse) || (!isPositive && isInverse) ? 'text-green-500' : 'text-red-500';
    
    return { arrow, color };
  };

  const getHealthColor = (health:any) => {
    switch (health) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'unhealthy':
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getSeverityColor = (severity:any) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
      
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Monitoring Dashboard</h1>
          <p className="text-gray-500">Monitoring {mockData.serviceHealth.healthyAPIs + mockData.serviceHealth.degradedAPIs + mockData.serviceHealth.unhealthyAPIs} API endpoints</p>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="relative">
            <button 
              className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => navigate('/alerts')}
            >
              <Bell className="h-5 w-5 text-gray-500" />
              {hasNewAlerts && (
                <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500"></span>
              )}
            </button>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </button>
        </div>
      </div>
      
      {/* AI-powered Insight Alert - Shows when anomaly detected */}
      {hasNewAlerts && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                High API Latency Detected
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  The POST /api/v1/users/authenticate endpoint is experiencing unusually high latency (240ms vs normal 75ms).
                  Our AI diagnostic suggests this may be related to increased database query times.
                </p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-red-100 text-red-800 text-sm font-medium rounded-md hover:bg-red-200"
                    onClick={() => setShowAIDiagnostic(true)}
                  >
                    View AI Diagnosis
                  </button>
                  <button
                    type="button"
                    className="ml-3 px-3 py-1.5 bg-red-100 text-red-800 text-sm font-medium rounded-md hover:bg-red-200"
                    onClick={() => navigate('/api/2')}
                  >
                    View API Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* AI Diagnostic Modal */}
      {showAIDiagnostic && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">AI Diagnostic Report</h3>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setShowAIDiagnostic(false)}
                >
                  <span className="sr-only">Close</span>
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <h4 className="font-medium text-lg">High API Latency Detected</h4>
                </div>
                <p className="text-gray-600">
                  The <span className="font-medium">POST /api/v1/users/authenticate</span> endpoint is experiencing unusually high latency.
                </p>
                <div className="mt-2 px-2 py-1 bg-gray-100 rounded text-sm inline-block">
                  Confidence Score: <span className="font-medium">87%</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-md mb-2">Issue Timeline</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex mb-2">
                    <div className="w-24 text-gray-500 text-sm">10:15 AM</div>
                    <div className="text-sm">First latency spike detected</div>
                  </div>
                  <div className="flex mb-2">
                    <div className="w-24 text-gray-500 text-sm">10:17 AM</div>
                    <div className="text-sm">Pattern recognized as similar to previous incidents</div>
                  </div>
                  <div className="flex mb-2">
                    <div className="w-24 text-gray-500 text-sm">10:18 AM</div>
                    <div className="text-sm">Database query times increased by 300%</div>
                  </div>
                  <div className="flex">
                    <div className="w-24 text-gray-500 text-sm">10:20 AM</div>
                    <div className="text-sm">Alert triggered</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-md mb-2">Root Cause Analysis</h4>
                <div className="mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="font-medium">Primary cause (78% confidence):</span>
                  </div>
                  <p className="mt-1 text-sm pl-5">Database connection pool exhaustion due to increased authentication requests</p>
                </div>
                <div className="mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="font-medium">Contributing factor (65% confidence):</span>
                  </div>
                  <p className="mt-1 text-sm pl-5">Inefficient query pattern in user lookup function</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-md mb-2">Recommended Actions</h4>
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-green-50 p-4 border-b">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-green-800">Automated Fix Available (High Confidence)</h5>
                        <p className="mt-1 text-sm text-green-700">
                          Increase database connection pool size from 10 to 25
                        </p>
                        <button className="mt-2 px-3 py-1 bg-green-200 text-green-800 text-sm font-medium rounded-md hover:bg-green-300">
                          Apply Fix Automatically
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-gray-800">Performance Optimization (Medium Confidence)</h5>
                        <p className="mt-1 text-sm text-gray-600">
                          Add index on users.last_login column to improve query performance
                        </p>
                        <button className="mt-2 px-3 py-1 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300">
                          Review & Approve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-md mb-2">Similar Past Incidents</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="mb-2 pb-2 border-b border-gray-200">
                    <div className="text-sm font-medium">March 12, 2023</div>
                    <div className="text-sm text-gray-600">Connection pool exhaustion during traffic spike</div>
                    <div className="text-xs text-gray-500">Resolved by: Increasing connection pool size</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">January 24, 2023</div>
                    <div className="text-sm text-gray-600">Authentication slowdown after database update</div>
                    <div className="text-xs text-gray-500">Resolved by: Adding index on frequently queried column</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                onClick={() => setShowAIDiagnostic(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                onClick={() => {
                  navigate('/api/2');
                  setShowAIDiagnostic(false);
                }}
              >
                View API Details
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Service Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Service Health Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Health Score</h3>
          <div className="flex items-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#EDF2F7" 
                  strokeWidth="10" 
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke={hasNewAlerts ? '#FFCC00' : '#34C759'} 
                  strokeWidth="10" 
                  strokeDasharray={`${hasNewAlerts ? 75 : 95} * 2.83} 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text 
                  x="50" y="55" 
                  fontFamily="sans-serif" 
                  fontSize="24" 
                  textAnchor="middle" 
                  fill={hasNewAlerts ? '#FFCC00' : '#34C759'}
                >
                  {hasNewAlerts ? 75 : 95}
                </text>
              </svg>
            </div>
            <div className="ml-6">
              <div className="mb-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-sm">Healthy: {hasNewAlerts ? mockData.serviceHealth.healthyAPIs - 1 : mockData.serviceHealth.healthyAPIs}</span>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                  <span className="text-sm">Degraded: {hasNewAlerts ? mockData.serviceHealth.degradedAPIs + 1 : mockData.serviceHealth.degradedAPIs}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span className="text-sm">Unhealthy: {mockData.serviceHealth.unhealthyAPIs}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Total Requests */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Requests</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{mockData.metrics.totalRequests.toLocaleString()}</span>
            <span className="ml-1 text-sm text-gray-500">/ minute</span>
            
            <span className="ml-2 text-sm text-green-500 flex items-center">
              ↑ {mockData.metrics.requestsChange}%
            </span>
          </div>
          
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.requestRate.slice(0, 20)}>
                <defs>
                  <linearGradient id="requestColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1A73E8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1A73E8" 
                  fillOpacity={1} 
                  fill="url(#requestColor)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Error Rate */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-1">Error Rate</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{mockData.metrics.errorRate}%</span>
            
            <span className="ml-2 text-sm text-red-500 flex items-center">
              ↑ {mockData.metrics.errorRateChange}%
            </span>
          </div>
          
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.errorRate.slice(0, 20)}>
                <defs>
                  <linearGradient id="errorColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF3B30" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#FF3B30" 
                  fillOpacity={1} 
                  fill="url(#errorColor)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Average Latency */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Latency</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{hasNewAlerts ? mockData.metrics.avgLatency + 15 : mockData.metrics.avgLatency}</span>
            <span className="ml-1 text-sm text-gray-500">ms</span>
            
            <span className="ml-2 text-sm text-yellow-500 flex items-center">
              ↑ {hasNewAlerts ? mockData.metrics.latencyChange + 8 : mockData.metrics.latencyChange}%
            </span>
          </div>
          
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.latency.slice(0, 20)}>
                <defs>
                  <linearGradient id="latencyColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFCC00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FFCC00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="p95" 
                  stroke="#FFCC00" 
                  fillOpacity={1} 
                  fill="url(#latencyColor)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      {/* API Health Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">API Health</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Filter endpoints..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
              Sort
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockData.apis.map((api) => (
            <div 
              key={api.id}
              className={`bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer ${api.id === 2 && hasNewAlerts ? 'ring-2 ring-yellow-400' : ''}`}
              onClick={() => navigate(`/api/${api.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium truncate">{api.path}</h3>
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full ${api.id === 2 && hasNewAlerts ? 'bg-yellow-500' : getHealthColor(api.health)}`}></span>
                  <button className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-3 text-xs text-gray-500">
                <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium mr-2">
                  {api.method}
                </span>
                {api.description}
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <div className="text-sm font-medium">{api.requestRate}</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    Requests/min
                    {api.requestRateTrend !== 0 && (
                      <span className={`ml-1 ${getTrendIndicator(api.requestRateTrend).color}`}>
                        {getTrendIndicator(api.requestRateTrend).arrow} {Math.abs(api.requestRateTrend)}%
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">{api.errorRate}%</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    Error Rate
                    {api.errorRateTrend !== 0 && (
                      <span className={`ml-1 ${getTrendIndicator(api.errorRateTrend, true).color}`}>
                        {getTrendIndicator(api.errorRateTrend, true).arrow} {Math.abs(api.errorRateTrend)}%
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">{api.id === 2 && hasNewAlerts ? 240 : api.latency}ms</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    P95 Latency
                    {api.latencyTrend !== 0 && (
                      <span className={`ml-1 ${api.id === 2 && hasNewAlerts ? 'text-red-500' : getTrendIndicator(api.latencyTrend, true).color}`}>
                        {api.id === 2 && hasNewAlerts ? '↑' : getTrendIndicator(api.latencyTrend, true).arrow} {api.id === 2 && hasNewAlerts ? 220 : Math.abs(api.latencyTrend)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={api.requestHistory}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#1A73E8" 
                      strokeWidth={2} 
                      dot={false} 
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Recent Alerts & Traces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Alerts</h2>
            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center" onClick={() => navigate('/alerts')}>
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {hasNewAlerts && (
                <div className="p-4 hover:bg-gray-50 cursor-pointer bg-red-50">
                  <div className="flex items-start">
                    <div className="mt-1 w-3 h-3 rounded-full flex-shrink-0 bg-red-500"></div>
                    
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">High API Latency Detected</h3>
                        <span className="px-2 py-0.5 text-xs rounded-full text-white bg-red-500">
                          active
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-1">
                        The POST /api/v1/users/authenticate endpoint is experiencing unusually high latency.
                      </p>
                      
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span className="mr-3">
                          🕒 2 min ago
                        </span>
                        <span className="mr-3">
                          📊 Authentication Service
                        </span>
                        <span>
                          🔗 /api/v1/users/authenticate
                        </span>
                      </div>
                      
                      <div className="mt-3 flex space-x-2">
                        <button className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded hover:bg-yellow-200">
                          Acknowledge
                        </button>
                        <button className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200" onClick={() => setShowAIDiagnostic(true)}>
                          View AI Diagnosis
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {mockData.alerts.slice(0, 2).map((alert) => (
                <div 
                  key={alert.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-start">
                    <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${getSeverityColor(alert.severity)}`}></div>
                    
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{alert.title}</h3>
                        <span 
                          className={`px-2 py-0.5 text-xs rounded-full text-white ${
                            alert.status === 'active' ? 'bg-red-500' : 
                            alert.status === 'acknowledged' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-1">{alert.message}</p>
                      
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span className="mr-3">
                          🕒 {alert.time} ago
                        </span>
                        <span className="mr-3">
                          📊 {alert.service}
                        </span>
                        {alert.endpoint && (
                          <span>
                            🔗 {alert.endpoint}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-3 flex space-x-2">
                        {alert.status === 'active' && (
                          <button className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded hover:bg-yellow-200">
                            Acknowledge
                          </button>
                        )}
                        {(alert.status === 'active' || alert.status === 'acknowledged') && (
                          <button className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200">
                            Resolve
                          </button>
                        )}
                        <button className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Recent Traces */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Traces</h2>
            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center" onClick={() => navigate('/traces')}>
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    Duration
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hasNewAlerts && (
                  <tr className="hover:bg-gray-50 cursor-pointer bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">User Authentication</div>
                      <div className="text-xs text-gray-500">Authentication Service</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">240ms</div>
                      <div className="text-xs text-gray-500">3 min ago</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        View
                      </button>
                    </td>
                  </tr>
                )}
                
                {mockData.traces.slice(0, 3).map((trace) => (
                  <tr 
                    key={trace.id}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {trace.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{trace.name}</div>
                      <div className="text-xs text-gray-500">{trace.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{trace.duration}ms</div>
                      <div className="text-xs text-gray-500">{trace.timestamp}</div>
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
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Dashboard