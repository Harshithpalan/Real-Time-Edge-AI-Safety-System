const express = require('express');
const router = express.Router();
const store = require('../models/store');
const websocketService = require('../services/websocketService');

router.get('/', (req, res) => {
  res.json({ zones: store.zones });
});

router.get('/:id', (req, res) => {
  const zone = store.zones.find(z => z.id === req.params.id);
  if (!zone) {
    return res.status(404).json({ error: 'Zone not found' });
  }
  res.json({ zone });
});

router.put('/:id', (req, res) => {
  const zone = store.zones.find(z => z.id === req.params.id);
  if (!zone) {
    return res.status(404).json({ error: 'Zone not found' });
  }

  const { name, riskLevel, maxOccupancy } = req.body;
  if (name !== undefined) zone.name = name;
  if (riskLevel !== undefined) zone.riskLevel = riskLevel;
  if (maxOccupancy !== undefined) zone.maxOccupancy = maxOccupancy;

  websocketService.emitZoneOccupancy(zone);
  res.json({ zone });
});

module.exports = router;
