import { useState, useEffect } from 'react';
import { detectionsApi } from '../api/client';
import SeverityBadge from '../components/common/SeverityBadge';
import { formatTimestamp, confidenceColor } from '../utils/helpers';
import { DETECTION_TYPES } from '../utils/constants';
import { Eye, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DetectionLogs() {
  const [detections, setDetections] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ type: '', cameraId: '' });
  const limit = 20;

  useEffect(() => {
    loadDetections();
  }, [page, filters]);

  const loadDetections = async () => {
    try {
      const params = { limit, offset: page * limit };
      if (filters.type) params.type = filters.type;
      if (filters.cameraId) params.cameraId = filters.cameraId;
      const res = await detectionsApi.getAll(params);
      setDetections(res.detections);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to load detections:', err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="w-6 h-6 text-info-light" />
          <h1 className="text-xl font-bold text-white">Detection Logs</h1>
        </div>
        <span className="text-sm text-gray-400">{total} total detections</span>
      </div>

      <div className="flex items-center gap-4 bg-panel border border-gray-700/50 rounded-xl p-4">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={filters.type}
          onChange={(e) => { setFilters(prev => ({ ...prev, type: e.target.value })); setPage(0); }}
          className="bg-surface-light border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-info"
        >
          <option value="">All Types</option>
          <option value="person">Person</option>
          <option value="fall">Fall</option>
        </select>
        <input
          type="text"
          placeholder="Camera ID..."
          value={filters.cameraId}
          onChange={(e) => { setFilters(prev => ({ ...prev, cameraId: e.target.value })); setPage(0); }}
          className="bg-surface-light border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-info w-40"
        />
      </div>

      <div className="bg-panel border border-gray-700/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Time</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Camera</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Type</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Confidence</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Severity</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Worker</th>
            </tr>
          </thead>
          <tbody>
            {detections.map((det) => {
              const typeConfig = DETECTION_TYPES[det.type] || DETECTION_TYPES.person;
              return (
                <tr key={det.id} className="border-b border-gray-700/30 hover:bg-surface-light transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">
                    {formatTimestamp(det.timestamp)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{det.cameraId}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeConfig.bg} ${typeConfig.color}`}>
                      {typeConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-mono font-medium ${confidenceColor(det.confidence)}`}>
                      {(det.confidence * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {det.metadata.severity ? (
                      <SeverityBadge severity={det.metadata.severity} />
                    ) : (
                      <span className="text-gray-500 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {det.metadata.personId || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {detections.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No detections found
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-panel border border-gray-700/50 rounded-lg disabled:opacity-30 hover:bg-surface-light transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-panel border border-gray-700/50 rounded-lg disabled:opacity-30 hover:bg-surface-light transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
