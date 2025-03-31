// tabs/AlertsTab.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Alert } from '@/pages/ApiDetail';

interface DetailedData {
  relatedAlerts: Alert[];
  // Other properties from detailedData not used in this component
}

interface AlertsTabProps {
  detailedData: DetailedData;
}

const AlertsTab: React.FC<AlertsTabProps> = ({ detailedData }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Active Alerts</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm flex items-center transition-colors duration-200">
              <Clock className="h-4 w-4 mr-2" />
              Last 24 hours
            </button>
            <button className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 text-sm font-medium transition-colors duration-200">
              View All Alerts
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {detailedData.relatedAlerts.map((alert, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {alert.severity === 'critical' ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : alert.severity === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{alert.description}</p>
                  <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                    <span>Triggered {alert.time} ago</span>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">Acknowledge</button>
                      <button className="text-blue-600 hover:text-blue-800">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {detailedData.relatedAlerts.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No active alerts for this API</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Recent Alert History</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          <div className="p-4 hover:bg-gray-50">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">High Latency Warning</h4>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                    Resolved
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">API latency exceeded 200ms threshold for 5+ minutes</p>
                <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                  <span>Resolved 2 days ago (Duration: 18 minutes)</span>
                  <button className="text-blue-600 hover:text-blue-800">View Details</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 hover:bg-gray-50">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">Error Rate Spike</h4>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                    Resolved
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">Error rate exceeded 5% threshold for 10+ minutes</p>
                <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                  <span>Resolved 5 days ago (Duration: 25 minutes)</span>
                  <button className="text-blue-600 hover:text-blue-800">View Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-center">
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm transition-colors duration-200">
            View Alert History
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertsTab;