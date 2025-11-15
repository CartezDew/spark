/**
 * Netlify Function: YouTube Top Videos
 * Handles GET /api/youtube/top
 */

import { fetchTopVideos } from '../../backend/services/youtubeService.js';

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
    const { q: query, category, regionCode = 'US', maxResults = 20, pageToken } = queryParams;
    
    console.log(`[Netlify Function] GET /api/youtube/top - query: ${query || 'mostPopular'}, category: ${category || 'none'}, region: ${regionCode}, max: ${maxResults}`);
    
    const videos = await fetchTopVideos({
      query: query || null,
      category: category || null,
      regionCode,
      maxResults: Math.min(parseInt(maxResults) || 20, 50),
      pageToken: pageToken || null
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: videos.data.length,
        data: videos.data,
        nextPageToken: videos.nextPageToken || null
      })
    };
  } catch (error) {
    console.error('[Netlify Function] YouTube error:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to fetch YouTube videos'
      })
    };
  }
};

