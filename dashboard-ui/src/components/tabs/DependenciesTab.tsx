// tabs/DependenciesTab.jsx
import { motion } from 'framer-motion';
import { AlertTriangle, Database, Server, ExternalLink } from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const DependenciesTab = ({ detailedData }:any) => {
  // Sample dependency metrics data
  const dependencyTimeData = {
    database: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      latency: 30 + Math.random() * 20 + (i >= 20 ? 50 : 0), // Spike at the end
      error: Math.random() * 0.5
    })),
    cache: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      latency: 5 + Math.random() * 5,
      error: Math.random() * 0.2
    })),
    auth: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      latency: 50 + Math.random() * 30,
      error: Math.random() * 2
    }))
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Dependencies Summary */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Dependencies Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dependency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Latency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calls / Min
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {detailedData.dependencies.map((dep:any, index:any) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {dep.name === 'Database' ? (
                        <Database className="h-5 w-5 text-blue-500 mr-2" />
                      ) : dep.name === 'Cache' ? (
                        <Server className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <Server className="h-5 w-5 text-purple-500 mr-2" />
                      )}
                      <div className="text-sm font-medium text-gray-900">{dep.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dep.name === 'Database' ? 'PostgreSQL' : 
                     dep.name === 'Cache' ? 'Redis' : 'gRPC Service'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={dep.latency > 100 ? 'text-red-500 font-medium' : 'text-gray-500'}>
                      {dep.latency} ms
                      {dep.latency > 100 && (
                        <AlertTriangle className="inline h-4 w-4 ml-1 text-red-500" />
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.round(dep.calls / 60)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={dep.errorRate > 1 ? 'text-red-500' : 'text-green-500'}>
                      {dep.errorRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      dep.latency > 100 || dep.errorRate > 1 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {dep.latency > 100 || dep.errorRate > 1 ? 'Degraded' : 'Healthy'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Dependency Details */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 border-b border-gray-200 flex justify-between">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Database Performance</h3>
          </div>
          <button className="text-blue-600 text-sm flex items-center hover:text-blue-800">
            View Details <ExternalLink className="h-3 w-3 ml-1" />
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Latency (ms)</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dependencyTimeData.database}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="latency" 
                      stroke="#1A73E8" 
                      strokeWidth={2} 
                      dot={false} 
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Error Rate (%)</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dependencyTimeData.database}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="error" 
                      fill="#FF3B30" 
                      isAnimationActive={false}
                      name="Error Rate (%)"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Top Queries</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-mono bg-gray-100 text-gray-800 p-1 rounded">
                      SELECT * FROM users WHERE last_login greater ?
                    </div>
                    <span className="text-xs text-red-500 font-medium">215 ms avg</span>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>~487 calls/min</span>
                    <span>No index on last_login</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-mono bg-gray-100 text-gray-800 p-1 rounded">
                      SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
                    </div>
                    <span className="text-xs text-gray-500 font-medium">42 ms avg</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    <span>~315 calls/min</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-mono bg-gray-100 text-gray-800 p-1 rounded">
                      UPDATE users SET last_seen = NOW() WHERE id = ?
                    </div>
                    <span className="text-xs text-gray-500 font-medium">18 ms avg</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    <span>~256 calls/min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 mb-1">Performance Recommendation</h4>
                <p className="text-sm text-yellow-700 mb-2">
                  The slow query on <span className="font-mono text-yellow-800">users.last_login</span> is causing high database latency.
                  Adding an index would improve performance.
                </p>
                <button className="text-xs font-medium text-yellow-800 bg-yellow-100 px-2 py-1 rounded hover:bg-yellow-200">
                  View Optimization Options
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cache Dependency */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 border-b border-gray-200 flex justify-between">
          <div className="flex items-center">
            <Server className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Cache Performance</h3>
          </div>
          <button className="text-blue-600 text-sm flex items-center hover:text-blue-800">
            View Details <ExternalLink className="h-3 w-3 ml-1" />
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500 mb-1">Hit Rate</div>
              <div className="text-2xl font-bold text-green-500">94.8%</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500 mb-1">Avg. Latency</div>
              <div className="text-2xl font-bold text-gray-700">8 ms</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500 mb-1">Memory Usage</div>
              <div className="text-2xl font-bold text-gray-700">62%</div>
            </div>
          </div>
          
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dependencyTimeData.cache}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#34C759" 
                  strokeWidth={2} 
                  dot={false} 
                  isAnimationActive={false}
                  name="Latency (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start">
              <div className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0">✓</div>
              <div>
                <h4 className="text-sm font-medium text-green-800 mb-1">Cache Performance is Optimal</h4>
                <p className="text-sm text-green-700">
                  The cache is performing well with high hit rates and low latency.
                  No optimization is needed at this time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DependenciesTab;