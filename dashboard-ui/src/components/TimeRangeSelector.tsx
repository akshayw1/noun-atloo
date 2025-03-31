// components/TimeRangeSelector.jsx
import { Clock } from 'lucide-react';

const TimeRangeSelector = ({ selectedTimeRange, setSelectedTimeRange }:any) => {
  return (
    <div className="flex mb-6">
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-1 inline-flex">
        {['1h', '6h', '24h', '7d', '30d'].map((range) => (
          <button
            key={range}
            className={`px-3 py-1 text-sm rounded-md ${
              selectedTimeRange === range
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            } transition-colors duration-200`}
            onClick={() => setSelectedTimeRange(range)}
          >
            {range}
          </button>
        ))}
        <button className="px-3 py-1 text-sm text-gray-600 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Custom
        </button>
      </div>
    </div>
  );
};

export default TimeRangeSelector;