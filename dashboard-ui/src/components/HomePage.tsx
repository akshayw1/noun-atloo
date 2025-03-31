import { useState, useRef, useEffect } from 'react';
import { 
  Bell, Search, Settings, Menu, Activity, BarChart2, Clock,
  ChevronDown, AlertTriangle, Layers, Home, RefreshCw, 
  Info, AlertCircle, Check
} from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';

import { services, timeRanges } from '@/data/data'; 

const HomePage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 24 hours');
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedService, setSelectedService] = useState('All Services');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab] = useState('dashboard');
  
  // Refs for handling outside clicks
  const serviceDropdownRef = useRef(null);
  const timeRangeDropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  
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
  
  // Notifications data
  const notifications = [
    {
      id: 1,
      type: 'critical',
      title: 'Payment Service Error Rate',
      message: 'Error rate exceeded 10% threshold for Payment Service',
      time: '18 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Recommendation API Latency',
      message: 'P95 latency above 200ms threshold for Recommendation Service',
      time: '32 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Search Service Auto-scaled',
      message: 'Search service scaled from 4 to 6 instances due to load',
      time: '2 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Deployment Successful',
      message: 'Version v3.4.2 deployed to all services',
      time: '3 hours ago',
      read: true
    }
  ];

  
  
  useEffect(() => {
    const handleClickOutside = () => {
      if (serviceDropdownRef.current ) {
        setShowServiceDropdown(false);
      }
      if (timeRangeDropdownRef.current ) {
        setShowTimeRangeDropdown(false);
      }
      if (notificationsRef.current) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const getNotificationIcon = (type:any) => {
    switch (type) {
      case 'critical': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      case 'success': return <Check className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Service health tooltip content
  const getServiceTooltip = (health:any) => {
    switch (health) {
      case 'healthy': return 'All endpoints operating normally';
      case 'degraded': return 'Some endpoints experiencing high latency or increased error rates';
      case 'critical': return 'Critical issues affecting service availability';
      default: return 'Service status unknown';
    }
  };

const navigate = useNavigate()
  
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
              <span className="ml-2 font-bold text-lg">Atlanto Island</span>
            )}
          </div>
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a 
                href="#" 
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} p-2 rounded-md ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
                onClick={() => navigate('/')}
                title="Dashboard"
              >
                <Home className="h-5 w-5" />
                {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} p-2 rounded-md ${activeTab === 'metrics' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
                onClick={() => navigate('/metrics')}
                title="Metrics"
              >
                <BarChart2 className="h-5 w-5" />
                {!sidebarCollapsed && <span className="ml-3">Metrics</span>}
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} p-2 rounded-md ${activeTab === 'traces' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
                onClick={() => navigate('/traces')}
                title="Traces"
              >
                <Layers className="h-5 w-5" />
                {!sidebarCollapsed && <span className="ml-3">Traces</span>}
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} p-2 rounded-md ${activeTab === 'alerts' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
                onClick={() => navigate('/alerts')}
                title="Alerts"
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
                {sidebarCollapsed && (
                  <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-500"></span>
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
                      className={`flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-gray-100 ${selectedService === service.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700'} transition-colors duration-200`}
                      onClick={() => setSelectedService(service.name)}
                      title={getServiceTooltip(service.health)}
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
          <div className="relative" ref={serviceDropdownRef}>
            <button 
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setShowServiceDropdown(!showServiceDropdown)}
              title={getServiceTooltip(services.find(s => s.name === selectedService)?.health || 'degraded')}
            >
              <span className={`w-2 h-2 mr-2 rounded-full ${getHealthColor(services.find(s => s.name === selectedService)?.health || 'degraded')}`}></span>
              {selectedService}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {showServiceDropdown && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1">
                {services.map((service) => (
                  <button 
                    key={service.name}
                    className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => {
                      setSelectedService(service.name);
                      setShowServiceDropdown(false);
                    }}
                    title={getServiceTooltip(service.health)}
                  >
                    <span className={`w-2 h-2 mr-2 rounded-full ${getHealthColor(service.health)}`}></span>
                    <span className="flex-1 truncate">{service.name}</span>
                    {service.health !== 'healthy' && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">
                        {service.health === 'critical' ? 'Critical' : 'Degraded'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative ml-4" ref={timeRangeDropdownRef}>
            <button 
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
              title="Select time range"
            >
              <Clock className="h-4 w-4 mr-2" />
              {selectedTimeRange}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {showTimeRangeDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
                  Select Time Range
                </div>
                {timeRanges.map((range) => (
                  <button 
                    key={range}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors duration-150 ${selectedTimeRange === range ? 'bg-blue-50 text-blue-600' : ''}`}
                    onClick={() => {
                      setSelectedTimeRange(range);
                      setShowTimeRangeDropdown(false);
                    }}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <button 
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors duration-200"
              title="Refresh data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="search"
                placeholder="Search metrics, traces..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 w-64 transition-all duration-200"
              />
            </div>
            
            <div className="relative" ref={notificationsRef}>
              <button 
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600 relative transition-colors duration-200"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium text-gray-700">Notifications</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Mark all as read
                    </button>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      <div>
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${notification.read ? 'opacity-70' : ''}`}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-0.5">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="ml-3 flex-1">
                                <div className="font-medium text-sm text-gray-900">{notification.title}</div>
                                <div className="text-sm text-gray-600 mt-0.5">{notification.message}</div>
                                <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                              </div>
                              {!notification.read && (
                                <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 block text-center">
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors duration-200"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            
            <div 
              className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium cursor-pointer hover:bg-blue-700 transition-colors duration-200"
              title="User profile"
            >
              TS
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomePage;