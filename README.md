# Real-Time Edge AI Safety System

A real-time industrial safety monitoring web application using Edge AI for person detection and fall detection in factory/industrial environments.

## Features

- **Live Dashboard** — Multi-camera grid with real-time detection overlays
- **Person Detection** — AI-powered person detection with confidence scores
- **Fall Detection** — Automatic fall detection with severity-based alerts (critical/high/medium/low)
- **Alert Management** — Acknowledge and resolve alerts workflow
- **Analytics** — Detection charts, zone activity heatmaps, KPI statistics
- **Worker Management** — Register workers, assign zones, track status
- **Real-Time Updates** — WebSocket-powered live detection and alert streaming

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Socket.IO Client |
| Backend | Node.js, Express, Socket.IO |
| Data | In-memory store (swap to database for production) |

## Project Structure

```
├── backend/
│   ├── server.js                 # Entry point
│   ├── config/index.js           # Environment config
│   └── src/
│       ├── routes/               # REST API routes
│       ├── services/             # Detection, alert, WebSocket services
│       ├── models/store.js       # In-memory data store
│       └── middleware/            # Error handler, logger
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── pages/                # Dashboard, Detections, Alerts, Analytics, Workers, Settings
│       ├── components/           # Layout, Camera, Alert, Chart, Common components
│       ├── context/              # Socket.IO and Alert providers
│       └── api/                  # API client
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

The Vite dev server proxies API and WebSocket requests to the backend automatically.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cameras` | List all cameras |
| PUT | `/api/cameras/:id` | Update camera config |
| GET | `/api/detections` | Get detection history |
| GET | `/api/alerts` | Get alerts |
| POST | `/api/alerts/:id/acknowledge` | Acknowledge alert |
| POST | `/api/alerts/:id/resolve` | Resolve alert |
| GET | `/api/alerts/stats` | Alert statistics |
| GET/POST | `/api/workers` | Manage workers |
| GET | `/api/zones` | List zones |
| PUT | `/api/zones/:id` | Update zone config |
| GET | `/api/stats/dashboard` | Dashboard stats |

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `init:state` | Server → Client | Initial state on connect |
| `detection` | Server → Client | New detection event |
| `alert` | Server → Client | New alert created |
| `alert:updated` | Server → Client | Alert acknowledged/resolved |
| `camera:status` | Server → Client | Camera status change |
| `zone:occupancy` | Server → Client | Zone occupancy update |
| `stats:update` | Server → Client | Dashboard stats refresh |

## Simulated AI Detection

The system runs a mock detection engine that generates:

- **Person detections** (95% chance) with confidence 0.75-0.99
- **Fall detections** (5% chance) with confidence 0.80-0.99
- Detections every 2-5 seconds across online cameras
- Automatic severity assignment for falls based on confidence

## Environment Variables

```env
# backend/.env
PORT=5000
CORS_ORIGIN=http://localhost:5173
DETECTION_INTERVAL_MIN=2000
DETECTION_INTERVAL_MAX=5000
FALL_DETECTION_CHANCE=0.05
```

## License

MIT
