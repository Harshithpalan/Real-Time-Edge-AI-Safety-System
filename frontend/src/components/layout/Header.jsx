import { useSocket } from '../../context/SocketContext';
import { useAlerts } from '../../context/AlertContext';
import { Bell, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { connected } = useSocket();
  const { activeCount } = useAlerts();
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-panel border-b border-gray-700/50 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-gray-300">Real-Time Edge AI Safety Monitoring</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          {connected ? (
            <Wifi className="w-4 h-4 text-success" />
          ) : (
            <WifiOff className="w-4 h-4 text-danger" />
          )}
          <span className={connected ? 'text-success' : 'text-danger'}>
            {connected ? 'Live' : 'Offline'}
          </span>
        </div>

        <button
          onClick={() => navigate('/alerts')}
          className="relative p-2 rounded-lg hover:bg-surface-light transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {activeCount > 9 ? '9+' : activeCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
