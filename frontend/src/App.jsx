import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import LocationExplorer from './pages/LocationExplorer';
import AIRecommendations from './pages/AIRecommendations';
import MarketGapAnalysis from './pages/MarketGapAnalysis';
import WhatIfSimulator from './pages/WhatIfSimulator';
import SiteComparison from './pages/SiteComparison';
import Reports from './pages/Reports';
import DataManagement from './pages/DataManagement';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="explorer" element={<LocationExplorer />} />
        <Route path="recommendations" element={<AIRecommendations />} />
        <Route path="market-gap" element={<MarketGapAnalysis />} />
        <Route path="simulator" element={<WhatIfSimulator />} />
        <Route path="comparison" element={<SiteComparison />} />
        <Route path="reports" element={<Reports />} />
        <Route path="data" element={<DataManagement />} />
      </Route>
    </Routes>
  );
}

export default App
