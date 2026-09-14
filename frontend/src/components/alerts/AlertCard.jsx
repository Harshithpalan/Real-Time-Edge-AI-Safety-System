import { SEVERITY_COLORS } from '../../utils/constants';
import { formatTimestamp } from '../../utils/helpers';
import { AlertTriangle, User, Clock } from 'lucide-react';

export default function AlertCard({ alert, compact = false, onAcknowledge, onResolve }) {
  const severity = SEVERITY_COLORS[alert.severity] || SEVERITY_COLORS.low;

  return (
    <div
      className={`rounded-lg border p-3 transition-all ${
        alert.acknowledged || alert.resolved
          ? 'bg-surface-light/50 border-gray-700/30 opacity-60'
          : `${severity.bg} ${severity.border}`
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${severity.dot} ${!alert.acknowledged && !alert.resolved ? 'animate-pulse' : ''}`} />
          <div className="min-w-0">
            <p className={`text-sm font-medium ${alert.acknowledged || alert.resolved ? 'text-gray-400' : 'text-white'}`}>
              {alert.message}
            </p>
            {!compact && (
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(alert.timestamp)}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${severity.bg} ${severity.text}`}>
                  {alert.severity}
                </span>
              </div>
            )}
          </div>
        </div>

        {!compact && !alert.resolved && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {!alert.acknowledged && onAcknowledge && (
              <button
                onClick={() => onAcknowledge(alert.id)}
                className="px-2 py-1 text-xs bg-info/20 text-info-light rounded hover:bg-info/30 transition-colors"
              >
                Ack
              </button>
            )}
            {onResolve && (
              <button
                onClick={() => onResolve(alert.id)}
                className="px-2 py-1 text-xs bg-success/20 text-success-light rounded hover:bg-success/30 transition-colors"
              >
                Resolve
              </button>
            )}
          </div>
        )}
      </div>

      {compact && (
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-gray-400">{formatTimestamp(alert.timestamp)}</span>
          <span className={`text-xs px-1 rounded ${severity.bg} ${severity.text}`}>{alert.severity}</span>
        </div>
      )}
    </div>
  );
}
