const express = require('express');
const router = express.Router();
const store = require('../models/store');
const websocketService = require('../services/websocketService');

router.get('/', (req, res) => {
  res.json({ cameras: store.cameras });
});

router.get('/:id', (req, res) => {
  const camera = store.cameras.find(c => c.id === req.params.id);
  if (!camera) {
    return res.status(404).json({ error: 'Camera not found' });
  }
  res.json({ camera });
});

router.put('/:id', (req, res) => {
  const camera = store.cameras.find(c => c.id === req.params.id);
  if (!camera) {
    return res.status(404).json({ error: 'Camera not found' });
  }

  const { name, zone, status, enabled, location } = req.body;
  if (name !== undefined) camera.name = name;
  if (zone !== undefined) camera.zone = zone;
  if (status !== undefined) camera.status = status;
  if (enabled !== undefined) camera.enabled = enabled;
  if (location !== undefined) camera.location = location;

  websocketService.emitCameraStatus(camera);
  res.json({ camera });
});

module.exports = router;
