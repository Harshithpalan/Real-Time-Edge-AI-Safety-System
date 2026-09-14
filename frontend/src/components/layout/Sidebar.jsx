import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Eye, Bell, BarChart3, Users, Settings, Shield, Zap } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useAlerts } from '../../context/AlertContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/detections', icon: Eye, label: 'Detections' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/workers', icon: Users, label: 'Workers' },
  { to: '/settings', icon: Settings, label: 'Settings' }
];

export default function Sidebar() {
  const { connected } = useSocket();
  const { activeCount } = useAlerts();

  return (
    <aside className="w-64 bg-panel border-r border-gray-700/50 flex flex-col">
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-danger/20 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-danger" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white">Edge AI</h1>
            <p className="text-xs text-gray-400">Safety System</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-success animate-pulse' : 'bg-danger'}`} />
          <span className="text-xs text-gray-400">{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-info/10 text-info-light border border-info/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-surface-light'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
            {label === 'Alerts' && activeCount > 0 && (
              <span className="ml-auto bg-danger text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                {activeCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Zap className="w-3 h-3" />
          <span>Real-Time Monitoring</span>
        </div>
      </div>
    </aside>
  );
}
