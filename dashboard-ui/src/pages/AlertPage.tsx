import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
   PieChart, Pie, Cell, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Filter, Plus,XCircle, AlertTriangle, AlertCircle, 
  Info, Clock, CheckCircle, Download, RefreshCw,Loader2
} from 'lucide-react';
import { mockData } from '@/data/data';
// import { useNavigate } from 'react-router-dom';

interface Alert {
  id: number;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'acknowledged' | 'resolved';
  service: string;
  endpoint?: string;
  time: string;
  aiDiagnosis?: boolean;
  aiSolution?: string;
  aiConfidence?: number;
}

const AlertsPage = () => {
  // const navigate = useNavigate();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h');
  const [showAiDiagnosis, setShowAiDiagnosis] = useState<boolean>(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [implementingSolution, setImplementingSolution] = useState<boolean>(false);
  const [implementationComplete, setImplementationComplete] = useState<boolean>(false);

  // Filter alerts
  const filteredAlerts = [...mockData.alerts as Alert[]].concat([
    {
      id: 999,
      title: 'High API Latency Detected',
      message: 'The POST /api/v1/users/authenticate endpoint is experiencing unusually high latency. Database queries are taking longer than expected.',
      severity: 'warning' as const,
      status: 'active' as const,
      service: 'Authentication Service',
      endpoint: '/api/v1/users/authenticate',
      time: '2 min',
      aiDiagnosis: true,
      aiSolution: 'Increase database connection pool size from 10 to 25',
      aiConfidence: 87
    }
  ]).filter(alert => {
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'all' && alert.status !== selectedStatus) return false;
    if (selectedService !== 'all' && !alert.service.includes(selectedService)) return false;
    return true;
  });

  // Helper function to get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500';
      case 'acknowledged': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Summary data for charts
  const severitySummary = [
    { name: 'Critical', value: filteredAlerts.filter(a => a.severity === 'critical').length, color: '#FF3B30' },
    { name: 'Warning', value: filteredAlerts.filter(a => a.severity === 'warning').length, color: '#FFCC00' },
    { name: 'Info', value: filteredAlerts.filter(a => a.severity === 'info').length, color: '#1A73E8' }
  ];
  
  const statusSummary = [
    { name: 'Active', value: filteredAlerts.filter(a => a.status === 'active').length, color: '#FF3B30' },
    { name: 'Acknowledged', value: filteredAlerts.filter(a => a.status === 'acknowledged').length, color: '#FFCC00' },
    { name: 'Resolved', value: filteredAlerts.filter(a => a.status === 'resolved').length, color: '#34C759' },
  ];

  // Implement AI solution
  const implementSolution = () => {
    setImplementingSolution(true);
    setTimeout(() => {
      setImplementingSolution(false);
      setImplementationComplete(true);
      
      // Update the alert status
      if (selectedAlert) {
        selectedAlert.status = 'resolved';
      }
    }, 3000);
  };

  // Show alert details with AI diagnosis
  const showAlertDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setShowAiDiagnosis(true);
    setImplementationComplete(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-500">Monitoring and managing system alerts</p>
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
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Configure Alert
          </button>
        </div>
      </div>
      
      {/* Alert Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow p-4 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
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
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
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
              <option value="Authentication">Authentication Service</option>
              <option value="Database">Database Service</option>
              <option value="API">API Service</option>
              <option value="User">User Service</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
            >
              <option value="1h">Last hour</option>
              <option value="6h">Last 6 hours</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
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
      
      {/* Alert Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Alerts</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-red-500">{filteredAlerts.filter(a => a.status === 'active').length}</span>
            <span className="ml-1 text-sm text-gray-500">alerts</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span className="text-sm">Critical: {filteredAlerts.filter(a => a.severity === 'critical' && a.status === 'active').length}</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
              <span className="text-sm">Warning: {filteredAlerts.filter(a => a.severity === 'warning' && a.status === 'active').length}</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              <span className="text-sm">Info: {filteredAlerts.filter(a => a.severity === 'info' && a.status === 'active').length}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Severity Distribution</h3>
          <div className="h-40 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severitySummary}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {severitySummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Status Distribution</h3>
          <div className="h-40 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusSummary}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
      
      {/* Alert List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <div className="divide-y divide-gray-200">
          {filteredAlerts.map((alert:any) => (
            <div 
              key={alert.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${alert.id === 999 ? 'bg-yellow-50' : ''}`}
              onClick={() => showAlertDetails(alert)}
            >
              <div className="flex items-start">
                <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${getSeverityColor(alert.severity)}`}></div>
                
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{alert.title}</h3>
                    <span 
                      className={`px-2 py-0.5 text-xs rounded-full text-white ${getStatusColor(alert.status)}`}
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
                    {alert.aiDiagnosis && (
                      <button 
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded hover:bg-purple-200 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          showAlertDetails(alert);
                        }}
                      >
                        <span className="mr-1">🧠</span> View AI Diagnosis
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAlerts.length}</span> of <span className="font-medium">{filteredAlerts.length}</span> results
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
      
      {/* AI Diagnosis Modal */}
      {showAiDiagnosis && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {implementationComplete ? "Alert Resolved" : "AI Diagnostic Report"}
                </h3>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setShowAiDiagnosis(false)}
                >
                  <span className="sr-only">Close</span>
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {implementationComplete ? (
                <div>
                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium text-center text-gray-900 mb-4">Alert Successfully Resolved</h3>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                    <p className="text-green-800">
                      <span className="font-medium">Applied Solution:</span> {selectedAlert.aiSolution}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Before</div>
                      <div className="text-xl font-bold text-red-500">240ms</div>
                      <div className="text-xs text-gray-500">Average Latency</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">After</div>
                      <div className="text-xl font-bold text-green-500">75ms</div>
                      <div className="text-xs text-gray-500">Average Latency</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium mb-3">Provide Feedback</h4>
                    <div className="flex space-x-2 mb-3">
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm flex-1">
                        👍 Helpful
                      </button>
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm flex-1">
                        👎 Not Helpful
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      onClick={() => {
                        setShowAiDiagnosis(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {implementingSolution ? (
                    <div className="py-10 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mb-6"></div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Implementing Solution</h3>
                      <p className="text-gray-600 mb-6 text-center">
                        {selectedAlert.aiSolution}
                      </p>
                      
                      <div className="w-full max-w-md bg-gray-100 rounded-lg p-4 mb-6">
                        <div className="text-sm text-gray-700 space-y-3">
                          <p className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Solution validation complete
                          </p>
                          <p className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Preparing implementation plan
                          </p>
                          <p className="flex items-center">
                            <Loader2 className="h-4 w-4 text-blue-500 mr-2 animate-spin" />
                            Implementing configuration changes
                          </p>
                          <p className="flex items-center text-gray-400">
                            <Clock className="h-4 w-4 mr-2" />
                            Verifying changes
                          </p>
                          <p className="flex items-center text-gray-400">
                            <Clock className="h-4 w-4 mr-2" />
                            Monitoring performance impact
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <div className="flex items-center mb-3">
                          {selectedAlert.severity === 'critical' ? (
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                          ) : selectedAlert.severity === 'warning' ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                          ) : (
                            <Info className="h-5 w-5 text-blue-500 mr-2" />
                          )}
                          <h3 className="font-medium text-lg">{selectedAlert.title}</h3>
                        </div>
                        <p className="text-gray-600">
                          {selectedAlert.message}
                        </p>
                        <div className="mt-3 px-3 py-2 bg-gray-100 rounded text-sm">
                          <div className="flex justify-between items-center">
                            <span>AI Confidence Score:</span>
                            <span className="font-medium">{selectedAlert.aiConfidence}%</span>
                          </div>
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${selectedAlert.aiConfidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium text-md mb-3">Performance Metrics</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Current Latency</div>
                            <div className="text-xl font-bold text-red-500">240ms</div>
                            <div className="text-xs text-gray-500">vs normal ~75ms</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Database Query Time</div>
                            <div className="text-xl font-bold text-red-500">160ms</div>
                            <div className="text-xs text-gray-500">vs normal ~40ms</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Active Connections</div>
                            <div className="text-xl font-bold text-red-500">9/10</div>
                            <div className="text-xs text-gray-500">90% pool utilization</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium text-md mb-3">Root Cause Analysis</h4>
                        <div className="mb-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <span className="font-medium">Primary cause (87% confidence):</span>
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
                        <h4 className="font-medium text-md mb-3">Recommended Solution</h4>
                        <div className="border rounded-md overflow-hidden">
                          <div className="bg-green-50 p-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              </div>
                              <div className="ml-3">
                                <h5 className="text-sm font-medium text-green-800">Automated Fix Available (High Confidence)</h5>
                                <p className="mt-1 text-sm text-green-700">
                                  {selectedAlert.aiSolution}
                                </p>
                                <p className="mt-2 text-xs text-green-700">
                                  Expected resolution time: 2-3 minutes<br />
                                  No service interruption required
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-md mb-3">Similar Past Incidents</h4>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="mb-3 pb-3 border-b border-gray-200">
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
                      
                      <div className="mt-6 flex justify-end space-x-3">
                        <button 
                          className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                          onClick={() => setShowAiDiagnosis(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                          onClick={implementSolution}
                        >
                          Implement Solution
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AlertsPage;