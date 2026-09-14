const express = require('express');
const router = express.Router();
const alertService = require('../services/alertService');

router.get('/', (req, res) => {
  const { status, severity, limit, offset } = req.query;
  const result = alertService.getAlerts({ status, severity, limit: parseInt(limit), offset: parseInt(offset) });
  res.json(result);
});

router.get('/stats', (req, res) => {
  const stats = alertService.getAlertStats();
  res.json(stats);
});

router.get('/:id', (req, res) => {
  const { alerts } = alertService.getAlerts({ limit: 1000 });
  const alert = alerts.find(a => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  res.json({ alert });
});

router.post('/:id/acknowledge', (req, res) => {
  const { acknowledgedBy } = req.body;
  const alert = alertService.acknowledgeAlert(req.params.id, acknowledgedBy || 'system');
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  res.json({ alert });
});

router.post('/:id/resolve', (req, res) => {
  const alert = alertService.resolveAlert(req.params.id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  res.json({ alert });
});

module.exports = router;
