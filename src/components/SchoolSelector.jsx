import { useState, useEffect } from 'react';
import { schoolRegions, getSchoolsByRegion, getRegionNames } from '../data/schools';
import { getSchool, setSchool, getRegion, setRegion, getScreenName, setScreenName } from '../services/pointsService';
import './SchoolSelector.css';

const SchoolSelector = ({ isOpen, onClose }) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [availableSchools, setAvailableSchools] = useState([]);
  const regions = getRegionNames();

  useEffect(() => {
    // Load current values
    const currentRegion = getRegion();
    const currentSchool = getSchool();
    const currentName = getScreenName();
    
    if (currentRegion) setSelectedRegion(currentRegion);
    if (currentSchool) setSelectedSchool(currentSchool);
    if (currentName) setDisplayName(currentName);
  }, [isOpen]);

  useEffect(() => {
    // Update available schools when region changes
    if (selectedRegion) {
      const schools = getSchoolsByRegion(selectedRegion);
      setAvailableSchools(schools);
      
      // Reset school selection if it's not in the new region
      if (selectedSchool && !schools.includes(selectedSchool)) {
        setSelectedSchool('');
      }
    } else {
      setAvailableSchools([]);
    }
  }, [selectedRegion]);

  const handleSave = () => {
    // Save to localStorage
    if (displayName) setScreenName(displayName);
    if (selectedRegion) setRegion(selectedRegion);
    if (selectedSchool) setSchool(selectedSchool);
    
    // Close the modal
    onClose();
    
    // Reload the page to reflect changes
    window.location.reload();
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="school-selector-overlay">
      <div className="school-selector-modal">
        <div className="modal-header">
          <h2>👋 Welcome to Spark!</h2>
          <p>Tell us a bit about yourself to see other students in your area</p>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="display-name">Display Name (optional)</label>
            <input
              id="display-name"
              type="text"
              placeholder="Enter your name or nickname"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="region-select">Select Your Region *</label>
            <select
              id="region-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="form-select"
            >
              <option value="">-- Select a Region --</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {selectedRegion && (
            <div className="form-group">
              <label htmlFor="school-select">Select Your School *</label>
              <select
                id="school-select"
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="form-select"
              >
                <option value="">-- Select a School --</option>
                {availableSchools.map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
            </div>
          )}

          <div className="info-box">
            <p>🔒 Your information is private and only used to show relevant leaderboards.</p>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn-secondary"
            onClick={handleSkip}
          >
            Skip for Now
          </button>
          <button 
            className="btn-primary"
            onClick={handleSave}
            disabled={!selectedRegion || !selectedSchool}
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolSelector;

