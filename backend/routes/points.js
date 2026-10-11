/**
 * Points API Routes
 * Handles XP, badges, and leaderboard
 */

import express from 'express';
import UserPoints from '../models/UserPoints.js';
import DailyChallenge from '../models/DailyChallenge.js';
import UserChallenge from '../models/UserChallenge.js';

const router = express.Router();

/**
 * POST /api/points/add
 * Add points to a user for a specific category
 * 
 * Body:
 * - userId: string (required)
 * - careerCategory: string (required)
 * - points: number (required)
 * - reason: string (optional) - e.g., "video_watched", "video_liked", "quiz_completed"
 */
router.post('/add', async (req, res) => {
  try {
    const { userId, careerCategory, points, reason = '' } = req.body;
    
    if (!userId || !careerCategory || points === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, careerCategory, and points are required'
      });
    }
    
    // Update screen name, school, and region if provided
    const { screenName, school, region } = req.body;
    const updateFields = {};
    if (screenName) updateFields.screenName = screenName;
    if (school) updateFields.school = school;
    if (region) updateFields.region = region;
    
    if (Object.keys(updateFields).length > 0) {
      await UserPoints.updateMany(
        { userId },
        { $set: updateFields },
        { upsert: false }
      );
    }
    
    if (typeof points !== 'number' || points <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Points must be a positive number'
      });
    }
    
    console.log(`[Points] Adding ${points} points to user ${userId} for ${careerCategory} (${reason})`);
    
    // Get or create user points document
    const userPoints = await UserPoints.getOrCreate(userId, careerCategory);
    
    // Check weekly reset
    await userPoints.checkWeeklyReset();
    
    // Update streak
    await userPoints.updateStreak();
    
    // Add points
    const badgesEarned = await userPoints.addPoints(points, reason);
    
    res.json({
      success: true,
      data: {
        userId: userPoints.userId,
        careerCategory: userPoints.careerCategory,
        points: userPoints.points,
        totalPoints: userPoints.totalPoints,
        badges: userPoints.badges,
        badgesEarned: badgesEarned,
        weeklyPoints: userPoints.weeklyPoints,
        streak: userPoints.streak
      }
    });
  } catch (error) {
    console.error('[Points] Add error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add points'
    });
  }
});

/**
 * GET /api/points/leaderboard
 * Get leaderboard data
 * 
 * Query params:
 * - category: Filter by career category (optional)
 * - limit: Number of results (default: 50)
 * - type: 'global', 'category', or 'regional' (default: 'global')
 * - region: Filter by region (optional, for regional leaderboards)
 * - school: Filter by school (optional, for school leaderboards)
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const { category, limit = 50, type = 'global', region, school } = req.query;
    
    let leaderboard = [];
    let matchFilter = {};
    
    // Apply regional filter if specified
    if (region) {
      matchFilter.region = region;
    }
    if (school) {
      matchFilter.school = school;
    }
    
    if (type === 'category' && category) {
      // Category-specific leaderboard
      const categoryFilter = { careerCategory: category, ...matchFilter };
      const categoryPoints = await UserPoints.find(categoryFilter)
        .sort({ points: -1 })
        .limit(parseInt(limit))
        .lean();
      
      // Get screen names for users
      const userIds = [...new Set(categoryPoints.map(doc => doc.userId))];
      const userScreenNames = await UserPoints.distinct('screenName', { userId: { $in: userIds } });
      const screenNameMap = {};
      for (const doc of categoryPoints) {
        const userDoc = await UserPoints.findOne({ userId: doc.userId }).lean();
        screenNameMap[doc.userId] = userDoc?.screenName || doc.userId.substring(0, 12);
      }
      
      leaderboard = categoryPoints.map((doc, index) => ({
        rank: index + 1,
        userId: doc.userId,
        screenName: screenNameMap[doc.userId] || doc.userId.substring(0, 12),
        careerCategory: doc.careerCategory,
        points: doc.points,
        totalPoints: doc.totalPoints,
        badges: doc.badges,
        streak: doc.streak,
        school: doc.school,
        region: doc.region
      }));
    } else {
      // Nationwide or regional leaderboard (by total points)
      const aggregationPipeline = [];
      
      // Add match stage if filtering by region/school
      if (Object.keys(matchFilter).length > 0) {
        aggregationPipeline.push({ $match: matchFilter });
      }
      
      aggregationPipeline.push({
        $group: {
            _id: '$userId',
            totalPoints: { $sum: '$points' },
            categories: { $push: '$careerCategory' },
            points: { $push: { category: '$careerCategory', points: '$points' } },
            allBadges: { $push: '$badges' },
            maxStreak: { $max: '$streak' },
            lastActivity: { $max: '$lastActivity' },
            screenNames: { $push: '$screenName' },
            schools: { $push: '$school' },
            regions: { $push: '$region' }
          }
        },
        {
          $project: {
            userId: '$_id',
            screenName: { 
              $arrayElemAt: [
                { $filter: { input: '$screenNames', as: 'name', cond: { $ne: ['$$name', null] } } },
                0
              ]
            },
            totalPoints: 1,
            topCategory: { $arrayElemAt: ['$categories', 0] },
            categoryPoints: '$points',
            badges: { $reduce: { input: '$allBadges', initialValue: [], in: { $setUnion: ['$$value', '$$this'] } } },
            streak: '$maxStreak',
            lastActivity: 1,
            school: { 
              $arrayElemAt: [
                { $filter: { input: '$schools', as: 'sch', cond: { $ne: ['$$sch', null] } } },
                0
              ]
            },
            region: { 
              $arrayElemAt: [
                { $filter: { input: '$regions', as: 'reg', cond: { $ne: ['$$reg', null] } } },
                0
              ]
            }
          }
        });
      
      aggregationPipeline.push({ $sort: { totalPoints: -1 } });
      aggregationPipeline.push({ $limit: parseInt(limit) });
      
      const allUsers = await UserPoints.aggregate(aggregationPipeline);
      
      leaderboard = allUsers.map((user, index) => ({
        rank: index + 1,
        userId: user.userId,
        screenName: user.screenName || user.userId.substring(0, 12),
        totalPoints: user.totalPoints,
        topCategory: user.topCategory,
        categoryPoints: user.categoryPoints,
        badges: user.badges,
        streak: user.streak,
        lastActivity: user.lastActivity,
        school: user.school,
        region: user.region
      }));
    }
    
    // Get badge statistics
    const badgeStats = await UserPoints.aggregate([
      { $unwind: '$badges' },
      { $group: { _id: '$badges', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        leaderboard,
        badgeStats: badgeStats.map(stat => ({
          badge: stat._id,
          count: stat.count
        })),
        type: type,
        category: category || null,
        region: region || null,
        school: school || null
      }
    });
  } catch (error) {
    console.error('[Points] Leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch leaderboard'
    });
  }
});

/**
 * GET /api/points/user/:userId
 * Get individual user progress
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userPoints = await UserPoints.find({ userId }).lean();
    
    if (userPoints.length === 0) {
      return res.json({
        success: true,
        data: {
          userId,
          totalPoints: 0,
          categories: [],
          badges: [],
          streak: 0
        }
      });
    }
    
    const totalPoints = userPoints.reduce((sum, doc) => sum + doc.points, 0);
    const allBadges = [...new Set(userPoints.flatMap(doc => doc.badges))];
    const maxStreak = Math.max(...userPoints.map(doc => doc.streak || 0));
    
    const categories = userPoints.map(doc => ({
      category: doc.careerCategory,
      points: doc.points,
      badges: doc.badges,
      weeklyPoints: doc.weeklyPoints,
      streak: doc.streak
    }));
    
    res.json({
      success: true,
      data: {
        userId,
        totalPoints,
        categories,
        badges: allBadges,
        streak: maxStreak,
        lastActivity: userPoints[0]?.lastActivity
      }
    });
  } catch (error) {
    console.error('[Points] User progress error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch user progress'
    });
  }
});

/**
 * GET /api/points/challenges
 * Get daily challenges
 */
router.get('/challenges', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get or create today's challenges
    let challenges = await DailyChallenge.find({
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      isActive: true
    }).lean();
    
    // If no challenges exist for today, create default ones
    if (challenges.length === 0) {
      const defaultChallenges = [
        {
          challengeId: 'watch_5_videos',
          title: 'Watch 5 Videos',
          description: 'Watch at least 5 career discovery videos today',
          category: 'General',
          pointsReward: 25,
          actionType: 'watch_videos',
          targetValue: 5,
          date: today
        },
        {
          challengeId: 'like_3_videos',
          title: 'Like 3 Videos',
          description: 'Show your appreciation by liking 3 videos',
          category: 'General',
          pointsReward: 15,
          actionType: 'like_videos',
          targetValue: 3,
          date: today
        },
        {
          challengeId: 'explore_category',
          title: 'Explore a Category',
          description: 'Watch videos from 3 different career categories',
          category: 'General',
          pointsReward: 30,
          actionType: 'explore_category',
          targetValue: 3,
          date: today
        },
        {
          challengeId: 'complete_quiz',
          title: 'Complete a Quiz',
          description: 'Test your knowledge by completing a career quiz',
          category: 'General',
          pointsReward: 20,
          actionType: 'complete_quiz',
          targetValue: 1,
          date: today
        },
        {
          challengeId: 'daily_streak',
          title: 'Maintain Your Streak',
          description: 'Come back tomorrow to keep your streak alive!',
          category: 'General',
          pointsReward: 10,
          actionType: 'daily_streak',
          targetValue: 1,
          date: today
        }
      ];
      
      await DailyChallenge.insertMany(defaultChallenges);
      challenges = await DailyChallenge.find({
        date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
        isActive: true
      }).lean();
    }
    
    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    console.error('[Points] Challenges error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch challenges'
    });
  }
});

/**
 * GET /api/points/challenges/user/:userId
 * Get user's challenge progress
 */
router.get('/challenges/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's challenges
    const challenges = await DailyChallenge.find({
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      isActive: true
    }).lean();
    
    // Get user's progress on challenges
    const userChallenges = await UserChallenge.find({
      userId,
      challengeId: { $in: challenges.map(c => c.challengeId) },
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    }).lean();
    
    const progressMap = {};
    userChallenges.forEach(uc => {
      progressMap[uc.challengeId] = uc;
    });
    
    const challengesWithProgress = challenges.map(challenge => ({
      ...challenge,
      progress: progressMap[challenge.challengeId]?.progress || 0,
      completed: progressMap[challenge.challengeId]?.completed || false
    }));
    
    res.json({
      success: true,
      data: challengesWithProgress
    });
  } catch (error) {
    console.error('[Points] User challenges error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch user challenges'
    });
  }
});

/**
 * POST /api/points/challenges/update
 * Update challenge progress
 */
router.post('/challenges/update', async (req, res) => {
  try {
    const { userId, challengeId, progress = 1 } = req.body;
    
    if (!userId || !challengeId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId and challengeId'
      });
    }
    
    const challenge = await DailyChallenge.findOne({ challengeId, isActive: true });
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let userChallenge = await UserChallenge.findOne({
      userId,
      challengeId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });
    
    if (!userChallenge) {
      userChallenge = await UserChallenge.create({
        userId,
        challengeId,
        progress: 0,
        targetValue: challenge.targetValue,
        date: today
      });
    }
    
    await userChallenge.updateProgress(progress);
    
    // If completed, award points
    if (userChallenge.completed && !userChallenge.completedAt) {
      const userPoints = await UserPoints.getOrCreate(userId, challenge.category || 'General');
      await userPoints.addPoints(challenge.pointsReward, 'challenge_completed');
    }
    
    res.json({
      success: true,
      data: {
        challengeId: userChallenge.challengeId,
        progress: userChallenge.progress,
        targetValue: userChallenge.targetValue,
        completed: userChallenge.completed
      }
    });
  } catch (error) {
    console.error('[Points] Update challenge error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update challenge'
    });
  }
});

/**
 * POST /api/points/seed
 * Seed leaderboard with sample data (for testing)
 */
router.post('/seed', async (req, res) => {
  try {
    // Clear existing seed data first
    await UserPoints.deleteMany({ userId: /^user_seed_/ });
    
    // 4 users matching the 4 avatars with diverse schools and regions
    const users = [
      {
        userId: 'user_seed_0',
        screenName: 'AlexTheCreator',
        school: 'North Atlanta High School',
        region: 'Atlanta High School Partnerships',
        categories: {
          'Music': 850,
          'Film & Television': 620,
          'Animation & Visual Effects': 450
        },
        badges: ['First Watch', 'Video Master', 'Career Champion', 'Streak King'],
        streak: 15,
        weeklyPoints: 420
      },
      {
        userId: 'user_seed_1',
        screenName: 'MusicMaven',
        school: 'DeKalb School of the Arts',
        region: 'Atlanta High School Partnerships',
        categories: {
          'Music': 920,
          'Business & Management': 380,
          'Writing & Journalism': 290
        },
        badges: ['First Watch', 'Video Master', 'Week Warrior'],
        streak: 12,
        weeklyPoints: 380
      },
      {
        userId: 'user_seed_2',
        screenName: 'FilmFanatic',
        school: 'Riverwood International Charter School',
        region: 'Atlanta High School Partnerships',
        categories: {
          'Film & Television': 780,
          'Animation & Visual Effects': 540,
          'Music': 320
        },
        badges: ['First Watch', 'Video Master', 'Category Explorer'],
        streak: 8,
        weeklyPoints: 310
      },
      {
        userId: 'user_seed_3',
        screenName: 'DesignDiva',
        school: 'Alpharetta High School',
        region: 'Metro Atlanta North',
        categories: {
          'Animation & Visual Effects': 670,
          'Film & Television': 490,
          'Business & Management': 280
        },
        badges: ['First Watch', 'Video Master'],
        streak: 6,
        weeklyPoints: 250
      }
    ];
    
    // Create users with their data
    for (const user of users) {
      for (const [category, points] of Object.entries(user.categories)) {
        const userPoints = await UserPoints.getOrCreate(user.userId, category);
        userPoints.screenName = user.screenName;
        userPoints.school = user.school;
        userPoints.region = user.region;
        userPoints.points = points;
        userPoints.badges = user.badges;
        userPoints.streak = user.streak;
        userPoints.weeklyPoints = user.weeklyPoints;
        await userPoints.save();
      }
    }
    
    res.json({
      success: true,
      message: `Seeded ${users.length} users with leaderboard data`
    });
  } catch (error) {
    console.error('[Points] Seed error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to seed data'
    });
  }
});

export default router;

