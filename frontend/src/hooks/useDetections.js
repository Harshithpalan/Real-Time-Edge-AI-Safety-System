import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';

export function useDetections(cameraId) {
  const { socket } = useSocket();
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleDetection = (data) => {
      if (cameraId && data.cameraId !== cameraId) return;
      setDetections(prev => [data.detection, ...prev].slice(0, 50));
    };

    socket.on('detection', handleDetection);
    return () => socket.off('detection', handleDetection);
  }, [socket, cameraId]);

  const clearDetections = useCallback(() => {
    setDetections([]);
  }, []);

  return { detections, clearDetections };
}
