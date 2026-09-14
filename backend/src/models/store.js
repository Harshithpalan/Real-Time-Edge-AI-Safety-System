const { v4: uuidv4 } = require('uuid');

const store = {
  cameras: [
    { id: 'cam-1', name: 'Assembly Line A', zone: 'zone-1', status: 'online', streamUrl: null, location: 'Building 1, Floor 2', enabled: true },
    { id: 'cam-2', name: 'Warehouse Bay 3', zone: 'zone-2', status: 'online', streamUrl: null, location: 'Building 2, Floor 1', enabled: true },
    { id: 'cam-3', name: 'Loading Dock', zone: 'zone-3', status: 'online', streamUrl: null, location: 'Building 1, Loading Area', enabled: true },
    { id: 'cam-4', name: 'Chemical Storage', zone: 'zone-4', status: 'offline', streamUrl: null, location: 'Building 3, Basement', enabled: false }
  ],

  zones: [
    { id: 'zone-1', name: 'Assembly Line A', cameraIds: ['cam-1'], riskLevel: 'high', maxOccupancy: 5, currentOccupancy: 0 },
    { id: 'zone-2', name: 'Warehouse Bay 3', cameraIds: ['cam-2'], riskLevel: 'medium', maxOccupancy: 8, currentOccupancy: 0 },
    { id: 'zone-3', name: 'Loading Dock', cameraIds: ['cam-3'], riskLevel: 'high', maxOccupancy: 4, currentOccupancy: 0 },
    { id: 'zone-4', name: 'Chemical Storage', cameraIds: ['cam-4'], riskLevel: 'critical', maxOccupancy: 2, currentOccupancy: 0 }
  ],

  detections: [],

  alerts: [],

  workers: [
    { id: 'worker-1', name: 'John Doe', badgeId: 'EMP-001', zone: 'zone-1', role: 'operator', status: 'active', lastSeen: new Date().toISOString(), createdAt: new Date().toISOString() },
    { id: 'worker-2', name: 'Jane Smith', badgeId: 'EMP-002', zone: 'zone-2', role: 'supervisor', status: 'active', lastSeen: new Date().toISOString(), createdAt: new Date().toISOString() },
    { id: 'worker-3', name: 'Mike Johnson', badgeId: 'EMP-003', zone: 'zone-3', role: 'forklift_driver', status: 'off_duty', lastSeen: new Date(Date.now() - 3600000).toISOString(), createdAt: new Date().toISOString() }
  ],

  stats: {
    totalDetections: 0,
    totalAlerts: 0,
    activeAlerts: 0,
    detectionsPerZone: { 'zone-1': 0, 'zone-2': 0, 'zone-3': 0, 'zone-4': 0 },
    detectionsPerHour: {}
  }
};

module.exports = store;
