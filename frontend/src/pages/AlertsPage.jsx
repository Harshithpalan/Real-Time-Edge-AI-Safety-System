import { useState, useEffect } from 'react';
import { alertsApi } from '../api/client';
import { useAlerts } from '../context/AlertContext';
import AlertCard from '../components/alerts/AlertCard';
import { Bell, Filter } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const { acknowledgeAlert, resolveAlert } = useAlerts();

  useEffect(() => {
    loadAlerts();
  }, [statusFilter]);

  const loadAlerts = async () => {
    try {
      const params = { limit: 50 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await alertsApi.getAll(params);
      setAlerts(res.alerts);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    }
  };

  const handleAcknowledge = async (alertId) => {
    await acknowledgeAlert(alertId, 'operator');
    loadAlerts();
  };

  const handleResolve = async (alertId) => {
    await resolveAlert(alertId);
    loadAlerts();
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'acknowledged', label: 'Acknowledged' },
    { key: 'resolved', label: 'Resolved' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-danger" />
          <h1 className="text-xl font-bold text-white">Alerts</h1>
        </div>
        <span className="text-sm text-gray-400">{total} alerts</span>
      </div>

      <div className="flex items-center gap-2 bg-panel border border-gray-700/50 rounded-xl p-2">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === key
                ? 'bg-info/20 text-info-light'
                : 'text-gray-400 hover:text-gray-200 hover:bg-surface-light'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="bg-panel border border-gray-700/50 rounded-xl p-12 text-center">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No alerts found</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
            />
          ))
        )}
      </div>
    </div>
  );
}
