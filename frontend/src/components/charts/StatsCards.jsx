import { Activity, AlertTriangle, MapPin, Users } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      label: 'Total Detections',
      value: stats.totalDetections,
      sub: `${stats.detections24h || 0} in 24h`,
      icon: Activity,
      color: 'text-info-light',
      bg: 'bg-info/10'
    },
    {
      label: 'Active Alerts',
      value: stats.activeAlerts,
      sub: `${stats.totalAlerts} total`,
      icon: AlertTriangle,
      color: 'text-danger-light',
      bg: 'bg-danger/10',
      pulse: stats.activeAlerts > 0
    },
    {
      label: 'Zones Online',
      value: `${stats.onlineZones}/${stats.totalZones}`,
      sub: 'Monitoring',
      icon: MapPin,
      color: 'text-success-light',
      bg: 'bg-success/10'
    },
    {
      label: 'Workers On-Site',
      value: stats.workersOnSite,
      sub: `${stats.totalWorkers} registered`,
      icon: Users,
      color: 'text-warning-light',
      bg: 'bg-warning/10'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map(({ label, value, sub, icon: Icon, color, bg, pulse }) => (
        <div key={label} className="bg-panel border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${pulse ? 'text-danger animate-pulse' : color}`}>
                {value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{sub}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
