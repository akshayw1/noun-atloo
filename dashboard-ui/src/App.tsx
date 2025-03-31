import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/components/HomePage';
import DashboardPage from './pages/DashboardPage';
import MetricsPage from './pages/MetricsPage';
import TracesPage from './pages/TracesPage';
import AlertsPage from './pages/AlertPage';
import ApiDetail from './pages/ApiDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route index element={<DashboardPage />} />
          <Route path="metrics" element={<MetricsPage />} />
          <Route path="traces" element={<TracesPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="api/:id" element={<ApiDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
