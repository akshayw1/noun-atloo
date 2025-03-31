// components/ApiDetailHeader.jsx
import { ArrowLeft, Bookmark, RefreshCw, Download } from 'lucide-react';
import { getHealthColor } from '@/pages/ApiDetail';

const ApiDetailHeader = ({ api, apiHealth, isBookmarked, setIsBookmarked, navigate }:any) => {
  const healthColor = getHealthColor(apiHealth);

  return (
    <div className="mb-6 flex items-center">
      <button 
        onClick={() => navigate(-1)} 
        className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      
      <div className="flex-1">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">{api.method} {api.path}</h1>
          <div className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${healthColor.bg} bg-opacity-10 ${healthColor.text}`}>
            {apiHealth}
          </div>
          <button 
            className={`ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 ${isBookmarked ? 'text-blue-500' : 'text-gray-400'}`}
            onClick={() => setIsBookmarked(!isBookmarked)}
            title={isBookmarked ? "Remove bookmark" : "Bookmark API"}
          >
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-500 mt-1">{api.description}</p>
      </div>
      
      <div className="flex space-x-2">
        <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm flex items-center transition-colors duration-200">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
        <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm flex items-center transition-colors duration-200">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>
    </div>
  );
};

export default ApiDetailHeader;