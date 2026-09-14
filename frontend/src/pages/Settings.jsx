import { useState, useEffect } from 'react';
import { camerasApi, zonesApi } from '../api/client';
import StatusBadge from '../components/common/StatusBadge';
import { Settings as SettingsIcon, Camera, MapPin } from 'lucide-react';
import { ZONE_RISK_COLORS } from '../utils/constants';

export default function Settings() {
  const [cameras, setCameras] = useState([]);
  const [zones, setZones] = useState([]);
  const [activeTab, setActiveTab] = useState('cameras');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [camRes, zoneRes] = await Promise.all([
        camerasApi.getAll(),
        zonesApi.getAll()
      ]);
      setCameras(camRes.cameras);
      setZones(zoneRes.zones);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const toggleCamera = async (camera) => {
    await camerasApi.update(camera.id, { enabled: !camera.enabled });
    loadData();
  };

  const updateZoneRisk = async (zone, riskLevel) => {
    await zonesApi.update(zone.id, { riskLevel });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-6 h-6 text-gray-400" />
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </div>

      <div className="flex items-center gap-2 bg-panel border border-gray-700/50 rounded-xl p-2">
        <button
          onClick={() => setActiveTab('cameras')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'cameras' ? 'bg-info/20 text-info-light' : 'text-gray-400 hover:text-gray-200 hover:bg-surface-light'
          }`}
        >
          <Camera className="w-4 h-4" /> Cameras
        </button>
        <button
          onClick={() => setActiveTab('zones')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'zones' ? 'bg-info/20 text-info-light' : 'text-gray-400 hover:text-gray-200 hover:bg-surface-light'
          }`}
        >
          <MapPin className="w-4 h-4" /> Zones
        </button>
      </div>

      {activeTab === 'cameras' && (
        <div className="space-y-3">
          {cameras.map((camera) => (
            <div key={camera.id} className="bg-panel border border-gray-700/50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${camera.enabled ? 'bg-success/20' : 'bg-gray-700/50'}`}>
                  <Camera className={`w-5 h-5 ${camera.enabled ? 'text-success' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{camera.name}</p>
                  <p className="text-xs text-gray-400">{camera.location} • Zone: {camera.zone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={camera.status} />
                <button
                  onClick={() => toggleCamera(camera)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    camera.enabled
                      ? 'bg-danger/20 text-danger-light hover:bg-danger/30'
                      : 'bg-success/20 text-success-light hover:bg-success/30'
                  }`}
                >
                  {camera.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'zones' && (
        <div className="space-y-3">
          {zones.map((zone) => {
            const riskColor = ZONE_RISK_COLORS[zone.riskLevel] || 'text-gray-400';
            return (
              <div key={zone.id} className="bg-panel border border-gray-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{zone.name}</p>
                    <p className="text-xs text-gray-400">
                      Cameras: {zone.cameraIds.join(', ')} • Occupancy: {zone.currentOccupancy}/{zone.maxOccupancy}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={zone.riskLevel}
                      onChange={(e) => updateZoneRisk(zone, e.target.value)}
                      className="bg-surface-light border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-info"
                    >
                      <option value="low">Low Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="high">High Risk</option>
                      <option value="critical">Critical</option>
                    </select>
                    <span className={`text-xs font-medium capitalize ${riskColor}`}>
                      {zone.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
