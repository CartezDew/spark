import { useState, useEffect, useRef, useCallback } from 'react';
import VideoCard from './VideoCard';
import { fetchYouthContent, fetchMoreYouthContent } from '../services/youthContentFetcher';
import { getPersonalizedFeed } from '../services/aiRecommendationEngine';
import { trackScroll, getPreferredCategory, resetCategoryPreference } from '../services/userBehaviorTracker';
import config from '../config/config';
import './VideoFeed.css';

const CAREER_CATEGORIES = [
  'Business & Management',
  'Animation & Visual Effects',
  'Writing & Journalism',
  'Music',
  'Sports',
  'Film & Television'
];

const VideoFeed = ({ region = 'US', category = 'trending', school = null }) => {
  const [videos, setVideos] = useState([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    loadVideos();

    // Auto-refresh videos based on config
    if (config.autoRefreshInterval > 0) {
      const intervalId = setInterval(loadVideos, config.autoRefreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [region, category, school]);

  const loadVideos = async () => {
    setLoading(true);
    setError(null);
    setNextPageToken(null);
    
    // Check if user has a preferred category (3+ consecutive watches)
    const preferredCategory = getPreferredCategory();
    
    // If no preference, randomly select starting category
    let selectedCategory;
    if (preferredCategory) {
      selectedCategory = preferredCategory;
      console.log(`[VideoFeed] User has preferred category: ${preferredCategory}`);
    } else {
      const randomIndex = Math.floor(Math.random() * CAREER_CATEGORIES.length);
      setCurrentCategoryIndex(randomIndex);
      selectedCategory = CAREER_CATEGORIES[randomIndex];
    }

    try {
      const location = school ? `${school} (${region})` : region;
      console.log(`Loading youth content for: ${location}, category: ${selectedCategory}`);
      
      if (config.apiMode === 'backend') {
        const result = await fetchMoreYouthContent(region, school, selectedCategory, null);
        if (result.videos && result.videos.length > 0) {
          setVideos(result.videos);
          setNextPageToken(result.nextPageToken);
          console.log(`Successfully loaded ${result.videos.length} videos from ${result.category}`);
        } else {
          setError('No videos found. Please check your configuration.');
        }
      } else {
        const fetchedVideos = await fetchYouthContent(region, school);
        if (fetchedVideos && fetchedVideos.length > 0) {
          const personalizedVideos = getPersonalizedFeed(fetchedVideos, config.maxVideosPerLoad);
          setVideos(personalizedVideos);
          console.log(`Successfully loaded ${personalizedVideos.length} personalized videos`);
        } else {
          setError('No videos found. Please check your configuration.');
        }
      }
    } catch (err) {
      console.error('Error loading videos:', err);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreVideos = useCallback(async () => {
    if (loadingMore) return;

    setLoadingMore(true);
    try {
      const preferredCategory = getPreferredCategory();
      let category = null;
      let pageToken = nextPageToken;
      
      // If user has preferred category (3+ consecutive watches)
      if (preferredCategory) {
        // 80% from preferred category, 20% random
        const shouldUsePreferred = Math.random() < 0.8;
        
        if (shouldUsePreferred && !pageToken) {
          // Use preferred category
          category = preferredCategory;
          pageToken = null;
          console.log(`[VideoFeed] Loading from preferred category: ${preferredCategory}`);
        } else if (!shouldUsePreferred || pageToken) {
          // 20% random or continue with page token
          if (pageToken) {
            category = preferredCategory; // Continue preferred category pagination
          } else {
            // Random other category
            const otherCategories = CAREER_CATEGORIES.filter(c => c !== preferredCategory);
            const randomIndex = Math.floor(Math.random() * otherCategories.length);
            category = otherCategories[randomIndex];
            console.log(`[VideoFeed] Mixing in random category: ${category}`);
          }
        }
      } else {
        // No preference: rotate through different categories (one per load)
        if (!pageToken) {
          // Get last category used to avoid repeats
          const lastCategory = videos.length > 0 ? videos[videos.length - 1]?.category : null;
          const availableCategories = CAREER_CATEGORIES.filter(c => c !== lastCategory);
          const randomIndex = Math.floor(Math.random() * availableCategories.length);
          category = availableCategories[randomIndex];
          setCurrentCategoryIndex(CAREER_CATEGORIES.indexOf(category));
          pageToken = null;
          console.log(`[VideoFeed] Rotating to different category: ${category}`);
        } else {
          // Continue with current category pagination
          category = CAREER_CATEGORIES[currentCategoryIndex];
        }
      }

      const result = await fetchMoreYouthContent(region, school, category, pageToken);
      
      if (result.videos && result.videos.length > 0) {
        setVideos(prev => [...prev, ...result.videos]);
        setNextPageToken(result.nextPageToken);
        console.log(`Loaded ${result.videos.length} more videos${result.category ? ` from ${result.category}` : ''}`);
      } else {
        // No more videos in this category
        if (preferredCategory && category === preferredCategory) {
          // Still prefer this category, just no more pages
          setNextPageToken(null);
        } else {
          // Move to next category
          const nextCategoryIndex = (currentCategoryIndex + 1) % CAREER_CATEGORIES.length;
          setCurrentCategoryIndex(nextCategoryIndex);
          setNextPageToken(null);
        }
      }
    } catch (err) {
      console.error('Error loading more videos:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, nextPageToken, currentCategoryIndex, region, school, videos]);

  // Infinite scroll: Load more when near bottom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const videoHeight = window.innerHeight;
      const currentIndex = Math.round(scrollTop / videoHeight);
      
      // Track scroll pattern
      if (videos[currentIndex]) {
        const direction = scrollTop > (container.lastScrollTop || 0) ? 'down' : 'up';
        trackScroll(direction, videos[currentIndex].id, Date.now());
      }
      container.lastScrollTop = scrollTop;
      
      setActiveVideoIndex(currentIndex);
      
      // Load more when 80% scrolled (or when near bottom)
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      if ((scrollPercentage > 0.8 || distanceFromBottom < 500) && !loadingMore && videos.length > 0) {
        loadMoreVideos();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [videos, loadingMore, loadMoreVideos]);

  if (loading) {
    return (
      <div className="video-feed-loading">
        <div className="loader"></div>
        <p>Discovering your career path...</p>
        <p className="loading-subtext">
          {config.apiMode === 'mock' 
            ? 'Loading career discovery content' 
            : `Fetching personalized content from ${config.apiMode}`}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-feed-error">
        <div className="error-icon">⚠️</div>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={loadVideos} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="video-feed-empty">
        <div className="empty-icon">📹</div>
        <h2>No videos available</h2>
        <p>Check back later for trending content</p>
      </div>
    );
  }

  return (
    <div className="video-feed" ref={containerRef}>
      {videos.map((video, index) => (
        <VideoCard 
          key={`${video.id}-${index}`}
          video={video} 
          isActive={index === activeVideoIndex}
        />
      ))}
      
      {loadingMore && (
        <div className="loading-more">
          <div className="loader-small"></div>
          <p>Loading more videos...</p>
        </div>
      )}
      
      {activeVideoIndex === 0 && videos.length > 0 && (
        <div className="scroll-indicator">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
          <span>Scroll for more</span>
        </div>
      )}

      <div className="video-counter">
        {activeVideoIndex + 1} / {videos.length}
      </div>
    </div>
  );
};

export default VideoFeed;
