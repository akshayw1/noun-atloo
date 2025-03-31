// tabs/TracesTab.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock } from 'lucide-react';
import { Trace } from '@/pages/ApiDetail';


interface DetailedData {
  traces: Trace[];
  // Other properties from detailedData not used in this component
}

interface TracesTabProps {
  detailedData: DetailedData;
}

const TracesTab: React.FC<TracesTabProps> = ({ detailedData }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow overflow-hidden"
    >
      <div className="px-4 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Recent Traces</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm flex items-center transition-colors duration-200">
            <Clock className="h-4 w-4 mr-2" />
            Last 24 hours
          </button>
          <button className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 text-sm font-medium transition-colors duration-200">
            View All Traces
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trace ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request Path
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {detailedData.traces.map((trace, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 hover:underline">
                  {trace.id.substring(0, 8)}...{trace.id.substring(trace.id.length - 4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {trace.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {trace.duration} ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    trace.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {trace.status === 'error' ? 'Error' : 'Success'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {trace.path}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 flex items-center">
                    View <ExternalLink className="h-3 w-3 ml-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">5</span> of <span className="font-medium">43</span> traces
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm text-gray-500 transition-colors duration-200">
            Previous
          </button>
          <button className="px-3 py-1 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 text-sm text-blue-600 transition-colors duration-200">
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TracesTab;