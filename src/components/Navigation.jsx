import { useState } from 'react';
import RegionsDropdown from './RegionsDropdown';
import './Navigation.css';

const Navigation = ({ onTabChange, onRegionChange, onSchoolChange }) => {
  const [activeTab, setActiveTab] = useState('nationwide');
  const [showRegionsDropdown, setShowRegionsDropdown] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    if (tab === 'regions') {
      // Open regions dropdown when Regions tab is clicked
      setShowRegionsDropdown(true);
    } else {
      setShowRegionsDropdown(false);
    }

    // Map tabs to regions
    const regionMap = {
      'profile': 'US',
      'regions': selectedRegion || 'Atlanta High School Partnerships',
      'nationwide': 'US'
    };

    if (onTabChange) {
      onTabChange(tab);
    }

    if (onRegionChange && tab !== 'regions') {
      onRegionChange(regionMap[tab]);
    }
  };

  const handleRegionSelect = (regionName) => {
    setSelectedRegion(regionName);
    setActiveTab('regions');
    if (onRegionChange) {
      onRegionChange(regionName);
    }
  };

  const handleSchoolSelect = (schoolName, regionName) => {
    setSelectedSchool(schoolName);
    setShowRegionsDropdown(false);
    if (onSchoolChange) {
      onSchoolChange(schoolName, regionName);
    }
    if (onRegionChange) {
      onRegionChange(regionName);
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
            <button 
              className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleTabClick('profile')}
              title="View company profile and featured content"
            >
              Company Profile
            </button>
            <button 
              className={`nav-tab ${activeTab === 'regions' ? 'active' : ''}`}
              onClick={() => handleTabClick('regions')}
              title="Browse regional trending videos"
            >
              Regions
              {selectedRegion && (
                <span className="selected-indicator" title={selectedRegion}>
                  {selectedRegion.length > 15 ? selectedRegion.substring(0, 15) + '...' : selectedRegion}
                </span>
              )}
            </button>
            <button 
              className={`nav-tab ${activeTab === 'nationwide' ? 'active' : ''}`}
              onClick={() => handleTabClick('nationwide')}
              title="Watch nationwide trending videos"
            >
              Nationwide
            </button>
          </div>

          <div className="nav-user">
            <div className="user-icon" title="User Profile">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                width="28"
                height="28"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
          </div>
        </div>
      </nav>

      <RegionsDropdown
        isOpen={showRegionsDropdown}
        onClose={() => setShowRegionsDropdown(false)}
        onSelectRegion={handleRegionSelect}
        onSelectSchool={handleSchoolSelect}
      />
    </>
  );
};

export default Navigation;
