import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Socket connected');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Socket disconnected');
    });

    newSocket.on('init:state', (data) => {
      setCameras(data.cameras);
      setStats(data.stats);
    });

    newSocket.on('stats:update', (data) => {
      setStats(data.stats);
    });

    newSocket.on('camera:status', (data) => {
      setCameras(prev => prev.map(c => c.id === data.camera.id ? data.camera : c));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, cameras, stats }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
