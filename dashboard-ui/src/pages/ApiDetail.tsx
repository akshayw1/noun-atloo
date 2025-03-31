import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { mockData } from '@/data/data';
import ApiDetailHeader from '@/components/ApiDetailHeader';
import TimeRangeSelector from '@/components/TimeRangeSelector';
import AlertBanner from '@/components/AlertBanner';
import MetricsOverview from '@/components/MetricsOverview';
import TabNavigation from '@/components/TabNavigation';
import OverviewTab from '@/components/tabs/OverviewTab';
import TracesTab from '@/components/tabs/TracesTab';
import AlertsTab from '@/components/tabs/AlertTab';
import DependenciesTab from '@/components/tabs/DependenciesTab';
import AiDiagnosticTab from '@/components/tabs/AiDiagnosticTab';

// Types
export interface ApiData {
  id: number;
  path: string;
  method: string;
  health: string;
  description: string;
  requestRate: number;
  requestRateTrend: number;
  errorRate: number;
  errorRateTrend: number;
  latency: number;
  latencyTrend: number;
  requestHistory: { value: number }[];
}

export interface RemediationState {
  stage: 'initial' | 'analyzing' | 'diagnosis' | 'implementing' | 'complete';
  progress: number;
  solution?: string;
  confidence?: number;
}

export interface TimeSeriesDataPoint {
  time: string;
  value: number;
}

export interface LatencyPercentileDataPoint {
  time: string;
  p50: number;
  p90: number;
  p95: number;
  p99: number;
}

export interface StatusCodeDataPoint {
  status: string;
  count: number;
  color: string;
}

export interface TraceDurationDataPoint {
  range: string;
  count: number;
}

export interface Dependency {
  name: string;
  latency: number;
  calls: number;
  errorRate: number;
}

export interface Trace {
  id: string;
  timestamp: string;
  duration: number;
  status: string;
  path: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: string;
  time: string;
}

export interface DetailedData {
  requestRate: TimeSeriesDataPoint[];
  errorRate: TimeSeriesDataPoint[];
  latency: LatencyPercentileDataPoint[];
  statusCodes: StatusCodeDataPoint[];
  traceDurations: TraceDurationDataPoint[];
  dependencies: Dependency[];
  relatedAlerts: Alert[];
  traces: Trace[];
}

// Component type definition
const ApiDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initTab = searchParams.get('tab') || 'overview';
  const navigate = useNavigate();
  
  // State
  const [api, setApi] = useState<ApiData | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>(initTab);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [setShowAIRemediation] = useState<boolean>(false);
  const [remediationState, setRemediationState] = useState<RemediationState>({
    stage: 'initial',
    progress: 0
  });
  const [remediationApplied, setRemediationApplied] = useState<boolean>(false);
  const [activeFix, setActiveFix] = useState<string | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState<boolean>(false);

  // Find the API by ID
  useEffect(() => {
    const apiData = mockData.apis.find((api) => api.id.toString() === id);
    if (apiData) {
      setApi(apiData as ApiData);
    } else {
      setApi(null);
    }
  }, [id]);

  // Use tab from URL
  useEffect(() => {
    if (initTab) {
      setSelectedTab(initTab);
    }
  }, [initTab]);

  // AI diagnosis simulation
  useEffect(() => {
    if (selectedTab === 'ai-diagnostic' && !remediationApplied) {
      setRemediationState({
        stage: 'analyzing',
        progress: 0
      });
      
      // Simulate analysis progress
      const interval = setInterval(() => {
        setRemediationState(prev => {
          if (prev.progress < 100) {
            return { ...prev, progress: prev.progress + 10 };
          } else if (prev.stage === 'analyzing') {
            return {
              stage: 'diagnosis',
              progress: 100,
              solution: 'Increase database connection pool size from 10 to 25',
              confidence: 87
            };
          }
          return prev;
        });
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [selectedTab, remediationApplied]);

  // Apply the automated fix
  const applyAutomatedFix = (fixType: string): void => {
    setActiveFix(fixType);
    setRemediationState({
      ...remediationState,
      stage: 'implementing',
      progress: 0
    });
    
    // Simulate implementation progress
    const interval = setInterval(() => {
      setRemediationState(prev => {
        if (prev.progress < 100) {
          return { ...prev, progress: prev.progress + 10 };
        } else {
          clearInterval(interval);
          setRemediationState({
            stage: 'complete',
            progress: 100,
            solution: fixType === 'pool' 
              ? 'Increased database connection pool size from 10 to 25' 
              : 'Added index on users.last_login column',
            confidence: fixType === 'pool' ? 87 : 65
          });
          
          setTimeout(() => {
            setRemediationApplied(true);
            // Show feedback form after successful implementation
            setTimeout(() => {
              setShowFeedbackForm(true);
            }, 1000);
          }, 1000);
        }
        return prev;
      });
    }, 300);
  };

  if (!api || !id) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  // Set the health status based on the path for the demo
  const apiHealth = id === '2' ? (remediationApplied ? 'healthy' : 'degraded') : api.health;
  
  // Data helpers (available to child components)
  const detailedData = generateDetailedData(id);

  return (
    <div className="pb-8">
      {/* Header with back button */}
      <ApiDetailHeader 
        api={api} 
        apiHealth={apiHealth} 
        isBookmarked={isBookmarked} 
        setIsBookmarked={setIsBookmarked} 
        navigate={navigate} 
      />

      {/* Time range selector */}
      <TimeRangeSelector 
        selectedTimeRange={selectedTimeRange} 
        setSelectedTimeRange={setSelectedTimeRange} 
      />

      {/* AI Remediation Alert - Show for degraded API */}
      {apiHealth === 'degraded' && !remediationApplied && (
        <AlertBanner 
          type="warning"
          setSelectedTab={setSelectedTab}
          setShowAIRemediation={setShowAIRemediation}
        />
      )}

      {/* Success alert after remediation */}
      {remediationApplied && (
        <AlertBanner 
          type="success"
          activeFix={activeFix}
        />
      )}

      {/* Overview metrics */}
      <MetricsOverview 
        api={api} 
        apiHealth={apiHealth} 
        remediationApplied={remediationApplied} 
        id={id}
        detailedData={detailedData} 
      />

      {/* Tab navigation */}
      <TabNavigation 
        selectedTab={selectedTab} 
        setSelectedTab={setSelectedTab} 
        apiHealth={apiHealth}
        remediationApplied={remediationApplied}
      />

      {/* Tab content */}
      <div className="space-y-6">
        {selectedTab === 'overview' && (
          <OverviewTab 
            detailedData={detailedData} 
            id={id} 
            remediationApplied={remediationApplied} 
          />
        )}
        
        {selectedTab === 'traces' && (
          <TracesTab detailedData={detailedData} />
        )}
        
        {selectedTab === 'alerts' && (
          <AlertsTab detailedData={detailedData} />
        )}
        
        {selectedTab === 'dependencies' && (
          <DependenciesTab detailedData={detailedData} />
        )}
        
        {selectedTab === 'ai-diagnostic' && (
          <AiDiagnosticTab 
            remediationState={remediationState}
            remediationApplied={remediationApplied}
            activeFix={activeFix}
            showFeedbackForm={showFeedbackForm}
            applyAutomatedFix={applyAutomatedFix}
          />
        )}
      </div>
    </div>
  );
};

// Utility function to generate sample time series data
const generateTimeSeriesData = (hours: number, baseValue: number, variance: number, trend: number = 0): TimeSeriesDataPoint[] => {
  return Array.from({ length: hours }, (_, i) => {
    const time = new Date();
    time.setHours(time.getHours() - (hours - i));
    
    // Add some trend and randomness
    const trendFactor = trend * (i / hours);
    const randomFactor = (Math.random() - 0.5) * variance;
    const value = Math.max(0, baseValue * (1 + trendFactor + randomFactor));
    
    return {
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Number(value.toFixed(2))
    };
  });
};

// Generate percentile data for latency
const generateLatencyPercentileData = (hours: number): LatencyPercentileDataPoint[] => {
  return Array.from({ length: hours }, (_, i) => {
    const time = new Date();
    time.setHours(time.getHours() - (hours - i));
    
    return {
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      p50: Math.round(40 + Math.random() * 20),
      p90: Math.round(80 + Math.random() * 30),
      p95: Math.round(100 + Math.random() * 40),
      p99: Math.round(150 + Math.random() * 100)
    };
  });
};

// Generate status code distribution data
const generateStatusCodeData = (id: string): StatusCodeDataPoint[] => {
  const apiData = mockData.apis.find(a => a.id.toString() === id);
  const errorRate = apiData ? apiData.errorRate / 100 : 0.05;
  
  return [
    { status: '2xx', count: Math.round(10000 * (1 - errorRate)), color: '#34C759' },
    { status: '4xx', count: Math.round(10000 * errorRate * 0.7), color: '#FFCC00' },
    { status: '5xx', count: Math.round(10000 * errorRate * 0.3), color: '#FF3B30' }
  ];
};

// Generate trace duration distribution data
const generateTraceDurationData = (): TraceDurationDataPoint[] => {
  return [
    { range: '0-50ms', count: 320 },
    { range: '50-100ms', count: 820 },
    { range: '100-200ms', count: 540 },
    { range: '200-500ms', count: 320 },
    { range: '500ms+', count: 190 }
  ];
};

// Assemble all detailed data
// Assemble all detailed data
const generateDetailedData = (id: string): DetailedData => {
  // Map the alerts to match the Alert interface
  const mappedAlerts = mockData.alerts.slice(0, 2).map(alert => ({
    id: alert.id.toString(), // Convert to string if your interface expects it
    title: alert.title,
    description: alert.message, // Map message to description
    severity: alert.severity,
    time: alert.time
  }));

  // Map the traces to match the Trace interface
  const mappedTraces = mockData.traces.slice(0, 5).map(trace => ({
    id: trace.traceId, // Use traceId as the id
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: trace.duration,
    status: trace.status === 'error' ? 'error' : 'success', // Convert to the expected union type
    path: trace.name // Use name as the path
  }));

  return {
    requestRate: generateTimeSeriesData(24, 100, 0.4, 0.3),
    errorRate: generateTimeSeriesData(24, 5, 0.6, 0.1),
    latency: generateLatencyPercentileData(24),
    statusCodes: generateStatusCodeData(id),
    traceDurations: generateTraceDurationData(),
    dependencies: [
      { name: 'Database', latency: id === '2' ? 160 : 42, calls: 8762, errorRate: 0.2 },
      { name: 'Cache', latency: 8, calls: 12403, errorRate: 0.1 },
      { name: 'Auth Service', latency: 65, calls: 4281, errorRate: 1.2 }
    ],
    relatedAlerts: mappedAlerts,
    traces: mappedTraces
  };
};

// Helper function to get appropriate color based on health status
export const getHealthColor = (health: string): { bg: string; text: string } => {
  switch (health) {
    case 'healthy': return { bg: 'bg-green-500', text: 'text-green-500' };
    case 'degraded': return { bg: 'bg-yellow-500', text: 'text-yellow-500' };
    case 'unhealthy':
    case 'critical': return { bg: 'bg-red-500', text: 'text-red-500' };
    default: return { bg: 'bg-gray-500', text: 'text-gray-500' };
  }
};

// Helper function for trend indicators
export const getTrendIndicator = (value: number, isInverse: boolean = false): { arrow: string; color: string } => {
  if (value === 0) return { arrow: '→', color: 'text-gray-500' };
  
  const isPositive = value > 0;
  const arrow = isPositive ? '↑' : '↓';
  const color = (isPositive && !isInverse) || (!isPositive && isInverse) ? 'text-green-500' : 'text-red-500';
  
  return { arrow, color };
};

export default ApiDetail;