import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import DetectionLogs from './pages/DetectionLogs';
import AlertsPage from './pages/AlertsPage';
import Analytics from './pages/Analytics';
import Workers from './pages/Workers';
import Settings from './pages/Settings';
import AlertToast from './components/alerts/AlertToast';

export default function App() {
  return (
    <>
      <AlertToast />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/detections" element={<DetectionLogs />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </>
  );
}
