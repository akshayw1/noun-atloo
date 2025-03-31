

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Bell, Search, Settings, Menu, Activity, BarChart2, Clock, Filter,
  ChevronDown, ArrowRight, AlertTriangle, Layers, Home,
  Download, Plus, RefreshCw, CheckCircle, XCircle, ExternalLink
} from 'lucide-react';

// Mock data for the dashboard
const mockData = {
  // Service health overview
  serviceHealth: {
    healthScore: 86,
    healthyAPIs: 12,
    degradedAPIs: 4,
    unhealthyAPIs: 2,
  },
  // Key metrics
  metrics: {
    totalRequests: 4825,
    requestsChange: 12.3,
    errorRate: 4.8,
    errorRateChange: 2.5,
    avgLatency: 182,
    latencyChange: 3.7
  },
  // Time series data
// Time series data
requestRate: Array(24).fill(null).map((_, i) => ({
  time: `${i}:00`,
  value: 2000 + Math.random() * 3000
})),
  errorRate: Array(24).fill(null).map((_, i) => ({
    time: `${i}:00`,
    value: 1 + Math.random() * 8
  })),
  latency: Array(24).fill(null).map((_, i) => ({
    time: `${i}:00`,
    p50: 50 + Math.random() * 100,
    p95: 100 + Math.random() * 150,
    p99: 150 + Math.random() * 200
  })),
  // API endpoints data
  apis: [
    {
      id: 1,
      path: "/api/v1/products", 
      method: "GET",
      health: "healthy",
      description: "List all products with filtering",
      requestRate: 1250,
      requestRateTrend: 5.3,
      errorRate: 0.7,
      errorRateTrend: -2.1,
      latency: 95,
      latencyTrend: -1.2,
      requestHistory: Array(10).fill(null).map(() => ({ value: 1000 + Math.random() * 500 }))
    },
    {
      id: 2,
      path: "/api/v1/orders", 
      method: "POST",
      health: "degraded",
      description: "Create new order",
      requestRate: 850,
      requestRateTrend: 3.7,
      errorRate: 4.5,
      errorRateTrend: 8.2,
      latency: 220,
      latencyTrend: 12.5,
      requestHistory: Array(10).fill(null).map(() => ({ value: 800 + Math.random() * 300 }))
    },
    {
      id: 3,
      path: "/api/v1/checkout", 
      method: "POST",
      health: "unhealthy",
      description: "Process payment for order",
      requestRate: 720,
      requestRateTrend: -2.1,
      errorRate: 15.8,
      errorRateTrend: 24.3,
      latency: 345,
      latencyTrend: 28.7,
      requestHistory: Array(10).fill(null).map(() => ({ value: 700 + Math.random() * 200 }))
    },
    {
      id: 4,
      path: "/api/v1/users/auth", 
      method: "POST",
      health: "healthy",
      description: "User authentication",
      requestRate: 2100,
      requestRateTrend: 7.8,
      errorRate: 1.2,
      errorRateTrend: -0.5,
      latency: 85,
      latencyTrend: -3.2,
      requestHistory: Array(10).fill(null).map(() => ({ value: 2000 + Math.random() * 500 }))
    },
    {
      id: 5,
      path: "/api/v1/cart", 
      method: "GET",
      health: "healthy",
      description: "Get user cart",
      requestRate: 1850,
      requestRateTrend: 4.2,
      errorRate: 0.5,
      errorRateTrend: -1.8,
      latency: 65,
      latencyTrend: -2.5,
      requestHistory: Array(10).fill(null).map(() => ({ value: 1800 + Math.random() * 400 }))
    },
    {
      id: 6,
      path: "/api/v1/search", 
      method: "GET",
      health: "degraded",
      description: "Search products",
      requestRate: 1560,
      requestRateTrend: 12.4,
      errorRate: 3.2,
      errorRateTrend: 5.6,
      latency: 195,
      latencyTrend: 8.3,
      requestHistory: Array(10).fill(null).map(() => ({ value: 1500 + Math.random() * 400 }))
    }
  ],
  // Recent alerts
  alerts: [
    {
      id: 1,
      severity: "critical",
      title: "High error rate on checkout API",
      message: "Error rate exceeded 10% threshold for more than 5 minutes",
      status: "active",
      time: "5 min",
      service: "Payment Service",
      endpoint: "/api/v1/checkout"
    },
    {
      id: 2,
      severity: "warning",
      title: "Increased latency on search API",
      message: "P95 latency above 150ms threshold for last 15 minutes",
      status: "active",
      time: "12 min",
      service: "Product Service",
      endpoint: "/api/v1/search"
    },
    {
      id: 3,
      severity: "critical",
      title: "Database connection failures",
      message: "Multiple failed connection attempts to order database",
      status: "acknowledged",
      time: "28 min",
      service: "Order Service",
      endpoint: "/api/v1/orders"
    },
    {
      id: 4,
      severity: "info",
      title: "Deployment completed",
      message: "New version v2.4.1 deployed successfully",
      status: "resolved",
      time: "1 hr",
      service: "All Services",
      endpoint: null
    }
  ],
  // Recent traces
  traces: [
    {
      id: 1,
      traceId: "8f4b3a2c1d9e8f7b6a5c4d3e2f1a0b9c",
      name: "POST /api/v1/checkout",
      service: "Payment Service",
      status: "error",
      duration: 4532,
      timestamp: "2023-05-15 14:32:45"
    },
    {
      id: 2,
      traceId: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
      name: "GET /api/v1/search",
      service: "Product Service",
      status: "success",
      duration: 215,
      timestamp: "2023-05-15 14:31:22"
    },
    {
      id: 3,
      traceId: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      name: "POST /api/v1/orders",
      service: "Order Service",
      status: "error",
      duration: 3254,
      timestamp: "2023-05-15 14:30:17"
    },
    {
      id: 4,
      traceId: "p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1",
      name: "GET /api/v1/products",
      service: "Product Service",
      status: "success",
      duration: 125,
      timestamp: "2023-05-15 14:28:49"
    }
  ]
};

const HomePage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 24 hours');
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [selectedService, setSelectedService] = useState('All Services');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const timeRanges = [
    'Last 30 minutes',
    'Last 1 hour',
    'Last 6 hours',
    'Last 24 hours',
    'Last 7 days'
  ];
  
  const services = [
    { name: 'All Services', health: 'degraded' },
    { name: 'Product Service', health: 'healthy' },
    { name: 'Order Service', health: 'degraded' },
    { name: 'Payment Service', health: 'critical' },
    { name: 'User Service', health: 'healthy' }
  ];
  
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
  
  // Helper function to get alert severity color
  const getSeverityColor = (severity:any) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Helper function to get trend arrow and color
  const getTrendIndicator = (value:any, isInverse = false) => {
    if (value === 0) return { arrow: '→', color: 'text-gray-500' };
    
    const isPositive = value > 0;
    const arrow = isPositive ? '↑' : '↓';
    const color = (isPositive && !isInverse) || (!isPositive && isInverse) ? 'text-green-500' : 'text-red-500';
    
    return { arrow, color };
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } bg-white border-r border-gray-200 transition-all duration-300 z-10`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <Activity className="h-6 w-6 text-blue-600" />
            {!sidebarCollapsed && (
              <span className="ml-2 font-bold text-lg">API Monitor</span>
            )}
          </div>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a 
                href="#" 
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} p-2 rounded-md bg-blue-50 text-blue-600`}
              >
                <Home className="h-5 w-5" />
                {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} p-2 rounded-md text-gray-700 hover:bg-gray-100`}
              >
                <BarChart2 className="h-5 w-5" />
                {!sidebarCollapsed && <span className="ml-3">Metrics</span>}
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} p-2 rounded-md text-gray-700 hover:bg-gray-100`}
              >
                <Layers className="h-5 w-5" />
                {!sidebarCollapsed && <span className="ml-3">Traces</span>}
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} p-2 rounded-md text-gray-700 hover:bg-gray-100`}
              >
                <AlertTriangle className="h-5 w-5" />
                {!sidebarCollapsed && (
                  <>
                    <span className="ml-3">Alerts</span>
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      3
                    </span>
                  </>
                )}
              </a>
            </li>
          </ul>
          
          {!sidebarCollapsed && (
            <div className="mt-8">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Services
              </h3>
              <ul className="mt-2 space-y-1">
                {services.map((service) => (
                  <li key={service.name}>
                    <a 
                      href="#" 
                      className={`flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-gray-100 ${selectedService === service.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                      onClick={() => setSelectedService(service.name)}
                    >
                      <span className={`w-2 h-2 mr-2 rounded-full ${getHealthColor(service.health)}`}></span>
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Nav */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4">
          <div className="relative">
            <button 
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => setShowServiceDropdown(!showServiceDropdown)}
            >
              <span className={`w-2 h-2 mr-2 rounded-full ${getHealthColor(services.find(s => s.name === selectedService)?.health || 'degraded')}`}></span>
              {selectedService}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {showServiceDropdown && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {services.map((service) => (
                  <button 
                    key={service.name}
                    className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => {
                      setSelectedService(service.name);
                      setShowServiceDropdown(false);
                    }}
                  >
                    <span className={`w-2 h-2 mr-2 rounded-full ${getHealthColor(service.health)}`}></span>
                    {service.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative ml-4">
            <button 
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
            >
              <Clock className="h-4 w-4 mr-2" />
              {selectedTimeRange}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {showTimeRangeDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {timeRanges.map((range) => (
                  <button 
                    key={range}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => {
                      setSelectedTimeRange(range);
                      setShowTimeRangeDropdown(false);
                    }}
                  >
                    {range}
                  </button>
                ))}
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 border-t border-gray-200">
                  Custom Range...
                </button>
              </div>
            )}
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <button className="p-2 rounded-md hover:bg-gray-100 text-gray-600">
              <RefreshCw className="h-5 w-5" />
            </button>
            
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="search"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            
            <button className="p-2 rounded-md hover:bg-gray-100 text-gray-600 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-500"></span>
            </button>
            
            <button className="p-2 rounded-md hover:bg-gray-100 text-gray-600">
              <Settings className="h-5 w-5" />
            </button>
            
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
              TS
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">E-commerce API Dashboard</h1>
              <p className="text-gray-500">Monitoring {mockData.serviceHealth.healthyAPIs + mockData.serviceHealth.degradedAPIs + mockData.serviceHealth.unhealthyAPIs} API endpoints</p>
            </div>
            <div className="flex space-x-2">
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
                      stroke={mockData.serviceHealth.healthScore >= 90 ? '#34C759' : mockData.serviceHealth.healthScore >= 70 ? '#FFCC00' : '#FF3B30'} 
                      strokeWidth="10" 
                      strokeDasharray={`${mockData.serviceHealth.healthScore * 2.83} 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <text 
                      x="50" y="55" 
                      fontFamily="sans-serif" 
                      fontSize="24" 
                      textAnchor="middle" 
                      fill={mockData.serviceHealth.healthScore >= 90 ? '#34C759' : mockData.serviceHealth.healthScore >= 70 ? '#FFCC00' : '#FF3B30'}
                    >
                      {mockData.serviceHealth.healthScore}
                    </text>
                  </svg>
                </div>
                <div className="ml-6">
                  <div className="mb-2">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-sm">Healthy: {mockData.serviceHealth.healthyAPIs}</span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                      <span className="text-sm">Degraded: {mockData.serviceHealth.degradedAPIs}</span>
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
                <span className="text-2xl font-bold">{mockData.metrics.avgLatency}</span>
                <span className="ml-1 text-sm text-gray-500">ms</span>
                
                <span className="ml-2 text-sm text-yellow-500 flex items-center">
                  ↑ {mockData.metrics.latencyChange}%
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
          
          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Request Rate Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
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
              transition={{ duration: 0.3, delay: 0.5 }}
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
          </div>
          
          {/* API Health Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
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
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium truncate">{api.path}</h3>
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full ${getHealthColor(api.health)}`}></span>
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
                      <div className="text-sm font-medium">{api.latency}ms</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        P95 Latency
                        {api.latencyTrend !== 0 && (
                          <span className={`ml-1 ${getTrendIndicator(api.latencyTrend, true).color}`}>
                            {getTrendIndicator(api.latencyTrend, true).arrow} {Math.abs(api.latencyTrend)}%
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
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Alerts</h2>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {mockData.alerts.slice(0, 3).map((alert) => (
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
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Traces</h2>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
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
                    {mockData.traces.map((trace) => (
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
        </main>
      </div>
    </div>
  );
};

export default HomePage;

              