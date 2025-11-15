import { useState, useRef, useEffect } from 'react';
import { schoolRegions, getRegionNames } from '../data/schools';
import './RegionsDropdown.css';

const RegionsDropdown = ({ isOpen, onClose, onSelectRegion, onSelectSchool }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const regions = getRegionNames();

  // Filter regions based on search
  const filteredRegions = regions.filter(regionName => 
    regionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schoolRegions[regionName].schools.some(school => 
      school.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleRegionClick = (regionName) => {
    setSelectedRegion(regionName);
    if (onSelectRegion) {
      onSelectRegion(regionName);
    }
  };

  const handleSchoolClick = (schoolName) => {
    if (onSelectSchool) {
      onSelectSchool(schoolName, selectedRegion);
    }
  };

  const handleBack = () => {
    setSelectedRegion(null);
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="regions-dropdown-overlay" onClick={onClose}>
      <div className="regions-dropdown" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
        <div className="dropdown-header">
          <h2>{selectedRegion ? schoolRegions[selectedRegion].name : 'Select Region'}</h2>
          {selectedRegion && (
            <button className="back-button" onClick={handleBack}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              Back
            </button>
          )}
          <button className="close-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="dropdown-search">
          <input
            type="text"
            placeholder={selectedRegion ? "Search schools..." : "Search regions..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="dropdown-content">
          {!selectedRegion ? (
            // Show regions list
            <div className="regions-list">
              {filteredRegions.length > 0 ? (
                filteredRegions.map((regionName) => {
                  const region = schoolRegions[regionName];
                  return (
                    <div
                      key={regionName}
                      className="region-item"
                      onClick={() => handleRegionClick(regionName)}
                    >
                      <div className="region-info">
                        <h3>{region.name}</h3>
                        <p>{region.schools.length} schools</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="arrow-icon">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                      </svg>
                    </div>
                  );
                })
              ) : (
                <div className="no-results">
                  <p>No regions found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          ) : (
            // Show schools list for selected region
            <div className="schools-list">
              {(() => {
                const schools = schoolRegions[selectedRegion].schools;
                const filteredSchools = schools.filter(school =>
                  school.toLowerCase().includes(searchTerm.toLowerCase())
                );

                return filteredSchools.length > 0 ? (
                  filteredSchools.map((school, index) => (
                    <div
                      key={index}
                      className="school-item"
                      onClick={() => handleSchoolClick(school)}
                    >
                      <div className="school-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                        </svg>
                      </div>
                      <span>{school}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <p>No schools found matching "{searchTerm}"</p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionsDropdown;

