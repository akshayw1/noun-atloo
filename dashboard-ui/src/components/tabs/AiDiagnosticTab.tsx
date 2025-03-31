// tabs/AiDiagnosticTab.jsx
import { motion } from 'framer-motion';
import { 
    AlertTriangle,
  CheckCircle, Clock, Loader2 
} from 'lucide-react';

const AiDiagnosticTab = ({ 
  remediationState, 
  remediationApplied, 
  activeFix, 
  showFeedbackForm,
  applyAutomatedFix 
}:any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {remediationState.stage === 'analyzing' ? (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">AI Analysis in Progress</h3>
            <p className="text-gray-600 mb-6 text-center">
              Correlating metrics, logs, and traces to identify root causes and potential solutions
            </p>
            
            <div className="w-full max-w-md bg-gray-100 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-700 space-y-3">
                <p className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Collecting performance metrics
                </p>
                <p className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Analyzing error patterns
                </p>
                <p className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Analyzing distributed traces
                </p>
                <p className="flex items-center">
                  <Loader2 className="h-4 w-4 text-blue-500 mr-2 animate-spin" />
                  Examining database performance
                </p>
                <p className="flex items-center text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  Identifying bottlenecks
                </p>
                <p className="flex items-center text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  Formulating remediation options
                </p>
              </div>
            </div>
            
            <div className="w-full max-w-md">
              <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${remediationState.progress}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {remediationState.progress}% complete
              </div>
            </div>
          </div>
        </div>
      ) : remediationState.stage === 'implementing' ? (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Implementing Solution</h3>
            <p className="text-gray-600 mb-6 text-center">
              {activeFix === 'pool' 
                ? 'Increasing database connection pool size from 10 to 25'
                : 'Adding database index for user lookup queries'}
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
            
            <div className="w-full max-w-md">
              <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${remediationState.progress}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {remediationState.progress}% complete
              </div>
            </div>
          </div>
        </div>
      ) : remediationState.stage === 'diagnosis' ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI Diagnosis Results</h3>
            <p className="text-gray-600">
              Based on analysis of metrics, logs, and traces, the following issues have been identified:
            </p>
          </div>
          
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Database Connection Bottleneck
            </h4>
            <p className="text-yellow-800 mb-3">
              The database connection pool is undersized for current traffic levels, causing connection wait times.
            </p>
            <div className="space-y-2 text-sm text-yellow-700">
              <p>• Current pool size: 10 connections</p>
              <p>• Average wait time: 110ms</p>
              <p>• Connection errors: 23 in last hour</p>
              <p>• Similar to incident #IN-2023-089 from October 12</p>
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Missing Database Index
            </h4>
            <p className="text-yellow-800 mb-3">
              User lookup queries are performing full table scans due to missing index.
            </p>
            <div className="space-y-2 text-sm text-yellow-700">
              <p>• Affected table: users</p>
              <p>• Slow query: SELECT * FROM users WHERE last_login greater ?</p>
              <p>• Average query time: 85ms</p>
              <p>• Query frequency: ~500/min</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Recommended Solutions</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-green-800 mb-1 flex items-center">
                      Increase Connection Pool Size
                    </h4>
                    <p className="text-green-800 text-sm mb-2">
                      Increase database connection pool from 10 to 25 connections to handle current traffic.
                    </p>
                    <div className="flex items-center text-sm">
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Confidence: 87%
                      </span>
                      <span className="ml-2 text-green-700">Est. time: &lt;1 min</span>
                    </div>
                  </div>
                  <button 
                    className="px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-md hover:bg-green-200 transition-colors duration-200"
                    onClick={() => applyAutomatedFix('pool')}
                  >
                    Apply Fix
                  </button>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1 flex items-center">
                      Add Index on last_login Column
                    </h4>
                    <p className="text-blue-800 text-sm mb-2">
                      Create index on users.last_login to improve query performance.
                    </p>
                    <div className="flex items-center text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Confidence: 65%
                      </span>
                      <span className="ml-2 text-blue-700">Est. time: 2-5 mins</span>
                    </div>
                  </div>
                  <button 
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-md hover:bg-blue-200 transition-colors duration-200"
                    onClick={() => applyAutomatedFix('index')}
                  >
                    Apply Fix
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : remediationApplied ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6 flex items-center justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-center text-gray-900 mb-4">Solution Successfully Implemented</h3>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
            <p className="text-green-800">
              <span className="font-medium">Applied Fix:</span> {remediationState.solution}
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
          
          {showFeedbackForm && (
            <div className="border rounded-md p-4 mb-4">
              <h4 className="font-medium text-md mb-3">Provide Feedback</h4>
              <p className="text-sm text-gray-600 mb-4">Was this solution helpful? Your feedback helps improve our AI.</p>
              
              <div className="flex space-x-2 mb-4">
                <button className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 text-sm flex-1">
                  Very Helpful
                </button>
                <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm flex-1">
                  Somewhat Helpful
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm flex-1">
                  Not Helpful
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Comments (Optional)
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                  placeholder="Share any additional feedback..."
                ></textarea>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </motion.div>
  );
};

export default AiDiagnosticTab;