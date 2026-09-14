const { v4: uuidv4 } = require('uuid');
const store = require('../models/store');
const config = require('../../config');
const websocketService = require('./websocketService');
const alertService = require('./alertService');

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomIntInRange(min, max) {
  return Math.floor(randomInRange(min, max));
}

function randomBoundingBox() {
  const x = randomIntInRange(50, 1500);
  const y = randomIntInRange(50, 700);
  const width = randomIntInRange(120, 280);
  const height = randomIntInRange(250, 400);
  return { x, y, width, height };
}

function fallSeverityFromConfidence(confidence) {
  if (confidence > 0.95) return 'critical';
  if (confidence > 0.88) return 'high';
  if (confidence > 0.80) return 'medium';
  return 'low';
}

function matchWorker(zoneId) {
  const zoneWorkers = store.workers.filter(w => w.zone === zoneId && w.status === 'active');
  if (zoneWorkers.length === 0) return null;
  return zoneWorkers[randomIntInRange(0, zoneWorkers.length)];
}

function generateDetection() {
  const onlineCameras = store.cameras.filter(c => c.status === 'online' && c.enabled);
  if (onlineCameras.length === 0) return null;

  const camera = onlineCameras[randomIntInRange(0, onlineCameras.length)];
  const isFall = Math.random() < config.FALL_DETECTION_CHANCE;
  const type = isFall ? 'fall' : 'person';
  const confidence = randomInRange(
    isFall ? 0.80 : config.DEFAULT_CONFIDENCE_MIN,
    config.DEFAULT_CONFIDENCE_MAX
  );

  const worker = matchWorker(camera.zone);
  const detection = {
    id: uuidv4(),
    cameraId: camera.id,
    type,
    timestamp: new Date().toISOString(),
    confidence: parseFloat(confidence.toFixed(3)),
    boundingBox: randomBoundingBox(),
    metadata: {
      severity: isFall ? fallSeverityFromConfidence(confidence) : null,
      personId: worker ? worker.id : null,
      zoneId: camera.zone
    }
  };

  store.detections.unshift(detection);
  store.stats.totalDetections++;
  store.stats.detectionsPerZone[camera.zone] = (store.stats.detectionsPerZone[camera.zone] || 0) + 1;

  const hourKey = detection.timestamp.slice(0, 13);
  store.stats.detectionsPerHour[hourKey] = (store.stats.detectionsPerHour[hourKey] || 0) + 1;

  websocketService.emitDetection(camera.id, detection);
  websocketService.emitStatsUpdate(store.stats);

  if (isFall) {
    const zone = store.zones.find(z => z.id === camera.zone);
    alertService.createAlert({
      type: 'fall_detected',
      severity: detection.metadata.severity,
      cameraId: camera.id,
      zoneId: camera.zone,
      detectionId: detection.id,
      message: `Fall detected at ${camera.name} — ${zone ? zone.name : camera.zone}`
    });
  }

  return detection;
}

let detectionInterval = null;

function startSimulation() {
  console.log('Detection simulation started');

  function scheduleNext() {
    const delay = randomInRange(config.DETECTION_INTERVAL_MIN, config.DETECTION_INTERVAL_MAX);
    detectionInterval = setTimeout(() => {
      generateDetection();
      scheduleNext();
    }, delay);
  }

  scheduleNext();
}

function stopSimulation() {
  if (detectionInterval) {
    clearTimeout(detectionInterval);
    detectionInterval = null;
    console.log('Detection simulation stopped');
  }
}

module.exports = {
  generateDetection,
  startSimulation,
  stopSimulation
};
