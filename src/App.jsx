import { useState } from 'react';
import Navigation from './components/Navigation';
import VideoFeed from './components/VideoFeed';
import CareerInsights from './components/CareerInsights';
import './App.css';

function App() {
  const [currentRegion, setCurrentRegion] = useState('US');
  const [currentTab, setCurrentTab] = useState('nationwide');
  const [selectedSchool, setSelectedSchool] = useState(null);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    console.log('Tab changed to:', tab);
  };

  const handleRegionChange = (region) => {
    setCurrentRegion(region);
    console.log('Region changed to:', region);
  };

  const handleSchoolChange = (schoolName, regionName) => {
    setSelectedSchool(schoolName);
    setCurrentRegion(regionName);
    console.log('School selected:', schoolName, 'in region:', regionName);
  };

  return (
    <div className="app">
      <Navigation 
        onTabChange={handleTabChange}
        onRegionChange={handleRegionChange}
        onSchoolChange={handleSchoolChange}
      />
      <VideoFeed 
        region={currentRegion}
        category="trending"
        school={selectedSchool}
      />
      <CareerInsights />
    </div>
  );
}

export default App;
