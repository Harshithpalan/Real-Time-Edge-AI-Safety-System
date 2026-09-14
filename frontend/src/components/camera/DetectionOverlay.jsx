import { DETECTION_TYPES } from '../../utils/constants';
import { confidenceColor } from '../../utils/helpers';

export default function DetectionOverlay({ detections }) {
  if (!detections || detections.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {detections.map((detection) => {
        const { x, y, width, height } = detection.boundingBox;
        const isFall = detection.type === 'fall';
        const typeConfig = DETECTION_TYPES[detection.type];

        return (
          <div
            key={detection.id}
            className={`absolute border-2 rounded transition-all duration-300 ${
              isFall
                ? 'border-danger bg-danger/10 animate-pulse'
                : 'border-info bg-info/10'
            }`}
            style={{
              left: `${(x / 1920) * 100}%`,
              top: `${(y / 1080) * 100}%`,
              width: `${(width / 1920) * 100}%`,
              height: `${(height / 1080) * 100}%`
            }}
          >
            <div
              className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${
                isFall ? 'bg-danger text-white' : 'bg-info text-white'
              }`}
            >
              {isFall ? '🚨 FALL' : '👤 Person'} {Math.round(detection.confidence * 100)}%
            </div>

            {isFall && (
              <div className="absolute inset-0 border border-danger/50 animate-ping rounded" />
            )}
          </div>
        );
      })}
    </div>
  );
}
