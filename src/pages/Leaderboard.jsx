import { useState, useEffect } from 'react';
import { getLeaderboard, getUserProgress, getDailyChallenges, getUserChallenges, seedLeaderboard, getRegion, getSchool } from '../services/pointsService';
import { getRegionNames } from '../data/schools';
import SchoolSelector from '../components/SchoolSelector';
import './Leaderboard.css';

// Import avatar images
import avatar1 from '../assets/headshots/Screenshot 2025-11-15 132509.png';
import avatar2 from '../assets/headshots/thumbnail_Screenshot 2025-11-15 132458.png';
import avatar3 from '../assets/headshots/thumbnail_Screenshot 2025-11-15 132531.png';
import avatar4 from '../assets/headshots/thumbnail_Screenshot 2025-11-15 132603.png';

const AVATARS = [avatar1, avatar2, avatar3, avatar4];

const CAREER_CATEGORIES = [
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
];

const CATEGORY_COLORS = {
  'Acting': '#FFD700', // Yellow
  'Directing': '#9B59B6', // Purple
  'Gaming': '#00FF00', // Neon Green
  'Animation & Visual Effects': '#1ABC9C', // Turquoise
  'Music': '#FF8C00', // Orange
  'Fashion': '#FF69B4', // Pink
  'Business & Management': '#3498DB', // Blue
  'Writing & Journalism': '#E74C3C', // Red
  'Sports': '#2ECC71', // Green
  'Film & Television': '#F39C12' // Gold
};

const BADGE_ICONS = {
  'First Watch': '🎬',
  'Video Master': '🎥',
  'Category Explorer': '🗺️',
  'Week Warrior': '⚔️',
  'Streak King': '🔥',
  'Career Champion': '🏆',
  'Knowledge Seeker': '📚',
  'Engagement Pro': '💬'
};

// Helper function to get avatar for a user
const getUserAvatar = (userId, index) => {
  // Map specific users to specific avatars
  const userAvatarMap = {
    'user_seed_0': avatar1,  // AlexTheCreator - #1 (1,920 XP)
    'user_seed_2': avatar3,  // FilmFanatic - #2 (1,640 XP)
    'user_seed_1': avatar2,  // MusicMaven - #3 (1,590 XP)
    'user_seed_3': avatar4   // DesignDiva - #4 (1,440 XP)
  };
  
  // Return mapped avatar or cycle through based on index
  if (userAvatarMap[userId]) {
    return userAvatarMap[userId];
  }
  
  const avatarIndex = index % AVATARS.length;
  return AVATARS[avatarIndex];
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [categoryLeaderboard, setCategoryLeaderboard] = useState({});
  const [userProgress, setUserProgress] = useState(null);
  const [badgeStats, setBadgeStats] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('nationwide'); // 'nationwide', 'regional', or 'your-progress'
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [seeding, setSeeding] = useState(false);
  const [availableRegions] = useState(getRegionNames());
  const [showSchoolSelector, setShowSchoolSelector] = useState(false);
  const [hasSchool, setHasSchool] = useState(false);

  useEffect(() => {
    // Auto-select user's region for regional view
    if (viewMode === 'regional' && !selectedRegion) {
      const userRegion = getRegion();
      if (userRegion) {
        setSelectedRegion(userRegion);
      } else {
        // Default to first region if user hasn't selected one
        setSelectedRegion(availableRegions[0]);
      }
    }
    loadLeaderboard();
    loadUserProgress();
    loadChallenges();
  }, [selectedCategory, viewMode, selectedRegion]);

  useEffect(() => {
    loadChallenges();
    
    // Check if user has set their school
    const userSchool = getSchool();
    const userRegion = getRegion();
    setHasSchool(Boolean(userSchool && userRegion));
    
    // Auto-show school selector if not set (only once per session)
    if (!userSchool && !sessionStorage.getItem('school_selector_shown')) {
      setShowSchoolSelector(true);
      sessionStorage.setItem('school_selector_shown', 'true');
    }
  }, []);

  // Auto-seed if no data on initial load
  useEffect(() => {
    const autoSeed = async () => {
      if (!loading && leaderboard.length === 0 && viewMode === 'nationwide') {
        console.log('No leaderboard data found, auto-seeding...');
        const success = await seedLeaderboard();
        if (success) {
          loadLeaderboard();
        }
      }
    };
    autoSeed();
  }, [loading, leaderboard.length, viewMode]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      // Determine type and filters based on view mode
      let type = 'global';
      let region = null;
      
      if (viewMode === 'regional' && selectedRegion) {
        type = 'regional';
        region = selectedRegion;
      } else if (selectedCategory) {
        type = 'category';
      }
      
      const data = await getLeaderboard(
        selectedCategory,
        type,
        50,
        region,
        null // school filter - could be added later
      );
      
      if (data) {
        if (viewMode === 'category' && selectedCategory) {
          setCategoryLeaderboard({ [selectedCategory]: data.leaderboard });
        } else {
          setLeaderboard(data.leaderboard || []);
        }
        setBadgeStats(data.badgeStats || []);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const progress = await getUserProgress();
      if (progress) {
        setUserProgress(progress);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const loadChallenges = async () => {
    try {
      const [challengesData, userChallengesData] = await Promise.all([
        getDailyChallenges(),
        getUserChallenges()
      ]);
      setChallenges(challengesData);
      setUserChallenges(userChallengesData);
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const handleSeedLeaderboard = async () => {
    setSeeding(true);
    try {
      const success = await seedLeaderboard();
      if (success) {
        alert('Leaderboard seeded successfully! Refresh to see the data.');
        loadLeaderboard();
      }
    } catch (error) {
      console.error('Error seeding leaderboard:', error);
      alert('Error seeding leaderboard. Check console for details.');
    } finally {
      setSeeding(false);
    }
  };

  const getCategoryColor = (category) => {
    return CATEGORY_COLORS[category] || '#667eea';
  };

  const formatPoints = (points) => {
    if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`;
    }
    return points.toString();
  };

  const getTopCategory = (user) => {
    if (user.categoryPoints && user.categoryPoints.length > 0) {
      const top = user.categoryPoints.reduce((max, cat) => 
        cat.points > max.points ? cat : max
      );
      return top.category;
    }
    return user.topCategory || 'N/A';
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-loading">
          <div className="loader"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <SchoolSelector 
        isOpen={showSchoolSelector} 
        onClose={() => setShowSchoolSelector(false)} 
      />
      
      <div className="leaderboard-header">
        <div className="header-content">
          <h1>🏆 Leaderboard</h1>
          <p>See who's leading the career discovery journey!</p>
        </div>
        {!hasSchool && (
          <button 
            className="set-school-btn"
            onClick={() => setShowSchoolSelector(true)}
          >
            🏫 Set Your School
          </button>
        )}
        {hasSchool && (
          <button 
            className="change-school-btn"
            onClick={() => setShowSchoolSelector(true)}
          >
            ⚙️ Change School
          </button>
        )}
      </div>

      {/* User Progress Card */}
      {userProgress && (
        <div className="user-progress-card">
          <h2>Your Progress</h2>
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-label">Total XP</span>
              <span className="stat-value">{formatPoints(userProgress.totalPoints)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Streak</span>
              <span className="stat-value">🔥 {userProgress.streak} days</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Badges</span>
              <span className="stat-value">{userProgress.badges.length}</span>
            </div>
          </div>
          
          {userProgress.badges.length > 0 && (
            <div className="user-badges">
              <h3>Your Badges</h3>
              <div className="badges-list">
                {userProgress.badges.map((badge, idx) => (
                  <div key={idx} className="badge-item">
                    <span className="badge-icon">{BADGE_ICONS[badge] || '🏅'}</span>
                    <span className="badge-name">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Progress Bars */}
          {userProgress.categories && userProgress.categories.length > 0 && (
            <div className="category-progress">
              <h3>Your Career Path Progress</h3>
              {userProgress.categories.map((cat, idx) => (
                <div key={idx} className="progress-item">
                  <div className="progress-header">
                    <span className="progress-category" style={{ color: getCategoryColor(cat.category) }}>
                      {cat.category}
                    </span>
                    <span className="progress-points">{formatPoints(cat.points)} XP</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar"
                      style={{
                        width: `${Math.min((cat.points / 1000) * 100, 100)}%`,
                        backgroundColor: getCategoryColor(cat.category)
                      }}
                    />
                  </div>
                  {cat.badges && cat.badges.length > 0 && (
                    <div className="category-badges">
                      {cat.badges.map((badge, bIdx) => (
                        <span key={bIdx} className="mini-badge">
                          {BADGE_ICONS[badge] || '🏅'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button
          className={viewMode === 'nationwide' ? 'active' : ''}
          onClick={() => {
            setViewMode('nationwide');
            setSelectedCategory(null);
          }}
        >
          🌍 Nationwide
        </button>
        <button
          className={viewMode === 'regional' ? 'active' : ''}
          onClick={() => setViewMode('regional')}
        >
          🗺️ Regional
        </button>
        <button
          className={viewMode === 'your-progress' ? 'active' : ''}
          onClick={() => setViewMode('your-progress')}
        >
          👤 Your Progress
        </button>
      </div>

      {/* Nationwide Leaderboard */}
      {viewMode === 'nationwide' && (
        <div className="leaderboard-section">
          <h2>🌍 Nationwide Leaderboard</h2>
          <div className="leaderboard-table">
            <div className="leaderboard-header-row">
              <span>User</span>
              <span>Total XP</span>
              <span>Top Category</span>
              <span>Badges</span>
              <span>Streak</span>
            </div>
            {leaderboard.length === 0 ? (
              <div className="empty-state">
                <p>No leaderboard data yet. Start watching videos to earn XP!</p>
              </div>
            ) : (
              leaderboard.map((user, index) => (
                <div key={user.userId} className="leaderboard-row">
                  <span className="user-info">
                    <span className="rank-badge">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${user.rank}`}
                    </span>
                    <img 
                      src={getUserAvatar(user.userId, index)} 
                      alt={user.screenName || 'User avatar'} 
                      className="user-avatar"
                    />
                    <span className="user-name">{user.screenName || user.userId.substring(0, 12)}</span>
                  </span>
                  <span className="points">{formatPoints(user.totalPoints)}</span>
                  <span className="category" style={{ color: getCategoryColor(user.topCategory) }}>
                    {user.topCategory || 'N/A'}
                  </span>
                  <span className="badges">
                    {user.badges && user.badges.length > 0 ? (
                      <div className="badges-preview">
                        {user.badges.slice(0, 3).map((badge, idx) => (
                          <span key={idx} title={badge}>
                            {BADGE_ICONS[badge] || '🏅'}
                          </span>
                        ))}
                        {user.badges.length > 3 && (
                          <span className="more-badges">+{user.badges.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      '-'
                    )}
                  </span>
                  <span className="streak">🔥 {user.streak || 0}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Regional Leaderboard */}
      {viewMode === 'regional' && (
        <div className="leaderboard-section">
          <div className="regional-header">
            <h2>🗺️ Regional Leaderboard</h2>
            <div className="region-selector">
              <label htmlFor="region-select">Select Region: </label>
              <select 
                id="region-select"
                value={selectedRegion || ''}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="region-dropdown"
              >
                {availableRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="leaderboard-table">
            <div className="leaderboard-header-row">
              <span>User</span>
              <span>School</span>
              <span>Total XP</span>
              <span>Top Category</span>
              <span>Badges</span>
            </div>
            {leaderboard.length === 0 ? (
              <div className="empty-state">
                <p>No students from this region yet. Be the first to earn points!</p>
              </div>
            ) : (
              leaderboard.map((user, index) => (
                <div key={user.userId} className="leaderboard-row">
                  <span className="user-info">
                    <span className="rank-badge">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${user.rank}`}
                    </span>
                    <img 
                      src={getUserAvatar(user.userId, index)} 
                      alt={user.screenName || 'User avatar'} 
                      className="user-avatar"
                    />
                    <span className="user-name">{user.screenName || user.userId.substring(0, 12)}</span>
                  </span>
                  <span className="school-name">{user.school || 'Not Set'}</span>
                  <span className="points">{formatPoints(user.totalPoints)}</span>
                  <span className="category" style={{ color: getCategoryColor(user.topCategory) }}>
                    {user.topCategory || 'N/A'}
                  </span>
                  <span className="badges">
                    {user.badges && user.badges.length > 0 ? (
                      <div className="badges-preview">
                        {user.badges.slice(0, 3).map((badge, idx) => (
                          <span key={idx} title={badge}>
                            {BADGE_ICONS[badge] || '🏅'}
                          </span>
                        ))}
                        {user.badges.length > 3 && (
                          <span className="more-badges">+{user.badges.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      '-'
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Category Leaderboard */}
      {viewMode === 'category' && selectedCategory && categoryLeaderboard[selectedCategory] && (
        <div className="leaderboard-section">
          <h2 style={{ color: getCategoryColor(selectedCategory) }}>
            📂 {selectedCategory} Leaderboard
          </h2>
          <div className="leaderboard-table">
            <div className="leaderboard-header-row">
              <span>User</span>
              <span>XP</span>
              <span>Badges</span>
              <span>Streak</span>
            </div>
            {categoryLeaderboard[selectedCategory].length === 0 ? (
              <div className="empty-state">
                <p>No one has earned points in this category yet!</p>
              </div>
            ) : (
              categoryLeaderboard[selectedCategory].map((user, index) => (
                <div key={user.userId} className="leaderboard-row">
                  <span className="user-info">
                    <span className="rank-badge">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${user.rank}`}
                    </span>
                    <img 
                      src={getUserAvatar(user.userId, index)} 
                      alt={user.screenName || 'User avatar'} 
                      className="user-avatar"
                    />
                    <span className="user-name">{user.screenName || user.userId.substring(0, 12)}</span>
                  </span>
                  <span className="points">{formatPoints(user.points)}</span>
                  <span className="badges">
                    {user.badges && user.badges.length > 0 ? (
                      <div className="badges-preview">
                        {user.badges.slice(0, 3).map((badge, idx) => (
                          <span key={idx} title={badge}>
                            {BADGE_ICONS[badge] || '🏅'}
                          </span>
                        ))}
                      </div>
                    ) : (
                      '-'
                    )}
                  </span>
                  <span className="streak">🔥 {user.streak || 0}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Badge Statistics */}
      {badgeStats.length > 0 && (
        <div className="badge-stats-section">
          <h2>🏅 Badge Statistics</h2>
          <div className="badge-stats-grid">
            {badgeStats.map((stat, idx) => (
              <div key={idx} className="badge-stat-item">
                <span className="badge-icon-large">{BADGE_ICONS[stat.badge] || '🏅'}</span>
                <span className="badge-name">{stat.badge}</span>
                <span className="badge-count">{stat.count} earned</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Challenges */}
      <div className="daily-challenges-section">
        <h2>🎯 Daily Challenges</h2>
        <p className="challenges-subtitle">Complete these challenges to earn bonus XP!</p>
        <div className="challenges-grid">
          {challenges.length === 0 ? (
            <div className="empty-state">
              <p>No challenges available today. Check back tomorrow!</p>
            </div>
          ) : (
            challenges.map((challenge, idx) => {
              const userChallenge = userChallenges.find(uc => uc.challengeId === challenge.challengeId);
              const progress = userChallenge?.progress || 0;
              const completed = userChallenge?.completed || false;
              const progressPercent = Math.min((progress / challenge.targetValue) * 100, 100);
              
              return (
                <div key={challenge.challengeId || idx} className={`challenge-card ${completed ? 'completed' : ''}`}>
                  <div className="challenge-header">
                    <h3>{challenge.title}</h3>
                    {completed && <span className="completed-badge">✓ Completed</span>}
                  </div>
                  <p className="challenge-description">{challenge.description}</p>
                  <div className="challenge-progress-info">
                    <span className="challenge-progress-text">
                      {progress} / {challenge.targetValue}
                    </span>
                    <span className="challenge-reward">+{challenge.pointsReward} XP</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar challenge-progress-bar"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: completed ? '#2ECC71' : '#667eea'
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Weekly Challenge Placeholder */}
      <div className="weekly-challenge">
        <h2>⚔️ Weekly Challenge</h2>
        <div className="challenge-placeholder">
          <p>🎯 Earn 500 XP this week to unlock the "Week Warrior" badge!</p>
          <div className="challenge-progress">
            <div className="progress-bar-container">
              <div 
                className="progress-bar challenge-bar"
                style={{
                  width: `${userProgress ? Math.min((userProgress.weeklyPoints / 500) * 100, 100) : 0}%`,
                  backgroundColor: '#FF6B6B'
                }}
              />
            </div>
            <span className="challenge-text">
              {userProgress ? `${userProgress.weeklyPoints} / 500 XP` : '0 / 500 XP'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Leaderboard;

