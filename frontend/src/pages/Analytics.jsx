import { useState, useEffect } from 'react';
import { statsApi, zonesApi } from '../api/client';
import StatsCards from '../components/charts/StatsCards';
import DetectionChart from '../components/charts/DetectionChart';
import ZoneHeatmap from '../components/charts/ZoneHeatmap';
import { BarChart3 } from 'lucide-react';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [zones, setZones] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, zonesRes] = await Promise.all([
        statsApi.getDashboard(),
        zonesApi.getAll()
      ]);
      setStats(statsRes.stats);
      setZones(zonesRes.zones);

      const perHour = statsRes.stats.detectionsPerHour || {};
      const formatted = Object.entries(perHour)
        .slice(-24)
        .map(([hour, count]) => ({
          time: hour.slice(11, 13) + ':00',
          person: Math.floor(count * 0.95),
          fall: Math.ceil(count * 0.05)
        }));
      setChartData(formatted);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-info-light" />
        <h1 className="text-xl font-bold text-white">Analytics</h1>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetectionChart data={chartData} />
        <ZoneHeatmap zones={zones} detectionsPerZone={stats?.detectionsPerZone} />
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-panel border border-gray-700/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-4">Detection Types (24h)</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Person Detections</span>
                <span className="text-lg font-bold text-info-light">{stats.personDetections24h}</span>
              </div>
              <div className="w-full bg-surface-light rounded-full h-2">
                <div
                  className="bg-info rounded-full h-2"
                  style={{ width: `${stats.detections24h > 0 ? (stats.personDetections24h / stats.detections24h) * 100 : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Fall Detections</span>
                <span className="text-lg font-bold text-danger-light">{stats.fallDetections24h}</span>
              </div>
              <div className="w-full bg-surface-light rounded-full h-2">
                <div
                  className="bg-danger rounded-full h-2"
                  style={{ width: `${stats.detections24h > 0 ? (stats.fallDetections24h / stats.detections24h) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-panel border border-gray-700/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-4">Camera Status</h3>
            <div className="space-y-3">
              {stats.cameras?.map((cam) => (
                <div key={cam.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${cam.status === 'online' ? 'bg-success' : 'bg-danger'}`} />
                    <span className="text-sm text-gray-300">{cam.name}</span>
                  </div>
                  <span className={`text-xs font-medium ${cam.status === 'online' ? 'text-success' : 'text-danger'}`}>
                    {cam.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
