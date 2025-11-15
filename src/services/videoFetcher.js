/**
 * Video Fetcher Service
 * Automatically fetches popular videos from various sources
 */

import config from '../config/config';

// Cache management
let videoCache = {
  data: null,
  timestamp: null,
  region: null
};

/**
 * Main function to fetch popular videos based on config
 */
export const fetchPopularVideos = async (region = config.defaultRegion) => {
  // Check cache first
  if (shouldUseCache(region)) {
    console.log('Using cached videos');
    return videoCache.data;
  }

  console.log(`Fetching popular videos using ${config.apiMode} mode...`);

  let videos = [];

  try {
    switch (config.apiMode) {
      case 'youtube':
        videos = await fetchFromYouTubeAPI(region);
        break;
      case 'invidious':
        videos = await fetchFromInvidious(region);
        break;
      case 'mock':
      default:
        videos = await fetchMockVideos(region);
        break;
    }

    // Update cache
    videoCache = {
      data: videos,
      timestamp: Date.now(),
      region: region
    };

    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    // Fallback to mock data
    return fetchMockVideos(region);
  }
};

/**
 * Check if cached data should be used
 */
const shouldUseCache = (region) => {
  if (!videoCache.data) return false;
  if (videoCache.region !== region) return false;
  
  const now = Date.now();
  const cacheAge = now - videoCache.timestamp;
  
  return cacheAge < config.cacheDuration;
};

/**
 * Fetch from official YouTube Data API v3
 */
const fetchFromYouTubeAPI = async (region) => {
  if (!config.youtubeApiKey || config.youtubeApiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
    console.warn('YouTube API key not configured. Falling back to mock data.');
    return fetchMockVideos(region);
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=${region}&maxResults=${config.maxVideosPerLoad}&key=${config.youtubeApiKey}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`);
  }

  const data = await response.json();

  return data.items.map(item => ({
    id: item.id,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    description: item.snippet.description.substring(0, 150) + '...',
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    likes: formatNumber(item.statistics.likeCount),
    views: formatNumber(item.statistics.viewCount),
    comments: formatNumber(item.statistics.commentCount),
    publishedAt: item.snippet.publishedAt
  }));
};

/**
 * Fetch from Invidious (YouTube alternative frontend)
 * No API key required!
 */
const fetchFromInvidious = async (region) => {
  try {
    const url = `${config.invidiousInstance}/api/v1/trending?region=${region}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Invidious API error: ${response.status}`);
    }

    const data = await response.json();

    return data.slice(0, config.maxVideosPerLoad).map(video => ({
      id: video.videoId,
      title: video.title,
      channel: video.author,
      description: video.description?.substring(0, 150) + '...' || 'No description available',
      thumbnail: video.videoThumbnails?.[4]?.url || video.videoThumbnails?.[0]?.url,
      likes: formatNumber(video.likeCount || 0),
      views: formatNumber(video.viewCount || 0),
      comments: formatNumber(0), // Invidious doesn't provide comment count
      publishedAt: video.published
    }));
  } catch (error) {
    console.error('Invidious fetch failed:', error);
    // Try alternative instance
    return fetchFromInvidiousBackup(region);
  }
};

/**
 * Backup Invidious instance
 */
const fetchFromInvidiousBackup = async (region) => {
  const backupInstances = [
    'https://invidious.snopyta.org',
    'https://yewtu.be',
    'https://vid.puffyan.us'
  ];

  for (const instance of backupInstances) {
    try {
      console.log(`Trying backup instance: ${instance}`);
      const url = `${instance}/api/v1/trending?region=${region}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        return data.slice(0, config.maxVideosPerLoad).map(video => ({
          id: video.videoId,
          title: video.title,
          channel: video.author,
          description: video.description?.substring(0, 150) + '...' || 'No description available',
          thumbnail: video.videoThumbnails?.[4]?.url || video.videoThumbnails?.[0]?.url,
          likes: formatNumber(video.likeCount || 0),
          views: formatNumber(video.viewCount || 0),
          comments: formatNumber(0),
          publishedAt: video.published
        }));
      }
    } catch (err) {
      continue;
    }
  }

  // If all instances fail, use mock data
  console.warn('All Invidious instances failed. Using mock data.');
  return fetchMockVideos(region);
};

/**
 * Fetch mock/demo videos (for testing)
 */
const fetchMockVideos = async (region) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const popularVideoIds = [
    'dQw4w9WgXcQ', // Popular music
    'jNQXAC9IVRw', // Me at the zoo (first YouTube video)
    'kJQP7kiw5Fk', // Luis Fonsi - Despacito
    '9bZkp7q19f0', // Gangnam Style
    'L_jWHffIx5E', // Smosh video
    'M7lc1UVf-VE', // Popular tech
    'OPf0YbXqDm0', // Ed Sheeran
    '60ItHLz5WEA', // Alan Walker - Faded
    'CevxZvSJLk8', // Katy Perry - Roar
    'RgKAFK5djSk', // Wiz Khalifa
    'hT_nvWreIhg', // OneRepublic
    'ZZ5LpwO-An4', // HowToBasic
    'FlsCjmMhFmw', // Post Malone
    'pt8VYOfr8To', // Bruno Mars
    'YQHsXMglC9A', // Adele
    'fJ9rUzIMcZQ', // Mark Ronson
    'nfWlot6h_JM', // Charlie Puth
    'KQ6zr6kCPj8', // David Guetta
    'kXYiU_JCYtU', // Sia
    'JGwWNGJdvx8'  // Ed Sheeran Shape of You
  ];

  const categories = [
    'Music', 'Gaming', 'Technology', 'Education', 'Entertainment',
    'Sports', 'News', 'Comedy', 'Science', 'Travel',
    'Food', 'Fashion', 'Fitness', 'DIY', 'Automotive'
  ];

  const channels = [
    'MrBeast', 'PewDiePie', 'SET India', 'Cocomelon', 'Sony SAB',
    'WWE', 'Zee TV', '5-Minute Crafts', 'Canal KondZilla', 'Justin Bieber',
    'Ed Sheeran', 'Eminem', 'Ariana Grande', 'Taylor Swift', 'Billie Eilish'
  ];

  return popularVideoIds.map((videoId, index) => {
    const category = categories[index % categories.length];
    const channel = channels[index % channels.length];
    const views = Math.floor(Math.random() * 900) + 100; // 100M - 1B
    const likes = Math.floor(views * 0.05); // ~5% like rate
    const comments = Math.floor(views * 0.002); // ~0.2% comment rate

    return {
      id: videoId,
      title: `${getPopularTitle(category)} - ${region} Trending #${index + 1}`,
      channel: channel,
      description: `This is one of the most popular ${category.toLowerCase()} videos trending right now in ${region}. Don't miss out on this amazing content!`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      likes: formatNumber(likes) + 'M',
      views: formatNumber(views) + 'M',
      comments: formatNumber(comments) + 'K',
      publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  });
};

/**
 * Generate popular title based on category
 */
const getPopularTitle = (category) => {
  const titles = {
    'Music': ['Top Hits 2024', 'Viral Music Video', 'Official Music Video', 'Best Songs Ever'],
    'Gaming': ['Epic Gaming Moments', 'Best Gameplay', 'Game Review', 'Live Gaming'],
    'Technology': ['Latest Tech Review', 'Unboxing Tech', 'Tech Tips', 'Gadget Showcase'],
    'Education': ['Learn This Now', 'Educational Content', 'Tutorial Guide', 'How To Guide'],
    'Entertainment': ['Viral Video', 'Entertainment Show', 'Funny Moments', 'Must Watch'],
    'Sports': ['Best Sports Moments', 'Game Highlights', 'Sports News', 'Championship'],
    'News': ['Breaking News', 'Latest Updates', 'News Today', 'World News'],
    'Comedy': ['Hilarious Comedy', 'Funny Sketches', 'Comedy Show', 'Laugh Out Loud'],
    'Science': ['Science Explained', 'Amazing Science', 'Discovery', 'Research Findings'],
    'Travel': ['Travel Vlog', 'Amazing Destinations', 'Travel Guide', 'Adventure Trip'],
    'Food': ['Cooking Show', 'Food Review', 'Recipe Tutorial', 'Delicious Food'],
    'Fashion': ['Fashion Trends', 'Style Guide', 'Fashion Show', 'Outfit Ideas'],
    'Fitness': ['Workout Routine', 'Fitness Tips', 'Health Guide', 'Exercise Tutorial'],
    'DIY': ['DIY Project', 'Creative Ideas', 'Life Hacks', 'Craft Tutorial'],
    'Automotive': ['Car Review', 'Auto Show', 'Vehicle Test', 'Racing Highlights']
  };

  const categoryTitles = titles[category] || ['Amazing Video'];
  return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
};

/**
 * Format large numbers into readable format
 */
const formatNumber = (num) => {
  if (!num) return '0';
  
  const number = typeof num === 'string' ? parseInt(num) : num;
  
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + 'B';
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return number.toString();
};

/**
 * Search for specific videos
 */
export const searchVideos = async (query) => {
  if (config.apiMode === 'youtube') {
    return searchYouTubeAPI(query);
  } else if (config.apiMode === 'invidious') {
    return searchInvidious(query);
  } else {
    return fetchMockVideos('US').then(videos => 
      videos.filter(v => v.title.toLowerCase().includes(query.toLowerCase()))
    );
  }
};

const searchYouTubeAPI = async (query) => {
  if (!config.youtubeApiKey || config.youtubeApiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
    return [];
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&key=${config.youtubeApiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();

  return data.items.map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.high?.url
  }));
};

const searchInvidious = async (query) => {
  const url = `${config.invidiousInstance}/api/v1/search?q=${encodeURIComponent(query)}`;
  
  const response = await fetch(url);
  const data = await response.json();

  return data.slice(0, 10).map(video => ({
    id: video.videoId,
    title: video.title,
    channel: video.author,
    description: video.description,
    thumbnail: video.videoThumbnails?.[4]?.url
  }));
};

export default {
  fetchPopularVideos,
  searchVideos
};

