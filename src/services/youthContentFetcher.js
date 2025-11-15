/**
 * Youth Content Fetcher (Ages 14-24)
 * Fetches videos popular with young people and features local artists
 */

import config from '../config/config';

// Career categories for creative industries
const CREATIVE_CAREER_CATEGORIES = [
  'choreographer',
  'music video director',
  'music producer',
  'dancer',
  'music video behind the scenes',
  'creative director',
  'video editor',
  'music video production',
  'filmmaker',
  'content creator',
  'music artist',
  'rapper',
  'singer',
  'songwriter',
  'beat maker',
  'music engineer',
  'fashion designer',
  'photographer',
  'graphic designer',
  'animator',
  'vfx artist',
  'podcast host',
  'dj',
  'music manager',
  'talent scout'
];

// Youth-focused search terms
const YOUTH_TRENDING_TERMS = [
  'trending music',
  'viral dance',
  'music video',
  'behind the scenes',
  'studio session',
  'music production',
  'rap music',
  'hip hop',
  'r&b',
  'trap music',
  'indie music',
  'music career',
  'how to make music',
  'music industry',
  'artist journey',
  'music documentary'
];

/**
 * Fetch videos popular with youth (14-24) with local artist focus
 */
export const fetchYouthContent = async (region = 'US', school = null, category = null, pageToken = null) => {
  try {
    console.log(`Fetching youth content for region: ${region}${school ? `, school: ${school}` : ''}${category ? `, category: ${category}` : ''}`);
    
    // Use backend API if configured
    if (config.apiMode === 'backend') {
      const result = await fetchFromBackend(region, school, category, pageToken);
      return result.videos; // Return just videos for backward compatibility
    }
    
    // Combine career discovery with local artist content
    const queries = buildYouthQueries(region, school);
    
    let allVideos = [];
    
    // Fetch from multiple sources
    if (config.apiMode === 'youtube') {
      allVideos = await fetchFromYouTubeYouthAPI(queries);
    } else if (config.apiMode === 'invidious') {
      allVideos = await fetchFromInvidiousYouth(queries);
    } else {
      allVideos = await fetchMockYouthContent(region, school);
    }
    
    // Enrich with career tags
    return enrichWithCareerTags(allVideos);
  } catch (error) {
    console.error('Error fetching youth content:', error);
    return fetchMockYouthContent(region, school);
  }
};

/**
 * Fetch more videos with pagination (for infinite scroll)
 */
export const fetchMoreYouthContent = async (region = 'US', school = null, category = null, pageToken = null) => {
  if (config.apiMode === 'backend') {
    return await fetchFromBackend(region, school, category, pageToken);
  }
  // For other modes, return empty (no pagination support)
  return { videos: [], nextPageToken: null, category: null };
};

// Career categories for the app
const CAREER_CATEGORIES = [
  'Business & Management',
  'Animation & Visual Effects',
  'Writing & Journalism',
  'Music',
  'Sports',
  'Film & Television'
];

/**
 * Fetch videos from backend API with categories
 */
const fetchFromBackend = async (region = 'US', school = null, category = null, pageToken = null) => {
  try {
    console.log('[Backend] Fetching videos from backend API...');
    
    // Check if backend URL is localhost in production (won't work)
    if (typeof window !== 'undefined' && config.backendApiUrl.includes('localhost') && window.location.hostname !== 'localhost') {
      console.warn('[Backend] Backend URL is localhost but we are in production. Falling back to Invidious.');
      throw new Error('Backend not configured for production. Please set VITE_BACKEND_API_URL in Netlify.');
    }
    
    // Use category if provided, otherwise rotate through categories
    const selectedCategory = category || CAREER_CATEGORIES[Math.floor(Math.random() * CAREER_CATEGORIES.length)];
    
    // Call backend API with category
    let url = `${config.backendApiUrl}/youtube/top?category=${encodeURIComponent(selectedCategory)}&regionCode=${region}&maxResults=${config.maxVideosPerLoad}`;
    if (pageToken) {
      url += `&pageToken=${encodeURIComponent(pageToken)}`;
    }
    
    console.log(`[Backend] Calling: ${url}`);
    
    const response = await fetch(url, {
      // Add timeout for production
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Backend] API error ${response.status}:`, errorText);
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error('Invalid response from backend');
    }
    
    console.log(`[Backend] Received ${data.data.length} videos from category: ${selectedCategory}`);
    
    // Transform backend response to frontend format
    const videos = data.data.map(video => ({
      id: video.videoId,
      title: video.title,
      channel: video.channelName,
      description: `Career discovery content - ${selectedCategory}`,
      thumbnail: video.thumbnail,
      views: formatNumber(video.viewCount),
      likes: '0',
      comments: '0',
      careerCategory: mapCategoryToCareerCategory(selectedCategory),
      tags: generateTagsForCategory(mapCategoryToCareerCategory(selectedCategory)),
      isLocalArtist: school ? video.title.toLowerCase().includes(school.toLowerCase()) : false,
      category: selectedCategory // Store category for tracking
    }));
    
    // Return videos with nextPageToken for pagination
    return {
      videos: enrichWithCareerTags(videos),
      nextPageToken: data.nextPageToken || null,
      category: selectedCategory
    };
  } catch (error) {
    console.error('[Backend] Error fetching from backend:', error);
    
    // If we're in production and backend fails, try to use Invidious if available
    if (config.apiMode === 'backend' && typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      console.log('[Backend] Production backend failed. Attempting to use Invidious fallback...');
      try {
        const invidiousVideos = await fetchInvidiousTrending(region);
        if (invidiousVideos && invidiousVideos.length > 0) {
          console.log(`[Backend] Using ${invidiousVideos.length} videos from Invidious fallback`);
          return {
            videos: invidiousVideos,
            nextPageToken: null,
            category: null
          };
        }
      } catch (invError) {
        console.error('[Backend] Invidious fallback also failed:', invError);
      }
    }
    
    console.log('[Backend] Falling back to mock data');
    // Fallback to mock data if backend fails
    const mockVideos = fetchMockYouthContent(region, school);
    return {
      videos: mockVideos,
      nextPageToken: null,
      category: null
    };
  }
};

/**
 * Map category name to career category code
 */
const mapCategoryToCareerCategory = (category) => {
  const mapping = {
    'Business & Management': 'music_business',
    'Animation & Visual Effects': 'video_editing',
    'Writing & Journalism': 'creative_career',
    'Music': 'music_production',
    'Sports': 'creative_career',
    'Film & Television': 'filmmaking'
  };
  return mapping[category] || 'creative_career';
};

/**
 * Build search queries targeting youth and local artists
 */
const buildYouthQueries = (region, school) => {
  const queries = [];
  
  // Add career discovery queries
  CREATIVE_CAREER_CATEGORIES.slice(0, 10).forEach(career => {
    queries.push(`how to become ${career}`);
    queries.push(`${career} career`);
    queries.push(`${career} day in the life`);
  });
  
  // Add youth trending terms
  YOUTH_TRENDING_TERMS.slice(0, 8).forEach(term => {
    queries.push(term);
  });
  
  // Add local artist queries
  if (region && region !== 'US') {
    queries.push(`${region} music artist`);
    queries.push(`${region} rapper`);
    queries.push(`${region} local music`);
  }
  
  if (school) {
    queries.push(`${school} music`);
    queries.push(`${school} artist`);
  }
  
  // Add Atlanta-specific queries
  if (region.includes('Atlanta') || school) {
    queries.push('Atlanta music scene');
    queries.push('Atlanta rapper');
    queries.push('Atlanta music producer');
    queries.push('Atlanta hip hop');
    queries.push('ATL music');
  }
  
  return queries;
};

/**
 * Fetch from YouTube API with youth-focused queries
 */
const fetchFromYouTubeYouthAPI = async (queries) => {
  if (!config.youtubeApiKey || config.youtubeApiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
    return [];
  }

  const allVideos = [];
  
  // Fetch from multiple queries (limited to avoid quota issues)
  for (const query of queries.slice(0, 5)) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&order=viewCount&key=${config.youtubeApiKey}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        const videos = data.items.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          description: item.snippet.description?.substring(0, 150) + '...',
          thumbnail: item.snippet.thumbnails.high?.url,
          publishedAt: item.snippet.publishedAt
        }));
        allVideos.push(...videos);
      }
    } catch (error) {
      console.error(`Error fetching query "${query}":`, error);
    }
  }
  
  return allVideos;
};

/**
 * Fetch trending videos from Invidious (fallback for production)
 */
const fetchInvidiousTrending = async (region = 'US') => {
  try {
    const url = `${config.invidiousInstance}/api/v1/trending?region=${region}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    
    if (response.ok) {
      const data = await response.json();
      return data.slice(0, config.maxVideosPerLoad).map(video => ({
        id: video.videoId,
        title: video.title,
        channel: video.author,
        description: video.description?.substring(0, 150) + '...' || 'No description available',
        thumbnail: video.videoThumbnails?.[4]?.url || video.videoThumbnails?.[0]?.url,
        views: formatNumber(video.viewCount || 0),
        likes: formatNumber(video.likeCount || 0),
        comments: formatNumber(0),
        careerCategory: 'creative_career',
        tags: [],
        isLocalArtist: false,
        category: null
      }));
    }
  } catch (error) {
    console.error('[Invidious] Error fetching trending:', error);
  }
  return [];
};

/**
 * Fetch from Invidious with youth focus
 */
const fetchFromInvidiousYouth = async (queries) => {
  const allVideos = [];
  
  for (const query of queries.slice(0, 5)) {
    try {
      const url = `${config.invidiousInstance}/api/v1/search?q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        const videos = data
          .filter(item => item.type === 'video')
          .slice(0, 10)
          .map(video => ({
            id: video.videoId,
            title: video.title,
            channel: video.author,
            description: video.description?.substring(0, 150) + '...',
            thumbnail: video.videoThumbnails?.[4]?.url,
            views: formatNumber(video.viewCount || 0),
            publishedAt: video.published
          }));
        allVideos.push(...videos);
      }
    } catch (error) {
      console.error(`Error fetching from Invidious:`, error);
    }
  }
  
  return allVideos;
};

/**
 * Generate mock youth-focused content with career discovery
 */
const fetchMockYouthContent = async (region, school) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const youthVideoIds = [
    'kJQP7kiw5Fk', // Despacito - music video
    '9bZkp7q19f0', // Gangnam Style - viral dance
    'OPf0YbXqDm0', // Ed Sheeran - music
    '60ItHLz5WEA', // Alan Walker - electronic music
    'RgKAFK5djSk', // Wiz Khalifa - rap
    'hT_nvWreIhg', // OneRepublic - pop
    'FlsCjmMhFmw', // Post Malone - hip hop
    'pt8VYOfr8To', // Bruno Mars - pop
    'YQHsXMglC9A', // Adele - music
    'fJ9rUzIMcZQ', // Mark Ronson - producer
    'nfWlot6h_JM', // Charlie Puth - pop
    'KQ6zr6kCPj8', // David Guetta - EDM
    'kXYiU_JCYtU', // Sia - pop
    'JGwWNGJdvx8', // Ed Sheeran - Shape of You
    'dQw4w9WgXcQ'  // Popular music
  ];
  
  const careerTitles = [
    'How to Become a Music Producer | Day in the Life',
    'Behind the Scenes: Music Video Production',
    'Choreographer Career: How I Got Started',
    'Music Video Director: A Day on Set',
    'How to Make Beats: Music Production Tutorial',
    'Rapper Journey: From Studio to Stage',
    'Music Video Behind the Scenes: Making of Hit Song',
    'Creative Director: What I Do All Day',
    'Video Editor Career: Editing Music Videos',
    'Music Industry: How to Break In',
    'Studio Session: Making a Hit Song',
    'Dancer to Choreographer: My Career Path',
    'Music Producer: Creating Beats in the Studio',
    'Filmmaker: Directing Music Videos',
    'Content Creator: Building a Music Career'
  ];
  
  const localArtists = school ? [
    `${school} Alumni Music Success Story`,
    `Local Artist from ${school}`,
    `${school} Music Program Highlights`
  ] : region.includes('Atlanta') ? [
    'Atlanta Rapper: Rising Star',
    'ATL Music Producer: Studio Tour',
    'Atlanta Hip Hop Scene: Documentary',
    'Local Atlanta Artist: Journey to Success'
  ] : [];
  
  const allTitles = [...careerTitles, ...localArtists];
  
  return youthVideoIds.map((videoId, index) => {
    const title = allTitles[index % allTitles.length];
    const category = detectCareerCategory(title);
    
    return {
      id: videoId,
      title: title,
      channel: getChannelForCategory(category),
      description: `Discover the world of ${category}. This video shows what it's really like to work in the creative industry. Perfect for young people exploring career options.`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      likes: formatNumber(Math.floor(Math.random() * 500) + 50) + 'K',
      views: formatNumber(Math.floor(Math.random() * 1000) + 100) + 'M',
      comments: formatNumber(Math.floor(Math.random() * 50) + 5) + 'K',
      publishedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      careerCategory: category,
      tags: generateTagsForCategory(category),
      isLocalArtist: localArtists.some(artist => title.includes(artist))
    };
  });
};

/**
 * Detect career category from title
 */
const detectCareerCategory = (title) => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('producer') || lowerTitle.includes('beat')) return 'music_production';
  if (lowerTitle.includes('choreographer') || lowerTitle.includes('dancer')) return 'dance';
  if (lowerTitle.includes('director') || lowerTitle.includes('filmmaker')) return 'filmmaking';
  if (lowerTitle.includes('editor') || lowerTitle.includes('editing')) return 'video_editing';
  if (lowerTitle.includes('rapper') || lowerTitle.includes('hip hop')) return 'rap_music';
  if (lowerTitle.includes('creative director')) return 'creative_direction';
  if (lowerTitle.includes('behind the scenes')) return 'production';
  if (lowerTitle.includes('studio')) return 'music_production';
  if (lowerTitle.includes('music industry')) return 'music_business';
  
  return 'creative_career';
};

/**
 * Get channel name based on category
 */
const getChannelForCategory = (category) => {
  const channels = {
    'music_production': 'Music Production Academy',
    'dance': 'Dance Career Hub',
    'filmmaking': 'Film School',
    'video_editing': 'Edit Like a Pro',
    'rap_music': 'Hip Hop Central',
    'creative_direction': 'Creative Careers',
    'production': 'Behind the Scenes',
    'music_business': 'Music Industry Insider',
    'creative_career': 'Career Discovery'
  };
  
  return channels[category] || 'Creative Careers';
};

/**
 * Generate tags for career category
 */
const generateTagsForCategory = (category) => {
  const tagMap = {
    'music_production': ['music', 'producer', 'beats', 'studio', 'career'],
    'dance': ['dance', 'choreography', 'performing arts', 'career'],
    'filmmaking': ['film', 'director', 'cinematography', 'career'],
    'video_editing': ['editing', 'post-production', 'video', 'career'],
    'rap_music': ['rap', 'hip hop', 'music', 'artist', 'career'],
    'creative_direction': ['creative', 'design', 'art direction', 'career'],
    'production': ['behind the scenes', 'production', 'career'],
    'music_business': ['music industry', 'business', 'career'],
    'creative_career': ['creative', 'career', 'discovery']
  };
  
  return tagMap[category] || ['career', 'creative'];
};

/**
 * Enrich videos with career discovery tags
 */
const enrichWithCareerTags = (videos) => {
  return videos.map(video => {
    if (!video.careerCategory) {
      video.careerCategory = detectCareerCategory(video.title);
    }
    if (!video.tags) {
      video.tags = generateTagsForCategory(video.careerCategory);
    }
    return video;
  });
};

/**
 * Format numbers
 */
const formatNumber = (num) => {
  if (!num) return '0';
  const number = typeof num === 'string' ? parseInt(num) : num;
  if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M';
  if (number >= 1000) return (number / 1000).toFixed(1) + 'K';
  return number.toString();
};

export default {
  fetchYouthContent,
  CREATIVE_CAREER_CATEGORIES
};

