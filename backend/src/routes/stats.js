const express = require('express');
const router = express.Router();
const store = require('../models/store');

router.get('/dashboard', (req, res) => {
  const now = new Date();
  const last24h = new Date(now - 24 * 60 * 60 * 1000);

  const detections24h = store.detections.filter(d => new Date(d.timestamp) >= last24h);
  const personDetections = detections24h.filter(d => d.type === 'person').length;
  const fallDetections = detections24h.filter(d => d.type === 'fall').length;

  const onlineZones = store.zones.filter(z => {
    const cameras = store.cameras.filter(c => c.zone === z.id && c.status === 'online');
    return cameras.length > 0;
  }).length;

  const workersOnSite = store.workers.filter(w => w.status === 'active' || w.status === 'in_zone').length;

  res.json({
    stats: {
      totalDetections: store.stats.totalDetections,
      totalAlerts: store.stats.totalAlerts,
      activeAlerts: store.stats.activeAlerts,
      detections24h: detections24h.length,
      personDetections24h: personDetections,
      fallDetections24h: fallDetections,
      onlineZones,
      totalZones: store.zones.length,
      workersOnSite,
      totalWorkers: store.workers.length,
      detectionsPerZone: store.stats.detectionsPerZone,
      detectionsPerHour: store.stats.detectionsPerHour,
      cameras: store.cameras.map(c => ({ id: c.id, name: c.name, status: c.status }))
    }
  });
});

module.exports = router;
