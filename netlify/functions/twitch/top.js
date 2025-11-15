/**
 * Netlify Function: Twitch Top Streams
 * Handles GET /api/twitch/top
 */

import { fetchTopStreams } from '../../../backend/services/twitchService.js';

export const handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed'
      })
    };
  }

  try {
    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    const { game, maxResults = 20 } = queryParams;
    
    console.log(`[Netlify Function] GET /api/twitch/top - game: ${game || 'all'}, max: ${maxResults}`);
    
    const streams = await fetchTopStreams({
      game: game || null,
      maxResults: Math.min(parseInt(maxResults) || 20, 100)
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: streams.length,
        data: streams
      })
    };
  } catch (error) {
    console.error('[Netlify Function] Twitch error:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to fetch Twitch streams'
      })
    };
  }
};

