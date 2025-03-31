// tabs/OverviewTab.jsx
import { motion } from 'framer-motion';
import { AlertOctagon } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const OverviewTab = ({ detailedData, id, remediationApplied }:any) => {
  return (
    <>
      {/* Status code distribution */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Status Code Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={detailedData.statusCodes}>
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Bar 
                  dataKey="count" 
                  name="Requests" 
                  isAnimationActive={false}
                  radius={[4, 4, 0, 0]}
                >
                  {detailedData.statusCodes.map((entry:any, index:any) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trace duration distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Response Time Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={detailedData.traceDurations}>
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Bar 
                  dataKey="count" 
                  fill="#1A73E8" 
                  name="Requests" 
                  isAnimationActive={false}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Dependencies */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-lg shadow"
      >
        <div className="px-4 py-5 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Dependencies</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dependency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Latency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calls
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {detailedData.dependencies.map((dep:any, index:any) => (
                <tr key={index} className={`hover:bg-gray-50 ${dep.name === 'Database' && id === '2' && !remediationApplied ? 'bg-yellow-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dep.name}
                    {dep.name === 'Database' && id === '2' && !remediationApplied && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        <AlertOctagon className="h-3 w-3 mr-1" /> High Latency
                      </span>
                    )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${dep.name === 'Database' && id === '2' && !remediationApplied ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                    {remediationApplied && dep.name === 'Database' ? '42' : dep.latency} ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dep.calls.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={dep.errorRate > 1 ? 'text-red-500' : 'text-green-500'}>
                      {dep.errorRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
};

export default OverviewTab;