import { useEffect, useRef, useState } from 'react';
import { 
  trackWatchTime, 
  trackLike, 
  trackUnlike, 
  trackReplay,
  trackReaction,
  hasLiked,
  getReplayCount
} from '../services/userBehaviorTracker';
import './VideoCard.css';

const VideoCard = ({ video, isActive }) => {
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [watchStartTime, setWatchStartTime] = useState(null);
  const [replayCount, setReplayCount] = useState(0);

  // Initialize liked state
  useEffect(() => {
    setLiked(hasLiked(video.id));
    setReplayCount(getReplayCount(video.id));
  }, [video.id]);

  // Track watch time with category
  useEffect(() => {
    if (isActive && !watchStartTime) {
      setWatchStartTime(Date.now());
    } else if (!isActive && watchStartTime) {
      const watchDuration = Date.now() - watchStartTime;
      // Track with category for category preference detection
      const category = video.category || video.careerCategory || null;
      trackWatchTime(video.id, watchDuration, 180000, category); // Assume 3 min average video
      setWatchStartTime(null);
    }
  }, [isActive, video.id, video.category, video.careerCategory, watchStartTime]);

  // Auto-play when video becomes active in viewport
  useEffect(() => {
    if (isActive && !isPlaying) {
      setIsPlaying(true);
    } else if (!isActive && isPlaying) {
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=${isActive ? 1 : 0}&mute=0&controls=1&modestbranding=1&rel=0`;
  };

  const handleLike = () => {
    if (liked) {
      trackUnlike(video.id, video.careerCategory);
      setLiked(false);
    } else {
      trackLike(video.id, video.careerCategory);
      setLiked(true);
    }
  };

  const handleReplay = () => {
    trackReplay(video.id, video.careerCategory);
    setReplayCount(prev => prev + 1);
  };

  const handleReaction = (reactionType) => {
    trackReaction(video.id, reactionType, video.careerCategory);
  };

  return (
    <div className="video-card">
      <div className="video-container">
        <iframe
          ref={iframeRef}
          src={getYouTubeEmbedUrl(video.id)}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="video-iframe"
        />
      </div>
      
      <div className="video-info">
        <div className="video-details">
          <h3 className="video-title">{video.title}</h3>
          <p className="video-channel">{video.channel}</p>
          <p className="video-description">{video.description}</p>
        </div>
        
        <div className="video-actions">
          <button 
            className={`action-btn like-btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            title="Like this video"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>{video.likes || '0'}</span>
          </button>
          
          <button 
            className="action-btn replay-btn"
            onClick={handleReplay}
            title="Replay video"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
            <span>{replayCount > 0 ? replayCount : 'Replay'}</span>
          </button>
          
          <button 
            className="action-btn reaction-btn"
            onClick={() => handleReaction('inspired')}
            title="This inspires me!"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Inspired</span>
          </button>
          
          <button className="action-btn share-btn" title="Share video">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
            </svg>
            <span>Share</span>
          </button>
        </div>
        
        {video.recommendationReason && (
          <div className="recommendation-badge">
            <span className="spark-icon">✨</span>
            <span>{video.recommendationReason}</span>
          </div>
        )}
        
        {video.isLocalArtist && (
          <div className="local-artist-badge">
            <span>🎵</span>
            <span>Local Artist</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;

