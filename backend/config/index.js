require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  DETECTION_INTERVAL_MIN: parseInt(process.env.DETECTION_INTERVAL_MIN) || 2000,
  DETECTION_INTERVAL_MAX: parseInt(process.env.DETECTION_INTERVAL_MAX) || 5000,
  FALL_DETECTION_CHANCE: parseFloat(process.env.FALL_DETECTION_CHANCE) || 0.05,
  DEFAULT_CONFIDENCE_MIN: 0.75,
  DEFAULT_CONFIDENCE_MAX: 0.99
};
