import { ZONE_RISK_COLORS } from '../../utils/constants';

export default function ZoneHeatmap({ zones, detectionsPerZone }) {
  if (!zones || zones.length === 0) return null;

  return (
    <div className="bg-panel border border-gray-700/50 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Zone Activity</h3>
      <div className="grid grid-cols-2 gap-3">
        {zones.map((zone) => {
          const count = detectionsPerZone?.[zone.id] || 0;
          const maxCount = Math.max(...Object.values(detectionsPerZone || {}), 1);
          const intensity = Math.min(count / maxCount, 1);
          const riskColor = ZONE_RISK_COLORS[zone.riskLevel] || 'text-gray-400';

          return (
            <div
              key={zone.id}
              className="rounded-lg border border-gray-700/50 p-3 transition-all hover:border-gray-600"
              style={{
                background: `rgba(59, 130, 246, ${intensity * 0.15})`
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">{zone.name}</span>
                <span className={`text-xs font-medium capitalize ${riskColor}`}>
                  {zone.riskLevel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-info-light">{count}</span>
                <span className="text-xs text-gray-400">
                  {zone.currentOccupancy}/{zone.maxOccupancy}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
