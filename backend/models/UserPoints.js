/**
 * UserPoints Model
 * Tracks user XP, badges, and progress across career categories
 */

import mongoose from 'mongoose';

const userPointsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  screenName: {
    type: String,
    default: function() {
      // Generate a default screen name if not provided
      return `User${Math.random().toString(36).substr(2, 6)}`;
    }
  },
  school: {
    type: String,
    default: null
  },
  region: {
    type: String,
    default: null
  },
  careerCategory: {
    type: String,
    required: true,
    enum: [
      'Business & Management',
      'Animation & Visual Effects',
      'Writing & Journalism',
      'Music',
      'Sports',
      'Film & Television',
      'Acting',
      'Directing',
      'Gaming',
      'Fashion'
    ],
    index: true
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  badges: [{
    type: String,
    enum: [
      'First Watch',
      'Video Master',
      'Category Explorer',
      'Week Warrior',
      'Streak King',
      'Career Champion',
      'Knowledge Seeker',
      'Engagement Pro'
    ]
  }],
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  weeklyPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  weeklyResetDate: {
    type: Date,
    default: Date.now
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastStreakDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
userPointsSchema.index({ userId: 1, careerCategory: 1 }, { unique: true });

// Auto-calculate totalPoints before saving
userPointsSchema.pre('save', async function() {
  if (this.isModified('points')) {
    const allUserPoints = await mongoose.model('UserPoints').find({ userId: this.userId });
    this.totalPoints = allUserPoints.reduce((sum, doc) => {
      return sum + (doc._id.toString() === this._id.toString() ? this.points : doc.points);
    }, 0);
  }
});

// Static method to get or create user points
userPointsSchema.statics.getOrCreate = async function(userId, careerCategory) {
  let userPoints = await this.findOne({ userId, careerCategory });
  
  if (!userPoints) {
    userPoints = await this.create({
      userId,
      careerCategory,
      points: 0,
      badges: [],
      totalPoints: 0
    });
  }
  
  return userPoints;
};

// Method to add points and check for badges
userPointsSchema.methods.addPoints = async function(amount, reason = '') {
  this.points += amount;
  this.totalPoints += amount;
  this.weeklyPoints += amount;
  this.lastActivity = new Date();
  
  // Check for badge achievements
  await this.checkBadges();
  
  await this.save();
  
  // Update total points across all categories
  await this.constructor.updateTotalPoints(this.userId);
  
  return this;
};

// Check and award badges
userPointsSchema.methods.checkBadges = async function() {
  const badgesToAdd = [];
  
  // First Watch badge
  if (this.points >= 10 && !this.badges.includes('First Watch')) {
    badgesToAdd.push('First Watch');
  }
  
  // Video Master badge (100 points in category)
  if (this.points >= 100 && !this.badges.includes('Video Master')) {
    badgesToAdd.push('Video Master');
  }
  
  // Category Explorer (50 points in 3+ categories)
  const categoryCount = await this.constructor.distinct('careerCategory', { 
    userId: this.userId, 
    points: { $gte: 50 } 
  });
  if (categoryCount.length >= 3 && !this.badges.includes('Category Explorer')) {
    badgesToAdd.push('Category Explorer');
  }
  
  // Week Warrior (500 weekly points)
  if (this.weeklyPoints >= 500 && !this.badges.includes('Week Warrior')) {
    badgesToAdd.push('Week Warrior');
  }
  
  // Career Champion (1000 points in one category)
  if (this.points >= 1000 && !this.badges.includes('Career Champion')) {
    badgesToAdd.push('Career Champion');
  }
  
  if (badgesToAdd.length > 0) {
    this.badges.push(...badgesToAdd);
    await this.save();
  }
  
  return badgesToAdd;
};

// Static method to update total points
userPointsSchema.statics.updateTotalPoints = async function(userId) {
  const allPoints = await this.find({ userId });
  const total = allPoints.reduce((sum, doc) => sum + doc.points, 0);
  
  // Update all documents with the same total
  await this.updateMany({ userId }, { totalPoints: total });
  
  return total;
};

// Reset weekly points if needed
userPointsSchema.methods.checkWeeklyReset = async function() {
  const now = new Date();
  const daysSinceReset = Math.floor((now - this.weeklyResetDate) / (1000 * 60 * 60 * 24));
  
  if (daysSinceReset >= 7) {
    this.weeklyPoints = 0;
    this.weeklyResetDate = now;
    await this.save();
  }
};

// Update streak
userPointsSchema.methods.updateStreak = async function() {
  const now = new Date();
  const lastDate = new Date(this.lastStreakDate);
  const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Consecutive day
    this.streak += 1;
    this.lastStreakDate = now;
  } else if (daysDiff > 1) {
    // Streak broken
    this.streak = 1;
    this.lastStreakDate = now;
  }
  // If daysDiff === 0, same day, don't update
  
  await this.save();
};

const UserPoints = mongoose.model('UserPoints', userPointsSchema);

export default UserPoints;

