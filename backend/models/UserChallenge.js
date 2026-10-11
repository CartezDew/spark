/**
 * User Challenge Progress Model
 * Tracks user progress on daily challenges
 */

import mongoose from 'mongoose';

const userChallengeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  challengeId: {
    type: String,
    required: true,
    index: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0
  },
  targetValue: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
userChallengeSchema.index({ userId: 1, challengeId: 1, date: 1 }, { unique: true });

// Method to update progress
userChallengeSchema.methods.updateProgress = async function(amount) {
  this.progress = Math.min(this.progress + amount, this.targetValue);
  
  if (this.progress >= this.targetValue && !this.completed) {
    this.completed = true;
    this.completedAt = new Date();
  }
  
  await this.save();
  return this;
};

const UserChallenge = mongoose.model('UserChallenge', userChallengeSchema);

export default UserChallenge;

