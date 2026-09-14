import { useSocket } from '../../context/SocketContext';
import CameraFeed from './CameraFeed';

export default function CameraGrid() {
  const { cameras } = useSocket();

  const onlineCameras = cameras.filter(c => c.enabled);

  return (
    <div className="grid grid-cols-2 gap-4">
      {onlineCameras.map((camera) => (
        <CameraFeed key={camera.id} camera={camera} />
      ))}
    </div>
  );
}
