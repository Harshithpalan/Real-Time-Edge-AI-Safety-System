import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import toast from 'react-hot-toast';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const { socket } = useSocket();
  const [alerts, setAlerts] = useState([]);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    socket.on('alert', (data) => {
      setAlerts(prev => [data.alert, ...prev].slice(0, 100));
      setActiveCount(prev => prev + 1);

      const severityColors = {
        critical: '#EF4444',
        high: '#F97316',
        medium: '#F59E0B',
        low: '#3B82F6'
      };

      toast.error(data.alert.message, {
        duration: data.alert.severity === 'critical' ? 8000 : 5000,
        style: {
          background: '#1E1E2E',
          color: '#FCA5A5',
          border: `1px solid ${severityColors[data.alert.severity] || '#EF4444'}`
        },
        icon: data.alert.severity === 'critical' ? '🚨' : '⚠️'
      });
    });

    socket.on('alert:updated', (data) => {
      setAlerts(prev => prev.map(a => a.id === data.alert.id ? data.alert : a));
      if (data.alert.acknowledged || data.alert.resolved) {
        setActiveCount(prev => Math.max(0, prev - 1));
      }
    });

    return () => {
      socket.off('alert');
      socket.off('alert:updated');
    };
  }, [socket]);

  const acknowledgeAlert = async (alertId, by = 'operator') => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledgedBy: by })
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/resolve`, { method: 'POST' });
      return await res.json();
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  return (
    <AlertContext.Provider value={{ alerts, activeCount, setActiveCount, acknowledgeAlert, resolveAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  return useContext(AlertContext);
}
