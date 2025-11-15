/**
 * App Configuration
 * 
 * Set your preferences here for video fetching
 */

export const config = {
  // Backend API Configuration
  // Set to 'backend' to use your Node.js/Express backend
  // Other options: 'youtube', 'invidious', or 'mock'
  // In production, will auto-detect based on VITE_BACKEND_API_URL
  apiMode: import.meta.env.VITE_API_MODE || 'backend',
  
  // Backend API URL - uses environment variable in production
  // On Netlify, functions are available at /api/* automatically
  // For local dev, use localhost:3001
  backendApiUrl: import.meta.env.VITE_BACKEND_API_URL || 
    (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api'),
  
  // YouTube API Configuration (only needed if not using backend)
  // Get your API key from: https://console.cloud.google.com/
  youtubeApiKey: 'YOUR_YOUTUBE_API_KEY_HERE',
  
  // Video fetching settings
  maxVideosPerLoad: 20,
  autoRefreshInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  
  // Region settings for content
  defaultRegion: 'US',
  
  // Invidious instance (if using invidious mode)
  // Will try multiple instances automatically if one fails
  invidiousInstance: 'https://yewtu.be',
  
  // Video category preferences
  // Options: 'trending', 'music', 'gaming', 'news', 'movies', 'sports'
  defaultCategory: 'trending',
  
  // Enable auto-play videos when in view
  autoPlayVideos: true,
  
  // Cache duration in milliseconds
  cacheDuration: 10 * 60 * 1000 // 10 minutes
};

export default config;

