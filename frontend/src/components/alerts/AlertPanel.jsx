import { useAlerts } from '../../context/AlertContext';
import AlertCard from './AlertCard';
import { Bell, Wifi } from 'lucide-react';

export default function AlertPanel() {
  const { alerts } = useAlerts();

  const recentAlerts = alerts.slice(0, 15);

  return (
    <div className="bg-panel border border-gray-700/50 rounded-xl flex flex-col h-full">
      <div className="p-3 border-b border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-danger" />
          <h3 className="text-sm font-semibold text-white">Live Alerts</h3>
        </div>
        {alerts.length > 0 && (
          <div className="w-2 h-2 bg-danger rounded-full animate-pulse" />
        )}
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-2">
        {recentAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Bell className="w-8 h-8 mb-2" />
            <p className="text-xs">No alerts</p>
          </div>
        ) : (
          recentAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} compact />
          ))
        )}
      </div>
    </div>
  );
}
