/**
 * YouTube Video Scraper Service
 * 
 * This service provides functionality to fetch and scrape YouTube videos.
 * 
 * IMPORTANT NOTES:
 * 1. Direct web scraping of YouTube violates their Terms of Service
 * 2. For production use, you should:
 *    - Use the official YouTube Data API v3 (requires API key)
 *    - Set up a backend server to handle API requests securely
 *    - Implement proper rate limiting and caching
 * 
 * Current implementation uses mock data for demonstration.
 * Replace with actual API calls when ready for production.
 */

const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY_HERE'; // Replace with your actual API key
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Fetches popular videos from YouTube
 * @param {string} category - Video category (e.g., 'trending', 'music', 'gaming')
 * @param {number} maxResults - Maximum number of videos to fetch
 * @returns {Promise<Array>} Array of video objects
 */
export const fetchYouTubeVideos = async (category = 'trending', maxResults = 20) => {
  try {
    // PRODUCTION IMPLEMENTATION:
    // Uncomment below to use real YouTube API
    /*
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch videos from YouTube API');
    }
    
    const data = await response.json();
    
    return data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      likes: formatNumber(item.statistics.likeCount),
      views: formatNumber(item.statistics.viewCount),
      comments: formatNumber(item.statistics.commentCount)
    }));
    */

    // MOCK DATA FOR DEMONSTRATION
    return generateMockVideos(maxResults);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    // Fallback to mock data
    return generateMockVideos(maxResults);
  }
};

/**
 * Searches YouTube for videos matching a query
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results
 * @returns {Promise<Array>} Array of video objects
 */
export const searchYouTubeVideos = async (query, maxResults = 10) => {
  try {
    // PRODUCTION IMPLEMENTATION:
    /*
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search YouTube videos');
    }
    
    const data = await response.json();
    
    return data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url
    }));
    */

    // Mock search results
    return generateMockVideos(maxResults, query);
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    return generateMockVideos(maxResults);
  }
};

/**
 * Fetches videos by region/category
 * @param {string} region - Region code (e.g., 'US', 'GB', 'CA')
 * @param {number} maxResults - Maximum number of videos
 * @returns {Promise<Array>} Array of video objects
 */
export const fetchVideosByRegion = async (region = 'US', maxResults = 20) => {
  try {
    // PRODUCTION IMPLEMENTATION:
    /*
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=${region}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch regional videos');
    }
    
    const data = await response.json();
    
    return data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      likes: formatNumber(item.statistics.likeCount),
      views: formatNumber(item.statistics.viewCount),
      comments: formatNumber(item.statistics.commentCount)
    }));
    */

    return generateMockVideos(maxResults, `${region} content`);
  } catch (error) {
    console.error('Error fetching regional videos:', error);
    return generateMockVideos(maxResults);
  }
};

/**
 * Generates mock YouTube videos for demonstration
 * @param {number} count - Number of videos to generate
 * @param {string} theme - Theme for video titles
 * @returns {Array} Array of mock video objects
 */
const generateMockVideos = (count = 10, theme = '') => {
  const categories = [
    'Technology', 'Travel', 'Cooking', 'Fitness', 'Science',
    'Music', 'Gaming', 'Education', 'DIY', 'Fashion'
  ];

  const videoIdPool = [
    'dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk', '9bZkp7q19f0',
    'L_jWHffIx5E', 'M7lc1UVf-VE', 'ZZ5LpwO-An4', 'hT_nvWreIhg',
    'OPf0YbXqDm0', 'FlsCjmMhFmw', 'KQ6zr6kCPj8', 'YQHsXMglC9A',
    'fJ9rUzIMcZQ', 'pt8VYOfr8To', 'kXYiU_JCYtU', 'nfWlot6h_JM'
  ];

  const mockVideos = [];

  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    const videoId = videoIdPool[i % videoIdPool.length];
    const likes = Math.floor(Math.random() * 500) + 10;
    const comments = Math.floor(Math.random() * 10) + 1;

    mockVideos.push({
      id: videoId,
      title: theme 
        ? `${theme} - ${category} Content ${i + 1}`
        : `Amazing ${category} Video - Must Watch!`,
      channel: `${category} Channel`,
      description: `Discover amazing ${category.toLowerCase()} content that will inspire and entertain you. Don't miss out on this incredible video!`,
      likes: `${likes}K`,
      comments: `${comments}K`
    });
  }

  return mockVideos;
};

/**
 * Formats large numbers into readable format (e.g., 1500 -> 1.5K)
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Setup instructions for production YouTube API:
 * 
 * 1. Get YouTube Data API v3 key:
 *    - Go to https://console.cloud.google.com/
 *    - Create a new project or select existing one
 *    - Enable YouTube Data API v3
 *    - Create credentials (API key)
 *    - Replace YOUTUBE_API_KEY with your key
 * 
 * 2. Set up backend server:
 *    - Create a Node.js/Express backend
 *    - Store API key securely in environment variables
 *    - Implement endpoints to proxy YouTube API requests
 *    - Add rate limiting and caching
 * 
 * 3. Update frontend:
 *    - Replace fetch calls to point to your backend
 *    - Handle errors and loading states
 *    - Implement infinite scroll for more videos
 * 
 * 4. Consider alternatives:
 *    - Invidious API (privacy-focused YouTube frontend)
 *    - YouTube RSS feeds (limited data)
 *    - Third-party YouTube data APIs
 */

export default {
  fetchYouTubeVideos,
  searchYouTubeVideos,
  fetchVideosByRegion
};

