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
    throw error;
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
    console.log('[Backend] ========================================');
    console.log('[Backend] 🔄 Starting API fetch...');
    console.log('[Backend] Backend URL:', config.backendApiUrl);
    console.log('[Backend] API Mode:', config.apiMode);
    console.log('[Backend] ========================================');
    
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
    
    console.log(`[Backend] 📡 Calling API: ${url}`);
    
    // Create timeout with better browser compatibility
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));
    
    console.log('[Backend] ✅ Got response! Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Backend] ❌ API error ${response.status}:`, errorText);
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('[Backend] 📦 Response data:', data);
    
    if (!data.success || !data.data) {
      console.error('[Backend] ❌ Invalid response structure:', data);
      throw new Error('Invalid response from backend');
    }
    
    console.log(`[Backend] ✅ SUCCESS! Received ${data.data.length} REAL videos from category: ${selectedCategory}`);
    
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
    console.error('[Backend] ========================================');
    console.error('[Backend] ❌ CRITICAL ERROR - API FETCH FAILED!');
    console.error('[Backend] Error type:', error.name);
    console.error('[Backend] Error message:', error.message);
    console.error('[Backend] Full error:', error);
    console.error('[Backend] ========================================');
    throw error;
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
 * Tries multiple instances to handle CORS and downtime
 */
const fetchInvidiousTrending = async (region = 'US') => {
  // List of Invidious instances to try (in order of preference)
  const instances = [
    'https://yewtu.be',
    'https://invidious.flokinet.to',
    'https://invidious.snopyta.org',
    'https://vid.puffyan.us',
    'https://invidious.io.lol',
    'https://invidious.osi.kr'
  ];

  for (const instance of instances) {
    try {
      console.log(`[Invidious] Trying instance: ${instance}`);
      const url = `${instance}/api/v1/trending?region=${region}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(url, { 
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      }).finally(() => clearTimeout(timeoutId));
      
      if (response.ok) {
        const data = await response.json();
        console.log(`[Invidious] Successfully fetched from ${instance}`);
        
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
      } else {
        console.warn(`[Invidious] ${instance} returned ${response.status}`);
      }
    } catch (error) {
      console.warn(`[Invidious] ${instance} failed:`, error.message);
      continue; // Try next instance
    }
  }
  
  console.error('[Invidious] All instances failed');
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
  
  const CAREER_CATEGORIES_FULL = [
    'Business & Management',
    'Animation & Visual Effects',
    'Writing & Journalism',
    'Music',
    'Sports',
    'Film & Television'
  ];
  
  const careerTitlesByCategory = {
    'Business & Management': [
      'How to Become a Talent Manager | Career Guide',
      'Event Coordinator: Day in the Life',
      'Marketing Manager: Behind the Scenes',
      'Production Management Career Path',
      'Business Development in Entertainment',
      'PR Specialist: What I Do All Day',
      'Casting Director Career Journey',
      'Entertainment Accountant Explained',
      'Legal Advisor in the Music Industry',
      'Administrative Support: Career Insights'
    ],
    'Animation & Visual Effects': [
      '3D Animator: Making Animated Movies',
      'VFX Artist Behind the Scenes',
      'Motion Graphics Designer Day in the Life',
      'Graphic Designer Career in Entertainment',
      'Character Animation: How I Got Started',
      'Compositor: VFX Breakdown',
      'Rigging Artist Tutorial',
      'Concept Art for Games and Film',
      'Storyboard Artist Career Path',
      'Technical Director: Animation Pipeline'
    ],
    'Writing & Journalism': [
      'Content Creator: Building Your Brand',
      'Entertainment Journalist Career Guide',
      'Scriptwriting 101: How to Break In',
      'Entertainment Writer: What I Do',
      'Publicist in the Entertainment Industry',
      'Copywriter for Brands: Day in the Life',
      'Magazine Editor Career Journey',
      'Social Media Manager for Artists',
      'Professional Blogger: Making Money',
      'Communications Director Career Path'
    ],
    'Music': [
      'Music Producer: Studio Session',
      'Audio Engineer: What I Do All Day',
      'Songwriter: Creating Hit Songs',
      'Singer: Journey to Success',
      'DJ Career: From Bedroom to Big Stage',
      'Music Director: Behind the Scenes',
      'Sound Design for Film and Games',
      'Mixing Engineer: Studio Techniques',
      'Mastering Engineer Explained',
      'Studio Manager Career Guide'
    ],
    'Sports': [
      'Sports Broadcaster: Play-by-Play Career',
      'Athletic Trainer Day in the Life',
      'Sports Marketing: Behind the Scenes',
      'Game Day Operations Manager',
      'Events Coordinator for Sports Teams',
      'Sports Sound Engineer Career',
      'Talent Scout: Finding the Next Star',
      'Sports Merchandising Manager',
      'Digital Designer for Sports Brands',
      'Sports Content Producer Career'
    ],
    'Film & Television': [
      'Director: Making My First Film',
      'Cinematographer: Day on Set',
      'Video Editor Career Path',
      'Actor: Auditioning and Acting Career',
      'Casting Director: How I Choose Actors',
      'Set Designer: Creating Movie Sets',
      'Costume Designer Behind the Scenes',
      'Makeup Artist for Film and TV',
      'Sound Engineer on Movie Sets',
      'Camera Operator: Film Production'
    ]
  };
  
  // Generate 100 videos (80+ as requested, with buffer)
  const videos = [];
  const targetCount = 100;
  
  for (let i = 0; i < targetCount; i++) {
    // Cycle through categories
    const categoryIndex = i % CAREER_CATEGORIES_FULL.length;
    const category = CAREER_CATEGORIES_FULL[categoryIndex];
    const titlesForCategory = careerTitlesByCategory[category];
    const titleIndex = Math.floor(i / CAREER_CATEGORIES_FULL.length) % titlesForCategory.length;
    const title = titlesForCategory[titleIndex];
    
    // Generate a unique video ID using picsum seed
    const videoId = `mock-${category.replace(/\s+/g, '-').toLowerCase()}-${i}`;
    const careerCategory = detectCareerCategory(title);
    
    videos.push({
      id: videoId,
      title: title,
      channel: getChannelForCategory(careerCategory),
      description: `Discover the world of ${category}. This video shows what it's really like to work in the creative industry. Perfect for young people exploring career options.`,
      thumbnail: `https://picsum.photos/seed/${videoId}/1920/1080`,
      likes: formatNumber(Math.floor(Math.random() * 500) + 50) + 'K',
      views: formatNumber(Math.floor(Math.random() * 1000) + 100) + 'M',
      comments: formatNumber(Math.floor(Math.random() * 50) + 5) + 'K',
      publishedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      careerCategory: careerCategory,
      category: category, // Add full category name for shorts
      tags: generateTagsForCategory(careerCategory),
      isLocalArtist: school && i % 20 === 0 // Every 20th video is a local artist
    });
  }
  
  return videos;
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

