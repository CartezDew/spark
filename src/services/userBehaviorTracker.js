/**
 * User Behavior Tracker
 * Tracks watch time, scroll patterns, likes, reactions, and comments
 * to learn user interests for AI-powered career discovery
 */

// In-memory storage (in production, use localStorage or backend)
let userBehaviorData = {
  watchTime: {}, // videoId -> milliseconds watched
  scrollPatterns: [], // Array of scroll events
  likes: new Set(), // Set of liked video IDs
  replays: {}, // videoId -> replay count
  reactions: {}, // videoId -> reaction type
  comments: {}, // videoId -> comment text
  skippedVideos: new Set(), // Videos that were quickly skipped
  interests: {}, // careerCategory -> interest score
  categoryWatchHistory: [], // Array of categories watched in order
  currentCategoryStreak: { category: null, count: 0 }, // Track consecutive category watches
  preferredCategory: null, // Category user is focused on (3+ consecutive)
  lastUpdated: Date.now()
};

/**
 * Initialize from localStorage if available
 */
export const initializeTracker = () => {
  try {
    const saved = localStorage.getItem('spark_user_behavior');
    if (saved) {
      const parsed = JSON.parse(saved);
      userBehaviorData = {
        ...userBehaviorData,
        ...parsed,
        likes: new Set(parsed.likes || []),
        skippedVideos: new Set(parsed.skippedVideos || []),
        categoryWatchHistory: parsed.categoryWatchHistory || [],
        currentCategoryStreak: parsed.currentCategoryStreak || { category: null, count: 0 },
        preferredCategory: parsed.preferredCategory || null
      };
    }
  } catch (error) {
    console.error('Error loading user behavior:', error);
  }
};

/**
 * Track video watch time
 */
export const trackWatchTime = (videoId, milliseconds, totalDuration, videoCategory = null) => {
  if (!userBehaviorData.watchTime[videoId]) {
    userBehaviorData.watchTime[videoId] = 0;
  }
  
  userBehaviorData.watchTime[videoId] += milliseconds;
  
  // Calculate engagement percentage
  const engagement = totalDuration > 0 
    ? (userBehaviorData.watchTime[videoId] / totalDuration) * 100 
    : 0;
  
  // If watched more than 70%, consider it highly engaged
  if (engagement > 70) {
    markHighEngagement(videoId);
    
    // Track category if user watched most of the video
    if (videoCategory) {
      trackCategoryWatch(videoCategory);
    }
  }
  
  // If watched less than 10% and quickly scrolled, mark as skipped
  if (engagement < 10 && milliseconds < 3000) {
    userBehaviorData.skippedVideos.add(videoId);
  }
  
  saveToStorage();
};

/**
 * Track category watch - detects when user watches 3+ videos from same category
 */
const trackCategoryWatch = (category) => {
  if (!category) return;
  
  // Normalize category name (handle both careerCategory codes and full category names)
  const normalizedCategory = normalizeCategoryName(category);
  
  // Add to history (keep last 10)
  userBehaviorData.categoryWatchHistory.push({
    category: normalizedCategory,
    timestamp: Date.now()
  });
  
  if (userBehaviorData.categoryWatchHistory.length > 10) {
    userBehaviorData.categoryWatchHistory = userBehaviorData.categoryWatchHistory.slice(-10);
  }
  
  // Check for consecutive category watches (last 3)
  const recentWatches = userBehaviorData.categoryWatchHistory.slice(-3);
  const allSameCategory = recentWatches.length >= 3 && 
    recentWatches.every(w => w.category === normalizedCategory);
  
  if (allSameCategory) {
    // User watched 3+ videos from same category consecutively
    userBehaviorData.currentCategoryStreak = {
      category: normalizedCategory,
      count: recentWatches.length
    };
    userBehaviorData.preferredCategory = normalizedCategory;
    console.log(`[Tracker] 🎯 User showing strong interest in ${normalizedCategory} (${recentWatches.length} consecutive watches)`);
  } else {
    // Check if category changed - reset streak
    const lastWatch = userBehaviorData.categoryWatchHistory[userBehaviorData.categoryWatchHistory.length - 2];
    if (lastWatch && lastWatch.category !== normalizedCategory) {
      // Category changed, reset streak
      userBehaviorData.currentCategoryStreak = { category: null, count: 0 };
      userBehaviorData.preferredCategory = null;
      console.log(`[Tracker] Category changed from ${lastWatch.category} to ${normalizedCategory}, resetting preference`);
    }
  }
  
  saveToStorage();
};

/**
 * Normalize category name - map careerCategory codes to full category names
 */
const normalizeCategoryName = (category) => {
  if (!category) return null;
  
  // Map of careerCategory codes to full category names
  const categoryMap = {
    'music_business': 'Business & Management',
    'video_editing': 'Animation & Visual Effects',
    'creative_career': 'Writing & Journalism',
    'music_production': 'Music',
    'filmmaking': 'Film & Television',
    'dance': 'Sports', // Dance could be sports/entertainment
    'rap_music': 'Music',
    'production': 'Film & Television'
  };
  
  // If it's already a full category name, return it
  const fullCategories = [
    'Business & Management',
    'Animation & Visual Effects',
    'Writing & Journalism',
    'Music',
    'Sports',
    'Film & Television'
  ];
  
  if (fullCategories.includes(category)) {
    return category;
  }
  
  // Otherwise, try to map from code
  return categoryMap[category] || category;
};

/**
 * Track scroll pattern
 */
export const trackScroll = (direction, videoId, timestamp) => {
  userBehaviorData.scrollPatterns.push({
    direction, // 'up' or 'down'
    videoId,
    timestamp,
    date: new Date().toISOString()
  });
  
  // Keep only last 100 scroll events
  if (userBehaviorData.scrollPatterns.length > 100) {
    userBehaviorData.scrollPatterns = userBehaviorData.scrollPatterns.slice(-100);
  }
  
  saveToStorage();
};

/**
 * Track like
 */
export const trackLike = (videoId, careerCategory) => {
  userBehaviorData.likes.add(videoId);
  
  // Increase interest in this career category
  if (careerCategory) {
    incrementInterest(careerCategory, 10);
  }
  
  saveToStorage();
};

/**
 * Track unlike
 */
export const trackUnlike = (videoId, careerCategory) => {
  userBehaviorData.likes.delete(videoId);
  
  // Decrease interest slightly
  if (careerCategory) {
    incrementInterest(careerCategory, -2);
  }
  
  saveToStorage();
};

/**
 * Track replay
 */
export const trackReplay = (videoId, careerCategory) => {
  if (!userBehaviorData.replays[videoId]) {
    userBehaviorData.replays[videoId] = 0;
  }
  userBehaviorData.replays[videoId]++;
  
  // High interest indicator
  if (careerCategory) {
    incrementInterest(careerCategory, 15);
  }
  
  saveToStorage();
};

/**
 * Track reaction
 */
export const trackReaction = (videoId, reactionType, careerCategory) => {
  if (!userBehaviorData.reactions[videoId]) {
    userBehaviorData.reactions[videoId] = [];
  }
  userBehaviorData.reactions[videoId].push({
    type: reactionType, // 'love', 'wow', 'inspired', etc.
    timestamp: Date.now()
  });
  
  // Positive reactions increase interest
  if (careerCategory && ['love', 'inspired', 'wow'].includes(reactionType)) {
    incrementInterest(careerCategory, 8);
  }
  
  saveToStorage();
};

/**
 * Track comment
 */
export const trackComment = (videoId, commentText, careerCategory) => {
  if (!userBehaviorData.comments[videoId]) {
    userBehaviorData.comments[videoId] = [];
  }
  userBehaviorData.comments[videoId].push({
    text: commentText,
    timestamp: Date.now()
  });
  
  // Comments indicate high engagement
  if (careerCategory) {
    incrementInterest(careerCategory, 12);
  }
  
  saveToStorage();
};

/**
 * Mark high engagement video
 */
const markHighEngagement = (videoId) => {
  // This can be used for recommendations
  if (!userBehaviorData.highEngagement) {
    userBehaviorData.highEngagement = new Set();
  }
  userBehaviorData.highEngagement.add(videoId);
};

/**
 * Increment interest score for a career category
 */
const incrementInterest = (category, points) => {
  if (!userBehaviorData.interests[category]) {
    userBehaviorData.interests[category] = 0;
  }
  userBehaviorData.interests[category] += points;
  
  // Cap at 100
  if (userBehaviorData.interests[category] > 100) {
    userBehaviorData.interests[category] = 100;
  }
  
  // Don't go below 0
  if (userBehaviorData.interests[category] < 0) {
    userBehaviorData.interests[category] = 0;
  }
};

/**
 * Get user interests (sorted by score)
 */
export const getUserInterests = () => {
  const interests = Object.entries(userBehaviorData.interests)
    .sort((a, b) => b[1] - a[1])
    .map(([category, score]) => ({ category, score }));
  
  return interests;
};

/**
 * Get top interests
 */
export const getTopInterests = (limit = 5) => {
  return getUserInterests().slice(0, limit);
};

/**
 * Check if user liked a video
 */
export const hasLiked = (videoId) => {
  return userBehaviorData.likes.has(videoId);
};

/**
 * Get replay count
 */
export const getReplayCount = (videoId) => {
  return userBehaviorData.replays[videoId] || 0;
};

/**
 * Get watch time for a video
 */
export const getWatchTime = (videoId) => {
  return userBehaviorData.watchTime[videoId] || 0;
};

/**
 * Get engagement score for a video
 */
export const getEngagementScore = (videoId) => {
  let score = 0;
  
  if (userBehaviorData.likes.has(videoId)) score += 20;
  if (userBehaviorData.replays[videoId]) score += userBehaviorData.replays[videoId] * 15;
  if (userBehaviorData.reactions[videoId]) score += userBehaviorData.reactions[videoId].length * 10;
  if (userBehaviorData.comments[videoId]) score += userBehaviorData.comments[videoId].length * 12;
  if (userBehaviorData.skippedVideos.has(videoId)) score -= 30;
  
  const watchTime = userBehaviorData.watchTime[videoId] || 0;
  if (watchTime > 60000) score += 25; // Watched more than 1 minute
  
  return Math.max(0, score);
};

/**
 * Save to localStorage
 */
const saveToStorage = () => {
  try {
    const toSave = {
      ...userBehaviorData,
      likes: Array.from(userBehaviorData.likes),
      skippedVideos: Array.from(userBehaviorData.skippedVideos),
      categoryWatchHistory: userBehaviorData.categoryWatchHistory,
      currentCategoryStreak: userBehaviorData.currentCategoryStreak,
      preferredCategory: userBehaviorData.preferredCategory,
      lastUpdated: Date.now()
    };
    localStorage.setItem('spark_user_behavior', JSON.stringify(toSave));
  } catch (error) {
    console.error('Error saving user behavior:', error);
  }
};

/**
 * Clear all tracking data
 */
export const clearTrackingData = () => {
  userBehaviorData = {
    watchTime: {},
    scrollPatterns: [],
    likes: new Set(),
    replays: {},
    reactions: {},
    comments: {},
    skippedVideos: new Set(),
    interests: {},
    categoryWatchHistory: [],
    currentCategoryStreak: { category: null, count: 0 },
    preferredCategory: null,
    lastUpdated: Date.now()
  };
  localStorage.removeItem('spark_user_behavior');
};

/**
 * Get preferred category (if user watched 3+ consecutive videos)
 */
export const getPreferredCategory = () => {
  return userBehaviorData.preferredCategory;
};

/**
 * Get category streak info
 */
export const getCategoryStreak = () => {
  return userBehaviorData.currentCategoryStreak;
};

/**
 * Reset category preference (when user switches categories)
 */
export const resetCategoryPreference = () => {
  userBehaviorData.preferredCategory = null;
  userBehaviorData.currentCategoryStreak = { category: null, count: 0 };
  saveToStorage();
};

/**
 * Get analytics summary
 */
export const getAnalyticsSummary = () => {
  return {
    totalVideosWatched: Object.keys(userBehaviorData.watchTime).length,
    totalLikes: userBehaviorData.likes.size,
    totalReplays: Object.keys(userBehaviorData.replays).length,
    topInterests: getTopInterests(5),
    totalScrolls: userBehaviorData.scrollPatterns.length,
    preferredCategory: userBehaviorData.preferredCategory,
    categoryStreak: userBehaviorData.currentCategoryStreak
  };
};

// Initialize on load
if (typeof window !== 'undefined') {
  initializeTracker();
}

export default {
  trackWatchTime,
  trackScroll,
  trackLike,
  trackUnlike,
  trackReplay,
  trackReaction,
  trackComment,
  getUserInterests,
  getTopInterests,
  hasLiked,
  getReplayCount,
  getWatchTime,
  getEngagementScore,
  getPreferredCategory,
  getCategoryStreak,
  resetCategoryPreference,
  getAnalyticsSummary,
  clearTrackingData
};

