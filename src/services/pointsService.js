/**
 * Points Service
 * Handles XP awarding and leaderboard data fetching
 */

import axios from 'axios';
import config from '../config/config';

const API_BASE = config.backendApiUrl || 'http://localhost:3001/api';
const USE_MOCK = config.apiMode === 'mock';

// Mock leaderboard data (sorted by totalPoints)
const MOCK_LEADERBOARD_DATA = {
  leaderboard: [
    {
      userId: 'user_seed_0',
      screenName: 'AlexTheCreator',
      totalPoints: 1920,
      topCategory: 'Music',
      categoryPoints: [
        { category: 'Music', points: 850 },
        { category: 'Film & Television', points: 620 },
        { category: 'Animation & Visual Effects', points: 450 }
      ],
      badges: ['First Watch', 'Video Master', 'Career Champion', 'Streak King'],
      streak: 15,
      rank: 1
    },
    {
      userId: 'user_seed_2',
      screenName: 'FilmFanatic',
      totalPoints: 1640,
      topCategory: 'Film & Television',
      categoryPoints: [
        { category: 'Film & Television', points: 780 },
        { category: 'Animation & Visual Effects', points: 540 },
        { category: 'Music', points: 320 }
      ],
      badges: ['First Watch', 'Video Master', 'Category Explorer'],
      streak: 8,
      rank: 2
    },
    {
      userId: 'user_seed_1',
      screenName: 'MusicMaven',
      totalPoints: 1590,
      topCategory: 'Music',
      categoryPoints: [
        { category: 'Music', points: 920 },
        { category: 'Business & Management', points: 380 },
        { category: 'Writing & Journalism', points: 290 }
      ],
      badges: ['First Watch', 'Video Master', 'Week Warrior'],
      streak: 12,
      rank: 3
    },
    {
      userId: 'user_seed_3',
      screenName: 'DesignDiva',
      totalPoints: 1440,
      topCategory: 'Animation & Visual Effects',
      categoryPoints: [
        { category: 'Animation & Visual Effects', points: 670 },
        { category: 'Film & Television', points: 490 },
        { category: 'Business & Management', points: 280 }
      ],
      badges: ['First Watch', 'Video Master'],
      streak: 6,
      rank: 4
    }
  ],
  badgeStats: [
    { badge: 'First Watch', count: 4 },
    { badge: 'Video Master', count: 4 },
    { badge: 'Career Champion', count: 1 },
    { badge: 'Streak King', count: 1 },
    { badge: 'Week Warrior', count: 1 },
    { badge: 'Category Explorer', count: 1 }
  ]
};

const MOCK_CHALLENGES = [
  {
    challengeId: 'watch_5_videos',
    title: 'Watch 5 Videos',
    description: 'Watch at least 5 career discovery videos today',
    category: 'General',
    pointsReward: 25,
    actionType: 'watch_videos',
    targetValue: 5,
    date: new Date()
  },
  {
    challengeId: 'like_3_videos',
    title: 'Like 3 Videos',
    description: 'Show your appreciation by liking 3 videos',
    category: 'General',
    pointsReward: 15,
    actionType: 'like_videos',
    targetValue: 3,
    date: new Date()
  },
  {
    challengeId: 'explore_category',
    title: 'Explore a Category',
    description: 'Watch videos from 3 different career categories',
    category: 'General',
    pointsReward: 30,
    actionType: 'explore_category',
    targetValue: 3,
    date: new Date()
  }
];

/**
 * Get current user ID (from localStorage or generate one)
 */
export const getUserId = () => {
  let userId = localStorage.getItem('spark_user_id');
  
  if (!userId) {
    // Generate a simple user ID
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('spark_user_id', userId);
  }
  
  return userId;
};

/**
 * Get or set screen name
 */
export const getScreenName = () => {
  return localStorage.getItem('spark_screen_name') || null;
};

export const setScreenName = (screenName) => {
  localStorage.setItem('spark_screen_name', screenName);
};

/**
 * Get or set school
 */
export const getSchool = () => {
  return localStorage.getItem('spark_school') || null;
};

export const setSchool = (school) => {
  localStorage.setItem('spark_school', school);
};

/**
 * Get or set region
 */
export const getRegion = () => {
  return localStorage.getItem('spark_region') || null;
};

export const setRegion = (region) => {
  localStorage.setItem('spark_region', region);
};

/**
 * Update challenge progress
 */
export const updateChallengeProgress = async (challengeId, progress = 1) => {
  try {
    const userId = getUserId();
    const response = await axios.post(`${API_BASE}/points/challenges/update`, {
      userId,
      challengeId,
      progress
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    // Fail silently - challenges are optional
    return null;
  }
};

/**
 * Add points to user
 * @param {string} careerCategory - Category name
 * @param {number} points - Points to add
 * @param {string} reason - Reason for points (e.g., 'video_watched', 'video_liked')
 */
export const addPoints = async (careerCategory, points, reason = '') => {
  try {
    const userId = getUserId();
    const screenName = getScreenName();
    const school = getSchool();
    const region = getRegion();
    
    const response = await axios.post(`${API_BASE}/points/add`, {
      userId,
      careerCategory,
      points,
      reason,
      screenName: screenName || undefined,
      school: school || undefined,
      region: region || undefined
    });
    
    if (response.data.success) {
      console.log(`[Points] Added ${points} points for ${careerCategory}:`, response.data.data);
      
      // Update challenge progress if applicable (async, don't wait)
      if (reason === 'video_watched') {
        updateChallengeProgress('watch_5_videos', 1).catch(() => {});
      } else if (reason === 'video_liked') {
        updateChallengeProgress('like_3_videos', 1).catch(() => {});
      }
      
      // Show notification if badges earned
      if (response.data.data.badgesEarned && response.data.data.badgesEarned.length > 0) {
        return {
          ...response.data.data,
          badgesEarned: response.data.data.badgesEarned
        };
      }
      
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error('[Points] Error adding points:', error);
    // Don't throw - fail silently so app continues working
    return null;
  }
};

/**
 * Get leaderboard data
 * @param {string} category - Optional category filter
 * @param {string} type - 'global', 'category', or 'regional'
 * @param {number} limit - Number of results
 * @param {string} region - Optional region filter
 * @param {string} school - Optional school filter
 */
export const getLeaderboard = async (category = null, type = 'global', limit = 50, region = null, school = null) => {
  // Return mock data if in mock mode
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    
    if (type === 'category' && category) {
      // Filter by category
      const filtered = MOCK_LEADERBOARD_DATA.leaderboard
        .map(user => {
          const catPoints = user.categoryPoints.find(cp => cp.category === category);
          if (!catPoints) return null;
          return {
            ...user,
            points: catPoints.points,
            rank: 0 // Will be re-ranked
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.points - a.points)
        .map((user, idx) => ({ ...user, rank: idx + 1 }));
      
      return {
        leaderboard: filtered,
        badgeStats: MOCK_LEADERBOARD_DATA.badgeStats,
        type: 'category',
        category
      };
    }
    
    return {
      ...MOCK_LEADERBOARD_DATA,
      type: 'global',
      category: null
    };
  }
  
  try {
    const params = { limit, type };
    if (category && type === 'category') {
      params.category = category;
    }
    if (region) {
      params.region = region;
    }
    if (school) {
      params.school = school;
    }
    
    const response = await axios.get(`${API_BASE}/points/leaderboard`, { params });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error('[Points] Error fetching leaderboard:', error);
    return null;
  }
};

/**
 * Get user progress
 * @param {string} userId - User ID (optional, uses current user if not provided)
 */
export const getUserProgress = async (userId = null) => {
  // Return mock data if in mock mode
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay
    const targetUserId = userId || getUserId();
    const screenName = getScreenName();
    
    // Return realistic user progress data
    return {
      userId: targetUserId,
      screenName: screenName || 'You',
      totalPoints: 450,
      categories: [
        {
          category: 'Film & Television',
          points: 180,
          badges: ['First Watch', 'Video Master'],
          weeklyPoints: 120,
          streak: 5
        },
        {
          category: 'Music',
          points: 150,
          badges: ['First Watch'],
          weeklyPoints: 80,
          streak: 3
        },
        {
          category: 'Animation & Visual Effects',
          points: 120,
          badges: ['First Watch'],
          weeklyPoints: 60,
          streak: 2
        }
      ],
      badges: ['First Watch', 'Video Master'],
      streak: 5,
      weeklyPoints: 260,
      lastActivity: new Date()
    };
  }
  
  try {
    const targetUserId = userId || getUserId();
    
    const response = await axios.get(`${API_BASE}/points/user/${targetUserId}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error('[Points] Error fetching user progress:', error);
    return null;
  }
};

/**
 * Get daily challenges
 */
export const getDailyChallenges = async () => {
  // Return mock data if in mock mode
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay
    return MOCK_CHALLENGES;
  }
  
  try {
    const response = await axios.get(`${API_BASE}/points/challenges`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('[Points] Error fetching challenges:', error);
    return [];
  }
};

/**
 * Get user's challenge progress
 */
export const getUserChallenges = async (userId = null) => {
  // Return mock data if in mock mode
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay
    // Return challenges with some progress
    return MOCK_CHALLENGES.map((challenge, idx) => ({
      ...challenge,
      progress: idx === 0 ? 2 : 0, // First challenge has 2/5 progress
      completed: false
    }));
  }
  
  try {
    const targetUserId = userId || getUserId();
    const response = await axios.get(`${API_BASE}/points/challenges/user/${targetUserId}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('[Points] Error fetching user challenges:', error);
    return [];
  }
};


/**
 * Seed leaderboard with sample data
 */
export const seedLeaderboard = async () => {
  // In mock mode, data is already seeded
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    console.log('[Points] Mock data already seeded');
    return true;
  }
  
  try {
    const response = await axios.post(`${API_BASE}/points/seed`);
    return response.data.success;
  } catch (error) {
    console.error('[Points] Error seeding leaderboard:', error);
    return false;
  }
};

/**
 * Award points for watching a video
 * @param {string} careerCategory - Video category
 * @param {number} watchDuration - Watch duration in milliseconds
 * @param {number} totalDuration - Total video duration in milliseconds
 */
export const awardVideoWatchPoints = async (careerCategory, watchDuration, totalDuration) => {
  if (!careerCategory) return null;
  
  // Calculate points based on watch percentage
  const watchPercentage = (watchDuration / totalDuration) * 100;
  
  let points = 0;
  if (watchPercentage >= 80) {
    points = 10; // Watched most of video
  } else if (watchPercentage >= 50) {
    points = 5; // Watched half
  } else if (watchPercentage >= 25) {
    points = 2; // Watched some
  }
  
  if (points > 0) {
    return await addPoints(careerCategory, points, 'video_watched');
  }
  
  return null;
};

/**
 * Award points for liking a video
 * @param {string} careerCategory - Video category
 */
export const awardLikePoints = async (careerCategory) => {
  if (!careerCategory) return null;
  return await addPoints(careerCategory, 3, 'video_liked');
};

/**
 * Award points for completing a quiz
 * @param {string} careerCategory - Quiz category
 * @param {number} score - Quiz score (0-100)
 */
export const awardQuizPoints = async (careerCategory, score) => {
  if (!careerCategory) return null;
  
  // Award points based on score
  let points = 0;
  if (score >= 90) {
    points = 20; // Excellent
  } else if (score >= 70) {
    points = 15; // Good
  } else if (score >= 50) {
    points = 10; // Pass
  } else {
    points = 5; // Attempted
  }
  
  return await addPoints(careerCategory, points, 'quiz_completed');
};

