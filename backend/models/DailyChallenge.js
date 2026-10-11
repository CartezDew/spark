/**
 * Daily Challenge Model
 * Tracks daily challenges that users can complete
 */

import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema({
  challengeId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
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
      'Fashion',
      'General'
    ],
    default: 'General'
  },
  pointsReward: {
    type: Number,
    default: 20,
    min: 0
  },
  actionType: {
    type: String,
    enum: ['watch_videos', 'like_videos', 'explore_category', 'complete_quiz', 'daily_streak'],
    required: true
  },
  targetValue: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for efficient daily challenge queries
dailyChallengeSchema.index({ date: 1, isActive: 1 });

const DailyChallenge = mongoose.model('DailyChallenge', dailyChallengeSchema);

export default DailyChallenge;

