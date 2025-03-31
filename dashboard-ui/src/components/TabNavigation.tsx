// components/TabNavigation.jsx

const TabNavigation = ({ selectedTab, setSelectedTab, apiHealth, remediationApplied }:any) => {
    return (
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'traces', 'alerts', 'dependencies', 'ai-diagnostic'].map((tab) => (
            <button
              key={tab}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${selectedTab === tab 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                transition-colors duration-200
              `}
              onClick={() => setSelectedTab(tab)}
            >
              {tab === 'ai-diagnostic' ? 'AI Diagnostic' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'ai-diagnostic' && apiHealth === 'degraded' && !remediationApplied && (
                <span className="ml-2 w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
              )}
            </button>
          ))}
        </nav>
      </div>
    );
  };
  
  export default TabNavigation;