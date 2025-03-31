// components/MetricsOverview.jsx
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { getTrendIndicator } from '@/pages/ApiDetail';

const MetricsOverview = ({ api, apiHealth, remediationApplied, id, detailedData }:any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
    >
      {/* Request Rate */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Request Rate</h3>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">{api.requestRate}</span>
          <span className="ml-1 text-sm text-gray-500">/ minute</span>
          
          {api.requestRateTrend !== 0 && (
            <span className={`ml-2 text-sm ${getTrendIndicator(api.requestRateTrend).color} flex items-center`}>
              {getTrendIndicator(api.requestRateTrend).arrow} {Math.abs(api.requestRateTrend)}%
            </span>
          )}
        </div>
        
        <div className="mt-4 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={detailedData.requestRate}>
              <defs>
                <linearGradient id="requestColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1A73E8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#1A73E8" 
                fillOpacity={1} 
                fill="url(#requestColor)" 
                isAnimationActive={false}
                name="Requests/min"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Error Rate */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Error Rate</h3>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">{api.errorRate}%</span>
          
          {api.errorRateTrend !== 0 && (
            <span className={`ml-2 text-sm ${getTrendIndicator(api.errorRateTrend, true).color} flex items-center`}>
              {getTrendIndicator(api.errorRateTrend, true).arrow} {Math.abs(api.errorRateTrend)}%
            </span>
          )}
        </div>
        
        <div className="mt-4 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={detailedData.errorRate}>
              <defs>
                <linearGradient id="errorColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF3B30" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#FF3B30" 
                fillOpacity={1} 
                fill="url(#errorColor)" 
                isAnimationActive={false}
                name="Error Rate (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Latency */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Latency</h3>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">{id === '2' && !remediationApplied ? 240 : api.latency}</span>
          <span className="ml-1 text-sm text-gray-500">ms</span>
          
          {api.latencyTrend !== 0 && (
            <span className={`ml-2 text-sm ${id === '2' && !remediationApplied ? 'text-red-500' : getTrendIndicator(api.latencyTrend, true).color} flex items-center`}>
              {id === '2' && !remediationApplied ? '↑' : getTrendIndicator(api.latencyTrend, true).arrow} {id === '2' && !remediationApplied ? 220 : Math.abs(api.latencyTrend)}%
            </span>
          )}
        </div>
        
        <div className="mt-4 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={detailedData.latency}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Line 
                type="monotone" 
                dataKey="p50" 
                stroke="#68D391" 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false}
                name="p50"
              />
              <Line 
                type="monotone" 
                dataKey="p90" 
                stroke="#1A73E8" 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false}
                name="p90"
              />
              <Line 
                type="monotone" 
                dataKey="p95" 
                stroke="#FFCC00" 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false}
                name="p95"
              />
              <Line 
                type="monotone" 
                dataKey="p99" 
                stroke="#FF3B30" 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false}
                name="p99"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default MetricsOverview;