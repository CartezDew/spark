import { useState, useEffect } from 'react';
import { getCareerInsights } from '../services/aiRecommendationEngine';
import './CareerInsights.css';

const CareerInsights = () => {
  const [insights, setInsights] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateInsights = () => {
      const careerData = getCareerInsights();
      setInsights(careerData);
    };

    updateInsights();
    // Update every 30 seconds
    const interval = setInterval(updateInsights, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!insights) return null;

  return (
    <div className={`career-insights ${isExpanded ? 'expanded' : ''}`}>
      <button 
        className="insights-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="spark-icon">✨</span>
        <span className="insights-title">Your Career Discovery</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          className={`arrow ${isExpanded ? 'up' : 'down'}`}
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </button>

      {isExpanded && (
        <div className="insights-content">
          <p className="insights-message">{insights.message}</p>
          
          {insights.topCareer && (
            <div className="top-career">
              <h3>🎯 Top Interest</h3>
              <div className="career-card">
                <h4>{insights.topCareer.name}</h4>
                <p>{insights.topCareer.description}</p>
                <div className="interest-bar">
                  <div 
                    className="interest-fill" 
                    style={{ width: `${insights.topCareer.score}%` }}
                  />
                  <span className="interest-score">{insights.topCareer.score}%</span>
                </div>
              </div>
            </div>
          )}

          {insights.suggestions && insights.suggestions.length > 0 && (
            <div className="suggestions">
              <h3>💡 Also Exploring</h3>
              <div className="suggestions-list">
                {insights.suggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item">
                    <span className="suggestion-name">{suggestion.name}</span>
                    <div className="suggestion-bar">
                      <div 
                        className="suggestion-fill" 
                        style={{ width: `${suggestion.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="insights-footer">
            Keep watching videos to discover more career paths! 🚀
          </p>
        </div>
      )}
    </div>
  );
};

export default CareerInsights;

