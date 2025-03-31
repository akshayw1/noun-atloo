// components/AlertBanner.jsx
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const AlertBanner = ({ type, setSelectedTab, setShowAIRemediation, activeFix }:any) => {
  if (type === 'warning') {
    return (
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
              Performance Issue Detected
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                This API is experiencing unusually high latency (240ms vs. normal 75ms). AI diagnostic has identified potential issues and solutions.
              </p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-md hover:bg-yellow-200"
                  onClick={() => setSelectedTab('ai-diagnostic')}
                >
                  View AI Diagnosis
                </button>
                <button
                  type="button"
                  className="ml-3 px-3 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-md hover:bg-yellow-200"
                  onClick={() => setShowAIRemediation(true)}
                >
                  Show Remediation Options
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  if (type === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Performance Issue Resolved
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                The performance issue has been successfully resolved through {activeFix === 'pool' ? 'database connection pool optimization' : 'database index creation'}.
                Average latency has returned to normal levels (75ms).
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return null;
};

export default AlertBanner;