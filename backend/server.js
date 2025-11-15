/**
 * Express Server
 * Backend API for Spark career discovery app
 */

// Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// CORS - allow all origins in production, localhost in development
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? true // Allow all origins in production
    : ['http://localhost:5173', 'http://localhost:3000'], // Local dev
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Spark Backend API',
    version: '1.0.0',
    endpoints: {
      youtube: '/api/youtube/top',
      twitch: '/api/twitch/top',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server] Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Spark Backend Server running on http://localhost:${PORT}`);
  console.log(`📺 YouTube API: http://localhost:${PORT}/api/youtube/top`);
  console.log(`🎮 Twitch API: http://localhost:${PORT}/api/twitch/top`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health\n`);
  
  // Validate environment variables
  if (!process.env.YOUTUBE_API_KEY) {
    console.warn('⚠️  WARNING: YOUTUBE_API_KEY not set in .env file');
  }
  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    console.warn('⚠️  WARNING: Twitch credentials not set in .env file');
  }
});

export default app;

