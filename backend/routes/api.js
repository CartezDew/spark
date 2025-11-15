/**
 * API Routes
 * YouTube and Twitch endpoints
 */

import express from 'express';
import { fetchTopVideos } from '../services/youtubeService.js';
import { fetchTopStreams } from '../services/twitchService.js';

const router = express.Router();

/**
 * GET /api/youtube/top
 * Fetch top YouTube videos
 * 
 * Query params:
 * - q: Search query (optional, if not provided uses mostPopular)
 * - category: Category name (Business & Management, Animation & Visual Effects, etc.)
 * - regionCode: Region code (default: 'US')
 * - maxResults: Maximum results (default: 20, max: 50)
 * - pageToken: Next page token for pagination
 */
router.get('/youtube/top', async (req, res) => {
  try {
    const { q: query, category, regionCode = 'US', maxResults = 20, pageToken } = req.query;
    
    console.log(`[API] GET /api/youtube/top - query: ${query || 'mostPopular'}, category: ${category || 'none'}, region: ${regionCode}, max: ${maxResults}`);
    
    const videos = await fetchTopVideos({
      query: query || null,
      category: category || null,
      regionCode,
      maxResults: Math.min(parseInt(maxResults) || 20, 50),
      pageToken: pageToken || null
    });

    res.json({
      success: true,
      count: videos.data.length,
      data: videos.data,
      nextPageToken: videos.nextPageToken || null
    });
  } catch (error) {
    console.error('[API] YouTube error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch YouTube videos'
    });
  }
});

/**
 * GET /api/twitch/top
 * Fetch top Twitch streams
 * 
 * Query params:
 * - game: Game name to filter by (optional, if not provided gets top globally)
 * - maxResults: Maximum results (default: 20, max: 100)
 */
router.get('/twitch/top', async (req, res) => {
  try {
    const { game, maxResults = 20 } = req.query;
    
    console.log(`[API] GET /api/twitch/top - game: ${game || 'all'}, max: ${maxResults}`);
    
    const streams = await fetchTopStreams({
      game: game || null,
      maxResults: Math.min(parseInt(maxResults) || 20, 100)
    });

    res.json({
      success: true,
      count: streams.length,
      data: streams
    });
  } catch (error) {
    console.error('[API] Twitch error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch Twitch streams'
    });
  }
});

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;

