const { v4: uuidv4 } = require('uuid');
const store = require('../models/store');
const websocketService = require('./websocketService');

function createAlert({ type, severity, cameraId, zoneId, detectionId, message }) {
  const alert = {
    id: uuidv4(),
    type,
    severity,
    cameraId,
    zoneId,
    message,
    timestamp: new Date().toISOString(),
    acknowledged: false,
    acknowledgedBy: null,
    acknowledgedAt: null,
    detectionId,
    resolved: false
  };

  store.alerts.unshift(alert);
  store.stats.totalAlerts++;
  store.stats.activeAlerts++;

  websocketService.emitAlert(alert);
  websocketService.emitStatsUpdate(store.stats);

  return alert;
}

function acknowledgeAlert(alertId, acknowledgedBy) {
  const alert = store.alerts.find(a => a.id === alertId);
  if (!alert) return null;

  alert.acknowledged = true;
  alert.acknowledgedBy = acknowledgedBy;
  alert.acknowledgedAt = new Date().toISOString();
  store.stats.activeAlerts = Math.max(0, store.stats.activeAlerts - 1);

  websocketService.emitAlertUpdated(alert);
  websocketService.emitStatsUpdate(store.stats);

  return alert;
}

function resolveAlert(alertId) {
  const alert = store.alerts.find(a => a.id === alertId);
  if (!alert) return null;

  alert.resolved = true;
  alert.acknowledged = true;
  if (!alert.acknowledgedAt) {
    alert.acknowledgedAt = new Date().toISOString();
  }
  store.stats.activeAlerts = Math.max(0, store.stats.activeAlerts - 1);

  websocketService.emitAlertUpdated(alert);
  websocketService.emitStatsUpdate(store.stats);

  return alert;
}

function getAlerts({ status, severity, limit = 50, offset = 0 } = {}) {
  let filtered = [...store.alerts];

  if (status === 'active') {
    filtered = filtered.filter(a => !a.acknowledged && !a.resolved);
  } else if (status === 'acknowledged') {
    filtered = filtered.filter(a => a.acknowledged && !a.resolved);
  } else if (status === 'resolved') {
    filtered = filtered.filter(a => a.resolved);
  }

  if (severity) {
    filtered = filtered.filter(a => a.severity === severity);
  }

  return {
    total: filtered.length,
    alerts: filtered.slice(offset, offset + limit)
  };
}

function getAlertStats() {
  const now = new Date();
  const last24h = new Date(now - 24 * 60 * 60 * 1000);
  const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const byType = {};
  const bySeverity = {};
  let last24hCount = 0;
  let last7dCount = 0;

  store.alerts.forEach(alert => {
    byType[alert.type] = (byType[alert.type] || 0) + 1;
    bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;

    const alertTime = new Date(alert.timestamp);
    if (alertTime >= last24h) last24hCount++;
    if (alertTime >= last7d) last7dCount++;
  });

  return {
    total: store.alerts.length,
    active: store.stats.activeAlerts,
    byType,
    bySeverity,
    last24h: last24hCount,
    last7d: last7dCount
  };
}

module.exports = {
  createAlert,
  acknowledgeAlert,
  resolveAlert,
  getAlerts,
  getAlertStats
};
