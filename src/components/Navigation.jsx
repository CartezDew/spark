import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';
import userAvatar from '../assets/headshots/Screenshot 2025-11-15 132509.png';

const Navigation = ({ onTabChange, onRegionChange, onSchoolChange }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('nationwide');

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // Map tabs to regions
    const regionMap = {
      'profile': 'US',
      'nationwide': 'US'
    };

    if (onTabChange) {
      onTabChange(tab);
    }

    if (onRegionChange) {
      onRegionChange(regionMap[tab] || 'US');
    }
  };


  return (
    <>
      <nav className="navigation">
        <div className="nav-content">
        <div className="nav-logo">
          <h1>Spark</h1>
          <span className="logo-badge">CAREER DISCOVERY</span>
        </div>
          
          <div className="nav-tabs">
            {location.pathname === '/leaderboard' && (
              <Link 
                to="/" 
                className="nav-tab"
                title="Return to video feed"
              >
                📺 Feed
              </Link>
            )}
          </div>

          <div className="nav-right">
            <Link 
              to="/leaderboard" 
              className={`nav-link ${location.pathname === '/leaderboard' ? 'active' : ''}`}
              title="View Leaderboard"
            >
              <span className="nav-link-icon">🏆</span>
              <span className="nav-link-text">Leaderboard</span>
            </Link>
            <div className="user-icon" title="User Profile">
              <img 
                src={userAvatar} 
                alt="User Profile"
                className="user-avatar-img"
              />
            </div>
          </div>
        </div>
      </nav>

    </>
  );
};

export default Navigation;
