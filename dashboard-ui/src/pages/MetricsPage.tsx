import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Settings, Filter, Download, RefreshCw, Clock, AlertTriangle, XCircle
} from 'lucide-react';
import { mockData } from '@/data/data'; 
import { useNavigate } from 'react-router-dom';

const MetricsPage = () => {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedMetricType, setSelectedMetricType] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [showAnomalyDetails, setShowAnomalyDetails] = useState(false);

  // Helper functions
  const getTrendIndicator = (value:any, isInverse = false) => {
    if (value === 0) return { arrow: '→', color: 'text-gray-500' };
    
    const isPositive = value > 0;
    const arrow = isPositive ? '↑' : '↓';
    const color = (isPositive && !isInverse) || (!isPositive && isInverse) ? 'text-green-500' : 'text-red-500';
    
    return { arrow, color };
  };

  // Helper function to get appropriate color based on health status
  const getHealthColor = (health:any) => {
    switch (health) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'unhealthy':
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Anomaly detection details
  const anomalyDetails = {
    metric: 'Database Connection Utilization',
    service: 'Authentication Service',
    timestamp: '10:15 AM',
    duration: '18 minutes',
    description: 'Connection pool utilization has been unusually high (>90%) for the last 18 minutes, causing increased latency.',
    pattern: 'Similar pattern observed during traffic spikes, but current request rate is normal.',
    similarIncidents: [
      {
        date: 'March 12, 2023',
        description: 'Connection pool exhaustion during traffic spike',
        resolution: 'Increased connection pool size from 10 to 25'
      },
      {
        date: 'January 24, 2023',
        description: 'Authentication slowdown after database update',
        resolution: 'Added index on frequently queried column'
      }
    ],
    relatedAlerts: [
      {
        id: 999,
        title: 'High API Latency Detected',
        service: 'Authentication Service',
        endpoint: '/api/v1/users/authenticate',
        time: '2 min ago'
      }
    ]
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Metrics Explorer</h1>
          <p className="text-gray-500">Advanced metrics analysis and visualization</p>
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
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Time range selector */}
      <div className="flex mb-6">
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-1 inline-flex">
          {['1h', '6h', '24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedTimeRange === range
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              } transition-colors duration-200`}
              onClick={() => setSelectedTimeRange(range)}
            >
              {range}
            </button>
          ))}
          <button className="px-3 py-1 text-sm text-gray-600 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Custom
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow p-4 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Metric Type
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedMetricType}
              onChange={(e) => setSelectedMetricType(e.target.value)}
            >
              <option value="all">All Metrics</option>
              <option value="latency">Latency</option>
              <option value="throughput">Throughput</option>
              <option value="error_rate">Error Rate</option>
              <option value="resource">Resource Utilization</option>
            </select>
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
              <option value="authentication">Authentication Service</option>
              <option value="database">Database Service</option>
              <option value="api_gateway">API Gateway</option>
              <option value="user_service">User Service</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Show Anomalies
            </label>
            <div className="flex items-center mt-2">
              <input
                id="show-anomalies"
                name="show-anomalies"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="show-anomalies" className="ml-2 block text-sm text-gray-900">
                Highlight detected anomalies
              </label>
            </div>
          </div>
        </div>
        <div className="flex mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            Apply Filters
          </button>
          <button className="px-4 py-2 text-gray-700 ml-2 text-sm">
            Reset
          </button>
        </div>
      </motion.div>
      
      {/* Anomaly Alert */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Anomaly Detected: Database Connection Utilization
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Connection pool utilization has been unusually high ( greater than 90%) for the last 18 minutes, causing increased latency in the Authentication Service.
              </p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-md hover:bg-yellow-200"
                  onClick={() => setShowAnomalyDetails(true)}
                >
                  View Details
                </button>
                <button
                  type="button"
                  className="ml-3 px-3 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-md hover:bg-yellow-200"
                  onClick={() => navigate('/api/2?tab=ai-diagnostic')}
                >
                  View Remediation Options
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Metric Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Request Rate Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold">Request Rate</h3>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Filter className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.requestRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Requests per minute"
                  stroke="#1A73E8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Latency Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold">Latency</h3>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Filter className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.latency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="p50" 
                  name="p50 Latency"
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="p95" 
                  name="p95 Latency"
                  stroke="#1A73E8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="p99" 
                  name="p99 Latency"
                  stroke="#FF3B30" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Error Rate Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold">Error Rate</h3>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Filter className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.errorRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Error Rate (%)"
                  stroke="#FF3B30" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Database Connection Pool Utilization Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="font-semibold">Database Connection Utilization</h3>
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                <AlertTriangle className="h-3 w-3 mr-1" /> Anomaly Detected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Filter className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { time: '09:45', value: 65 },
                  { time: '09:50', value: 68 },
                  { time: '09:55', value: 72 },
                  { time: '10:00', value: 76 },
                  { time: '10:05', value: 82 },
                  { time: '10:10', value: 88 },
                  { time: '10:15', value: 92 },
                  { time: '10:20', value: 94 },
                  { time: '10:25', value: 93 },
                  { time: '10:30', value: 95 },
                  { time: '10:35', value: 90 },
                  { time: '10:40', value: 92 }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Utilization (%)"
                  stroke="#FFCC00" 
                  activeDot={{ r: 8 }} 
                />
                <CartesianGrid strokeDasharray="3 3" />
                <line 
                  x1="0%" 
                  y1="90%" 
                  x2="100%" 
                  y2="90%" 
                  stroke="red" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      {/* API Performance Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-white rounded-lg shadow p-4 mb-6"
      >
        <h3 className="text-lg font-medium mb-4">API Performance Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endpoint
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requests/min
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Latency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P95 Latency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.apis.map((api) => (
                <tr key={api.id} className={api.id === 2 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${getHealthColor(api.id === 2 ? 'degraded' : api.health)} mr-2`}></div>
                      <div>
                        <div className="text-sm font-medium">{api.path}</div>
                        <div className="text-xs text-gray-500">{api.method}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{api.requestRate}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className={`${getTrendIndicator(api.requestRateTrend).color}`}>
                        {getTrendIndicator(api.requestRateTrend).arrow} {Math.abs(api.requestRateTrend)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{api.errorRate}%</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className={`${getTrendIndicator(api.errorRateTrend, true).color}`}>
                        {getTrendIndicator(api.errorRateTrend, true).arrow} {Math.abs(api.errorRateTrend)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{api.id === 2 ? 240 : Math.round(api.latency * 0.7)}ms</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{api.id === 2 ? 350 : api.latency}ms</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className={`${api.id === 2 ? 'text-red-500' : getTrendIndicator(api.latencyTrend, true).color}`}>
                        {api.id === 2 ? '↑' : getTrendIndicator(api.latencyTrend, true).arrow} {api.id === 2 ? 220 : Math.abs(api.latencyTrend)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      api.id === 2 ? 'bg-yellow-100 text-yellow-800' :
                      api.health === 'healthy' ? 'bg-green-100 text-green-800' :
                      api.health === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {api.id === 2 ? 'Degraded' : api.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Anomaly Details Modal */}
      {showAnomalyDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Anomaly Details</h3>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setShowAnomalyDetails(false)}
                >
                  <span className="sr-only">Close</span>
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  <h4 className="font-medium text-lg">{anomalyDetails.metric}</h4>
                </div>
                <p className="text-gray-600">
                  Detected in <span className="font-medium">{anomalyDetails.service}</span> at {anomalyDetails.timestamp}
                </p>
              </div>
              
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-sm mb-2">Description</h5>
                <p className="text-sm text-gray-600">{anomalyDetails.description}</p>
              </div>
              
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-sm mb-2">Pattern Analysis</h5>
                <p className="text-sm text-gray-600">{anomalyDetails.pattern}</p>
              </div>
              
              <div className="mb-6">
                <h5 className="font-medium text-sm mb-4">Connection Pool Utilization</h5>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={[
                      { time: '09:45', value: 65 },
                      { time: '09:50', value: 68 },
                      { time: '09:55', value: 72 },
                      { time: '10:00', value: 76 },
                      { time: '10:05', value: 82 },
                      { time: '10:10', value: 88 },
                      { time: '10:15', value: 92 },
                      { time: '10:20', value: 94 },
                      { time: '10:25', value: 93 },
                      { time: '10:30', value: 95 },
                      { time: '10:35', value: 90 },
                      { time: '10:40', value: 92 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#FFCC00" 
                      strokeWidth={2}
                      name="Utilization (%)"
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <line 
                      x1="0%" 
                      y1="90%" 
                      x2="100%" 
                      y2="90%" 
                      stroke="red" 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center mt-2 text-xs text-gray-500 justify-end">
                  <div className="w-4 border-t border-red-500 border-dashed mr-1"></div>
                  <span>Warning Threshold (90%)</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h5 className="font-medium text-sm mb-2">Related Alerts</h5>
                {anomalyDetails.relatedAlerts.map((alert, idx) => (
                  <div key={idx} className="bg-yellow-50 p-3 rounded-md mb-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{alert.title}</div>
                      <div className="text-xs text-gray-500">{alert.time}</div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{alert.service} • {alert.endpoint}</div>
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <h5 className="font-medium text-sm mb-2">Similar Past Incidents</h5>
                {anomalyDetails.similarIncidents.map((incident, idx) => (
                  <div key={idx} className="mb-3 pb-3 border-b border-gray-200 last:border-0">
                    <div className="text-sm font-medium">{incident.date}</div>
                    <div className="text-sm text-gray-600">{incident.description}</div>
                    <div className="text-xs text-gray-500">Resolved by: {incident.resolution}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                  onClick={() => setShowAnomalyDetails(false)}
                >
                  Close
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  onClick={() => {
                    setShowAnomalyDetails(false);
                    navigate('/api/2?tab=ai-diagnostic');
                  }}
                >
                  View Remediation Options
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default MetricsPage;