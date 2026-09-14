import { useState, useEffect } from 'react';
import CameraGrid from '../components/camera/CameraGrid';
import AlertPanel from '../components/alerts/AlertPanel';
import StatsCards from '../components/charts/StatsCards';
import { useSocket } from '../context/SocketContext';
import { statsApi } from '../api/client';

export default function Dashboard() {
  const { stats: socketStats } = useSocket();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    statsApi.getDashboard().then(res => setStats(res.stats));
  }, []);

  useEffect(() => {
    if (socketStats) {
      setStats(prev => ({ ...prev, ...socketStats }));
    }
  }, [socketStats]);

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <CameraGrid />
        </div>
        <div className="lg:col-span-1">
          <AlertPanel />
        </div>
      </div>
    </div>
  );
}
