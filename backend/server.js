require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const config = require('./config');
const logger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');
const websocketService = require('./src/services/websocketService');
const detectionService = require('./src/services/detectionService');

const camerasRouter = require('./src/routes/cameras');
const alertsRouter = require('./src/routes/alerts');
const detectionsRouter = require('./src/routes/detections');
const workersRouter = require('./src/routes/workers');
const zonesRouter = require('./src/routes/zones');
const statsRouter = require('./src/routes/stats');

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(logger);

app.use('/api/cameras', camerasRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/detections', detectionsRouter);
app.use('/api/workers', workersRouter);
app.use('/api/zones', zonesRouter);
app.use('/api/stats', statsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

websocketService.init(server);
detectionService.startSimulation();

server.listen(config.PORT, () => {
  console.log(`\n🛡️  Edge AI Safety System Backend`);
  console.log(`   Server running on port ${config.PORT}`);
  console.log(`   WebSocket ready for connections`);
  console.log(`   Detection simulation active\n`);
});
