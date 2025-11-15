/**
 * Twitch Service
 * Fetches live streams from Twitch Helix API
 */

import axios from 'axios';

const TWITCH_API_BASE = 'https://api.twitch.tv/helix';
const TWITCH_OAUTH_URL = 'https://id.twitch.tv/oauth2/token';
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

let accessToken = null;
let tokenExpiry = null;

/**
 * Get OAuth access token using client_credentials flow
 * @returns {Promise<string>} Access token
 */
export const getAccessToken = async () => {
  try {
    // Check if token is still valid (refresh 5 minutes before expiry)
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry - 300000) {
      console.log('[Twitch] Using cached access token');
      return accessToken;
    }

    console.log('[Twitch] Requesting new access token...');
    
    const response = await axios.post(TWITCH_OAUTH_URL, null, {
      params: {
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    });

    accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in * 1000; // Convert to milliseconds
    tokenExpiry = Date.now() + expiresIn;

    console.log(`[Twitch] Access token obtained, expires in ${expiresIn / 1000}s`);
    
    return accessToken;
  } catch (error) {
    console.error('[Twitch] OAuth error:', error.response?.data || error.message);
    throw new Error(`Twitch OAuth failed: ${error.message}`);
  }
};

/**
 * Get streams by game name
 * @param {string} gameName - Game name to filter by
 * @param {number} maxResults - Maximum results (default: 20)
 * @returns {Promise<Array>} Array of stream objects
 */
export const getStreamsByGame = async (gameName, maxResults = 20) => {
  try {
    const token = await getAccessToken();
    
    console.log(`[Twitch] Fetching streams for game: "${gameName}"`);
    
    // First, get game ID from game name
    const gameResponse = await axios.get(`${TWITCH_API_BASE}/games`, {
      params: {
        name: gameName
      },
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`
      }
    });

    if (!gameResponse.data.data || gameResponse.data.data.length === 0) {
      console.log(`[Twitch] Game "${gameName}" not found`);
      return [];
    }

    const gameId = gameResponse.data.data[0].id;
    console.log(`[Twitch] Found game ID: ${gameId}`);

    // Get streams for this game
    const streamsResponse = await axios.get(`${TWITCH_API_BASE}/streams`, {
      params: {
        game_id: gameId,
        first: Math.min(maxResults, 100) // API limit is 100
      },
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`
      }
    });

    const streams = streamsResponse.data.data;
    console.log(`[Twitch] Found ${streams.length} streams for game "${gameName}"`);
    
    return streams;
  } catch (error) {
    console.error('[Twitch] getStreamsByGame error:', error.response?.data || error.message);
    throw new Error(`Twitch getStreamsByGame failed: ${error.message}`);
  }
};

/**
 * Get top streams globally
 * @param {number} maxResults - Maximum results (default: 20)
 * @returns {Promise<Array>} Array of stream objects
 */
export const getTopStreams = async (maxResults = 20) => {
  try {
    const token = await getAccessToken();
    
    console.log('[Twitch] Fetching top streams globally');
    
    const response = await axios.get(`${TWITCH_API_BASE}/streams`, {
      params: {
        first: Math.min(maxResults, 100) // API limit is 100
      },
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`
      }
    });

    const streams = response.data.data;
    console.log(`[Twitch] Found ${streams.length} top streams`);
    
    return streams;
  } catch (error) {
    console.error('[Twitch] getTopStreams error:', error.response?.data || error.message);
    throw new Error(`Twitch getTopStreams failed: ${error.message}`);
  }
};

/**
 * Format thumbnail URL
 * @param {string} thumbnailUrl - Original thumbnail URL with placeholders
 * @returns {string} Formatted thumbnail URL
 */
const formatThumbnail = (thumbnailUrl) => {
  if (!thumbnailUrl) return null;
  return thumbnailUrl.replace('{width}', '320').replace('{height}', '180');
};

/**
 * Fetch top streams - either by game or globally
 * @param {Object} options - Options object
 * @param {string} options.game - Optional game name to filter by
 * @param {number} options.maxResults - Maximum results (default: 20)
 * @returns {Promise<Array>} Array of formatted stream objects
 */
export const fetchTopStreams = async ({ game = null, maxResults = 20 } = {}) => {
  try {
    let streams;

    if (game) {
      // Get streams by game
      streams = await getStreamsByGame(game, maxResults);
    } else {
      // Get top streams globally
      streams = await getTopStreams(maxResults);
    }

    if (streams.length === 0) {
      return [];
    }

    // Format for API response
    return streams.map(stream => ({
      title: stream.title,
      thumbnail: formatThumbnail(stream.thumbnail_url),
      viewerCount: stream.viewer_count,
      channelName: stream.user_name,
      platform: 'twitch',
      streamId: stream.id,
      gameName: stream.game_name,
      startedAt: stream.started_at
    }));
  } catch (error) {
    console.error('[Twitch] fetchTopStreams error:', error.message);
    throw error;
  }
};

export default {
  getAccessToken,
  getStreamsByGame,
  getTopStreams,
  fetchTopStreams
};

