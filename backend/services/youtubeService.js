/**
 * YouTube Service
 * Fetches videos from YouTube Data API v3
 */

import axios from 'axios';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Get API key at runtime, not at module load time
const getApiKey = () => {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    console.error('[YouTube] ERROR: YOUTUBE_API_KEY is not set in environment variables!');
  }
  return key;
};

/**
 * Search YouTube videos by query
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum results (default: 20)
 * @param {string} pageToken - Next page token for pagination
 * @returns {Promise<Object>} Object with videoIds array and nextPageToken
 */
export const searchVideos = async (query, maxResults = 20, pageToken = null) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('YOUTUBE_API_KEY is not set in environment variables');
    }
    
    console.log(`[YouTube] Searching for: "${query}"`);
    console.log(`[YouTube] Using API key: ${apiKey.substring(0, 10)}...`);
    
    const params = {
      part: 'id',
      q: query,
      type: 'video',
      maxResults: Math.min(maxResults, 50), // API limit is 50
      order: 'viewCount',
      relevanceLanguage: 'en', // English only
      key: apiKey
    };
    
    if (pageToken) {
      params.pageToken = pageToken;
    }
    
    const response = await axios.get(`${YOUTUBE_API_BASE}/search`, { params });

    const videoIds = response.data.items.map(item => item.id.videoId);
    console.log(`[YouTube] Found ${videoIds.length} videos`);
    
    return {
      videoIds,
      nextPageToken: response.data.nextPageToken || null
    };
  } catch (error) {
    console.error('[YouTube] Search error:', error.response?.data || error.message);
    throw new Error(`YouTube search failed: ${error.message}`);
  }
};

/**
 * Get most popular videos
 * @param {string} regionCode - Region code (default: 'US')
 * @param {number} maxResults - Maximum results (default: 20)
 * @returns {Promise<Array>} Array of video IDs
 */
export const getMostPopularVideos = async (regionCode = 'US', maxResults = 20) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('YOUTUBE_API_KEY is not set in environment variables');
    }
    
    console.log(`[YouTube] Fetching most popular videos for region: ${regionCode}`);
    console.log(`[YouTube] Using API key: ${apiKey.substring(0, 10)}...`);
    
    const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        part: 'id',
        chart: 'mostPopular',
        regionCode: regionCode,
        maxResults: Math.min(maxResults, 50), // API limit is 50
        key: apiKey
      }
    });

    const videoIds = response.data.items.map(item => item.id);
    console.log(`[YouTube] Found ${videoIds.length} popular videos`);
    
    return videoIds;
  } catch (error) {
    console.error('[YouTube] Most popular error:', error.response?.data || error.message);
    throw new Error(`YouTube most popular failed: ${error.message}`);
  }
};

/**
 * Get full video details by IDs
 * @param {Array<string>} videoIds - Array of video IDs
 * @returns {Promise<Array>} Array of video objects with full details
 */
export const getVideoDetails = async (videoIds) => {
  try {
    if (!videoIds || videoIds.length === 0) {
      return [];
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('YOUTUBE_API_KEY is not set in environment variables');
    }

    console.log(`[YouTube] Fetching details for ${videoIds.length} videos`);
    
    const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        part: 'snippet,statistics',
        id: videoIds.join(','),
        key: apiKey
      }
    });

    const videos = response.data.items.map(item => ({
      videoId: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      viewCount: parseInt(item.statistics.viewCount) || 0,
      channelName: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      description: item.snippet.description
    }));

    console.log(`[YouTube] Retrieved details for ${videos.length} videos`);
    
    return videos;
  } catch (error) {
    console.error('[YouTube] Video details error:', error.response?.data || error.message);
    throw new Error(`YouTube video details failed: ${error.message}`);
  }
};

// Career paths within each category (from Usher's New Look)
const CATEGORY_CAREERS = {
  'Business & Management': [
    'Talent Management',
    'Talent Agency',
    'Production Management',
    'Event Management',
    'Marketing & PR',
    'Business Development',
    'Legal',
    'Accounting Finance',
    'Casting',
    'Administrative Support'
  ],
  'Animation & Visual Effects': [
    'Animator',
    'Graphic Design Artist',
    'Visual Effects Artist',
    '3D Animator',
    'Motion Graphics Designer'
  ],
  'Writing & Journalism': [
    'Entertainment Journalist',
    'Publicist',
    'Content Creator',
    'Entertainment Writer',
    'Script Writer'
  ],
  'Music': [
    'Musician Singer',
    'Music Producer',
    'Songwriter',
    'Audio Engineer',
    'Music Producer Career'
  ],
  'Sports': [
    'Sports Broadcasting',
    'Game Day Operations',
    'Events Coordinator',
    'Sound Engineer',
    'Sports Advertising',
    'Sports Marketing',
    'Digital Design',
    'Merchandising',
    'Content Production',
    'Sports Talent'
  ],
  'Film & Television': [
    'Acting',
    'Directing',
    'Film Writing',
    'Casting',
    'Cinematography',
    'Video Editing',
    'Sound Design',
    'Sound Engineer',
    'Costume Design',
    'Set Design Engineer',
    'Equipment Operations',
    'Makeup Artists'
  ]
};

// Category mappings for YouTube searches (using specific careers)
const CATEGORY_QUERIES = {
  'Business & Management': CATEGORY_CAREERS['Business & Management'],
  'Animation & Visual Effects': CATEGORY_CAREERS['Animation & Visual Effects'],
  'Writing & Journalism': CATEGORY_CAREERS['Writing & Journalism'],
  'Music': CATEGORY_CAREERS['Music'],
  'Sports': CATEGORY_CAREERS['Sports'],
  'Film & Television': CATEGORY_CAREERS['Film & Television']
};

/**
 * Search videos by category - randomly selects a career from the category
 */
const searchVideosByCategory = async (category, maxResults = 20, pageToken = null) => {
  const careers = CATEGORY_CAREERS[category] || CATEGORY_QUERIES[category] || [category.toLowerCase()];
  
  // Randomly select a career from this category
  const randomCareer = careers[Math.floor(Math.random() * careers.length)];
  const searchQuery = `how to become ${randomCareer} OR ${randomCareer} career OR ${randomCareer} day in the life`;
  
  console.log(`[YouTube] Selected career from ${category}: ${randomCareer}`);
  
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY is not set');
  }
  
  const params = {
    part: 'id,snippet',
    q: searchQuery,
    type: 'video',
    maxResults: Math.min(maxResults, 50),
    order: 'viewCount',
    relevanceLanguage: 'en', // English only
    key: apiKey
  };
  
  if (pageToken) {
    params.pageToken = pageToken;
  }
  
  const response = await axios.get(`${YOUTUBE_API_BASE}/search`, { params });
  
  return {
    videoIds: response.data.items.map(item => item.id.videoId),
    nextPageToken: response.data.nextPageToken || null
  };
};

/**
 * Fetch top videos - either by search query, category, or most popular
 * @param {Object} options - Options object
 * @param {string} options.query - Optional search query
 * @param {string} options.category - Optional category name
 * @param {string} options.regionCode - Region code (default: 'US')
 * @param {number} options.maxResults - Maximum results (default: 20)
 * @param {string} options.pageToken - Next page token for pagination
 * @returns {Promise<Object>} Object with data array and nextPageToken
 */
export const fetchTopVideos = async ({ query = null, category = null, regionCode = 'US', maxResults = 20, pageToken = null } = {}) => {
  try {
    let videoIds;
    let nextPageToken = null;

    if (category && CATEGORY_QUERIES[category]) {
      // Search by category
      const result = await searchVideosByCategory(category, maxResults, pageToken);
      videoIds = result.videoIds;
      nextPageToken = result.nextPageToken;
    } else if (query) {
      // Use search endpoint when query is provided
      const searchResult = await searchVideos(query, maxResults, pageToken);
      videoIds = searchResult.videoIds;
      nextPageToken = searchResult.nextPageToken;
    } else {
      // Use mostPopular when no query
      videoIds = await getMostPopularVideos(regionCode, maxResults);
      nextPageToken = null; // mostPopular doesn't support pagination
    }

    if (videoIds.length === 0) {
      return { data: [], nextPageToken: null };
    }

    // Two-step: Get full video details
    const videos = await getVideoDetails(videoIds);

    // Format for API response
    return {
      data: videos.map(video => ({
        title: video.title,
        thumbnail: video.thumbnail,
        viewCount: video.viewCount,
        channelName: video.channelName,
        platform: 'youtube',
        videoId: video.videoId
      })),
      nextPageToken
    };
  } catch (error) {
    console.error('[YouTube] fetchTopVideos error:', error.message);
    throw error;
  }
};

export default {
  searchVideos,
  getMostPopularVideos,
  getVideoDetails,
  fetchTopVideos
};

