const { Server } = require('socket.io');
const store = require('../models/store');

let io;

function init(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.emit('init:state', {
      cameras: store.cameras,
      activeAlerts: store.alerts.filter(a => !a.acknowledged && !a.resolved),
      stats: store.stats
    });

    socket.on('subscribe:camera', (cameraId) => {
      socket.join(`camera:${cameraId}`);
    });

    socket.on('subscribe:zone', (zoneId) => {
      socket.join(`zone:${zoneId}`);
    });

    socket.on('unsubscribe', (room) => {
      socket.leave(room);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  return io;
}

function emitDetection(cameraId, detection) {
  if (io) {
    io.emit('detection', { cameraId, detection });
  }
}

function emitAlert(alert) {
  if (io) {
    io.emit('alert', { alert });
  }
}

function emitAlertUpdated(alert) {
  if (io) {
    io.emit('alert:updated', { alert });
  }
}

function emitCameraStatus(camera) {
  if (io) {
    io.emit('camera:status', { camera });
  }
}

function emitZoneOccupancy(zone) {
  if (io) {
    io.emit('zone:occupancy', { zone });
  }
}

function emitStatsUpdate(stats) {
  if (io) {
    io.emit('stats:update', { stats });
  }
}

module.exports = {
  init,
  getIO,
  emitDetection,
  emitAlert,
  emitAlertUpdated,
  emitCameraStatus,
  emitZoneOccupancy,
  emitStatsUpdate
};
