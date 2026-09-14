const express = require('express');
const router = express.Router();
const store = require('../models/store');

router.get('/', (req, res) => {
  const { cameraId, type, from, to, limit = 50, offset = 0 } = req.query;
  let filtered = [...store.detections];

  if (cameraId) {
    filtered = filtered.filter(d => d.cameraId === cameraId);
  }
  if (type) {
    filtered = filtered.filter(d => d.type === type);
  }
  if (from) {
    filtered = filtered.filter(d => new Date(d.timestamp) >= new Date(from));
  }
  if (to) {
    filtered = filtered.filter(d => new Date(d.timestamp) <= new Date(to));
  }

  const total = filtered.length;
  const detections = filtered.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({ total, detections });
});

router.get('/:id', (req, res) => {
  const detection = store.detections.find(d => d.id === req.params.id);
  if (!detection) {
    return res.status(404).json({ error: 'Detection not found' });
  }
  res.json({ detection });
});

module.exports = router;
