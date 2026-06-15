// ============================================
// app.js - Express Application Setup
// ============================================
// This file configures the Express app with:
//   - CORS (so React frontend can talk to us)
//   - Body parsing (JSON + large payloads)
//   - API routes
//   - Error handling
// ============================================

import express from 'express';
import cors from 'cors';

// Import all routes (bundled in one index file)
import routes from './routes/index.js';

// Import the global error handler
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

// ---- Create the Express App ----
const app = express();

// ============================================
// MIDDLEWARE (runs on every request, in order)
// ============================================

// 1. CORS: Allow our frontend (React) to talk to this backend
//    Without this, browsers will block requests from localhost:5173/5174 → localhost:5000
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = [
  clientUrl,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:5179',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176',
  'http://127.0.0.1:5177',
  'http://127.0.0.1:5178',
  'http://127.0.0.1:5179',
  'http://[::1]:5173',
  'http://[::1]:5174',
  'http://[::1]:5175',
  'http://[::1]:5176',
  'http://[::1]:5177',
  'http://[::1]:5178',
  'http://[::1]:5179'
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      // Allow requests from file:// and some local tooling that send null origin.
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// During local development allow any origin to simplify frontend/backend integration.
// In production keep the stricter whitelist above.
if (process.env.NODE_ENV !== 'production' || process.env.ALLOW_ALL_CORS === 'true') {
  app.use(cors({ origin: true, credentials: true }));
} else {
  app.use(cors(corsOptions));
}

// 2. Body Parser: Convert incoming JSON requests to JavaScript objects
//    10mb limit to handle large resume text and interview data
app.use(express.json({ limit: '10mb' }));

// ============================================
// ROUTES
// ============================================

// Simple root endpoint so GET / returns a friendly message
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API running. Use /api routes for endpoints.' });
});

// Mount all API routes under /api
// /api/auth      → authentication routes
// /api/interview → interview routes (start, answer, feedback)
// /api/resume    → resume upload and parsing routes
// /api/history   → interview history routes
app.get('/api', (req, res) => {
  res.json({ success: true, message: 'API root is available. Use /auth, /interview, /resume, or /history.' });
});
app.use('/api', routes);

// ============================================
// ERROR HANDLING (must be AFTER routes)
// ============================================

// Handle 404 - Route not found
app.use(notFoundHandler);

// Handle all other errors (500, validation errors, etc.)
app.use(errorHandler);

// Export the app (used in server.js)
export default app;
