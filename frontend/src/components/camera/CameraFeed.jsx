import { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import DetectionOverlay from './DetectionOverlay';
import { formatTimestamp } from '../../utils/helpers';

export default function CameraFeed({ camera }) {
  const { socket } = useSocket();
  const [detections, setDetections] = useState([]);
  const [detectionCount, setDetectionCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    socket.emit('subscribe:camera', camera.id);

    const handleDetection = (data) => {
      if (data.cameraId !== camera.id) return;
      setDetections(prev => [data.detection, ...prev].slice(0, 10));
      setDetectionCount(prev => prev + 1);

      setTimeout(() => {
        setDetections(prev => prev.filter(d => d.id !== data.detection.id));
      }, 3000);
    };

    socket.on('detection', handleDetection);
    return () => {
      socket.off('detection', handleDetection);
      socket.emit('unsubscribe', `camera:${camera.id}`);
    };
  }, [socket, camera.id]);

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700/50 overflow-hidden aspect-video">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-gray-400"
              style={{ top: `${(i + 1) * 5}%` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 animate-scan-line bg-gradient-to-b from-transparent via-success/5 to-transparent" />
      </div>

      <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
        <div className={`w-2 h-2 rounded-full ${camera.status === 'online' ? 'bg-success animate-pulse' : 'bg-danger'}`} />
        <span className="text-xs font-medium text-white">{camera.name}</span>
      </div>

      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
        <span className="text-xs text-gray-300 font-mono">{formatTimestamp(new Date().toISOString())}</span>
      </div>

      <DetectionOverlay detections={detections} />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-300">{camera.location}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Zone: {camera.zone}</span>
            <span className="text-xs text-info-light font-mono">{detectionCount} detections</span>
          </div>
        </div>
      </div>
    </div>
  );
}
