/**
 * AI Recommendation Engine
 * Curates personalized feed based on user behavior
 * "Every video you watch teaches the app what you vibe with"
 */

import { getUserInterests, getTopInterests, getEngagementScore, hasLiked } from './userBehaviorTracker';

/**
 * Score and rank videos based on user interests
 */
export const scoreVideosForUser = (videos) => {
  const userInterests = getUserInterests();
  const topInterests = getTopInterests(3);
  
  // If no interests yet, return videos as-is (cold start)
  if (userInterests.length === 0) {
    return videos.map(video => ({
      ...video,
      recommendationScore: 50, // Neutral score
      reason: 'New user - exploring all content'
    }));
  }
  
  // Score each video
  const scoredVideos = videos.map(video => {
    let score = 50; // Base score
    const reasons = [];
    
    // Match career category with user interests
    if (video.careerCategory) {
      const interestMatch = userInterests.find(i => i.category === video.careerCategory);
      if (interestMatch) {
        score += interestMatch.score * 0.5; // Interest score contributes
        reasons.push(`Matches your interest in ${formatCategoryName(video.careerCategory)}`);
      }
    }
    
    // Boost if user already liked similar content
    if (hasLiked(video.id)) {
      score += 30;
      reasons.push('You liked this before');
    }
    
    // Boost local artist content
    if (video.isLocalArtist) {
      score += 15;
      reasons.push('Local artist from your area');
    }
    
    // Boost based on engagement score
    const engagementScore = getEngagementScore(video.id);
    score += engagementScore * 0.3;
    
    // Boost career discovery content if user is exploring
    if (video.tags && video.tags.includes('career')) {
      const hasCareerInterest = topInterests.some(i => 
        i.category.includes('career') || i.category.includes('music') || i.category.includes('dance')
      );
      if (hasCareerInterest) {
        score += 20;
        reasons.push('Career discovery content');
      }
    }
    
    // Penalize skipped content
    if (video.wasSkipped) {
      score -= 40;
    }
    
    return {
      ...video,
      recommendationScore: Math.max(0, Math.min(100, score)),
      recommendationReason: reasons.length > 0 ? reasons[0] : 'Recommended for you'
    };
  });
  
  // Sort by recommendation score
  return scoredVideos.sort((a, b) => b.recommendationScore - a.recommendationScore);
};

/**
 * Get personalized feed based on interests
 */
export const getPersonalizedFeed = (videos, limit = 20) => {
  const scored = scoreVideosForUser(videos);
  
  // Mix: 60% top recommendations, 20% diverse content, 20% local artists
  const topRecommended = scored.slice(0, Math.floor(limit * 0.6));
  const diverse = getDiverseContent(scored, Math.floor(limit * 0.2));
  const localArtists = scored
    .filter(v => v.isLocalArtist)
    .slice(0, Math.floor(limit * 0.2));
  
  // Combine and deduplicate
  const combined = [...topRecommended, ...diverse, ...localArtists];
  const unique = Array.from(new Map(combined.map(v => [v.id, v])).values());
  
  return unique.slice(0, limit);
};

/**
 * Get diverse content to prevent filter bubbles
 */
const getDiverseContent = (videos, count) => {
  const categories = new Set();
  const diverse = [];
  
  for (const video of videos) {
    if (diverse.length >= count) break;
    
    const category = video.careerCategory || 'other';
    if (!categories.has(category)) {
      categories.add(category);
      diverse.push(video);
    }
  }
  
  return diverse;
};

/**
 * Get career discovery insights
 */
export const getCareerInsights = () => {
  const topInterests = getTopInterests(5);
  
  if (topInterests.length === 0) {
    return {
      message: "Keep watching videos to discover your interests!",
      topCareer: null,
      suggestions: []
    };
  }
  
  const topCareer = topInterests[0];
  
  return {
    message: `You're showing strong interest in ${formatCategoryName(topCareer.category)}!`,
    topCareer: {
      name: formatCategoryName(topCareer.category),
      score: topCareer.score,
      description: getCareerDescription(topCareer.category)
    },
    suggestions: topInterests.slice(1, 4).map(i => ({
      name: formatCategoryName(i.category),
      score: i.score
    }))
  };
};

/**
 * Format category name for display
 */
const formatCategoryName = (category) => {
  const names = {
    'music_production': 'Music Production',
    'dance': 'Dance & Choreography',
    'filmmaking': 'Filmmaking',
    'video_editing': 'Video Editing',
    'rap_music': 'Rap & Hip Hop',
    'creative_direction': 'Creative Direction',
    'production': 'Video Production',
    'music_business': 'Music Business',
    'creative_career': 'Creative Careers'
  };
  
  return names[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Get career description
 */
const getCareerDescription = (category) => {
  const descriptions = {
    'music_production': 'Create beats, produce tracks, and work in recording studios',
    'dance': 'Choreograph performances, teach dance, and perform professionally',
    'filmmaking': 'Direct music videos, films, and visual content',
    'video_editing': 'Edit videos, create visual effects, and post-production work',
    'rap_music': 'Write lyrics, perform, and build a music career',
    'creative_direction': 'Lead creative projects and design visual concepts',
    'production': 'Manage video shoots, coordinate teams, and produce content',
    'music_business': 'Manage artists, promote music, and work in the industry',
    'creative_career': 'Explore various creative industry opportunities'
  };
  
  return descriptions[category] || 'A creative career path worth exploring';
};

/**
 * Predict next interest based on patterns
 */
export const predictNextInterest = () => {
  const topInterests = getTopInterests(3);
  
  if (topInterests.length < 2) {
    return null;
  }
  
  // Simple pattern: if user likes music production and dance, might like choreography
  const patterns = {
    'music_production': ['video_editing', 'music_business'],
    'dance': ['choreography', 'filmmaking'],
    'rap_music': ['music_production', 'music_business'],
    'filmmaking': ['video_editing', 'creative_direction']
  };
  
  const topCategory = topInterests[0].category;
  const suggestions = patterns[topCategory] || [];
  
  return suggestions[0] ? formatCategoryName(suggestions[0]) : null;
};

export default {
  scoreVideosForUser,
  getPersonalizedFeed,
  getCareerInsights,
  predictNextInterest
};

