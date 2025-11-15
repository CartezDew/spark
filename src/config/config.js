/**
 * App Configuration
 * 
 * Set your preferences here for video fetching
 */

export const config = {
  // Backend API Configuration
  // Set to 'backend' to use your Node.js/Express backend
  // Other options: 'youtube', 'invidious', or 'mock'
  apiMode: 'backend', // Use backend API (recommended)
  
  // Backend API URL
  backendApiUrl: 'http://localhost:3001/api',
  
  // YouTube API Configuration (only needed if not using backend)
  // Get your API key from: https://console.cloud.google.com/
  youtubeApiKey: 'YOUR_YOUTUBE_API_KEY_HERE',
  
  // Video fetching settings
  maxVideosPerLoad: 20,
  autoRefreshInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  
  // Region settings for content
  defaultRegion: 'US',
  
  // Invidious instance (if using invidious mode)
  invidiousInstance: 'https://invidious.io.lol',
  
  // Video category preferences
  // Options: 'trending', 'music', 'gaming', 'news', 'movies', 'sports'
  defaultCategory: 'trending',
  
  // Enable auto-play videos when in view
  autoPlayVideos: true,
  
  // Cache duration in milliseconds
  cacheDuration: 10 * 60 * 1000 // 10 minutes
};

export default config;

