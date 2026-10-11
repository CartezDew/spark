import { useRef } from 'react';
import './InlineShorts.css';

const InlineShorts = ({ category = 'Music', position = 0 }) => {
  const scrollContainerRef = useRef(null);

  const generateShorts = (category) => {
    const careersByCategory = {
      'Business & Management': [
        'Talent Manager', 'Event Coordinator', 'Marketing Pro', 'Production Manager',
        'Business Developer', 'PR Specialist', 'Casting Director', 'Accountant',
        'Legal Advisor', 'Administrative Support'
      ],
      'Animation & Visual Effects': [
        '3D Animator', 'VFX Artist', 'Motion Designer', 'Graphic Designer',
        'Character Animator', 'Compositor', 'Rigging Artist', 'Concept Artist',
        'Storyboard Artist', 'Technical Director'
      ],
      'Writing & Journalism': [
        'Content Creator', 'Journalist', 'Script Writer', 'Entertainment Writer',
        'Publicist', 'Copywriter', 'Editor', 'Social Media Manager',
        'Blogger', 'Communications Director'
      ],
      'Music': [
        'Music Producer', 'Audio Engineer', 'Songwriter', 'Singer',
        'DJ', 'Music Director', 'Sound Designer', 'Mixing Engineer',
        'Mastering Engineer', 'Studio Manager'
      ],
      'Sports': [
        'Sports Broadcaster', 'Athletic Trainer', 'Sports Marketing', 'Game Day Operations',
        'Events Coordinator', 'Sound Engineer', 'Talent Scout', 'Merchandising Manager',
        'Digital Designer', 'Content Producer'
      ],
      'Film & Television': [
        'Director', 'Cinematographer', 'Video Editor', 'Actor',
        'Casting Director', 'Set Designer', 'Costume Designer', 'Makeup Artist',
        'Sound Engineer', 'Equipment Operator'
      ]
    };

    const careers = careersByCategory[category] || [
      'Creative Professional', 'Industry Expert', 'Talent Manager', 'Content Creator',
      'Media Specialist', 'Production Assistant', 'Coordinator', 'Designer',
      'Specialist', 'Manager'
    ];
    
    return careers.map((career, index) => ({
      id: `short-${category}-${position}-${index}`,
      title: `${index % 3 === 0 ? 'Day in the Life:' : index % 3 === 1 ? 'How to Become a' : 'Career Path:'} ${career}`,
      thumbnail: `https://picsum.photos/seed/short-${category}-${position}-${index}/300/500`,
      views: `${Math.floor(Math.random() * 900 + 100)}K`,
      duration: '0:' + (Math.floor(Math.random() * 50) + 10),
      category: category,
      career: career
    }));
  };

  const shorts = generateShorts(category);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 260; // Width of card + gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="inline-shorts">
      <div className="inline-shorts-header">
        <div className="shorts-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 8v8l6-4-6-4zm9-5H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
          </svg>
          <span>Shorts</span>
        </div>
        <h3>Quick Career Insights - {category}</h3>
        <p>Swipe to explore 10 different careers →</p>
      </div>

      <div className="inline-shorts-carousel">
        <button 
          className="shorts-scroll-btn left" 
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          ‹
        </button>

        <div className="inline-shorts-container" ref={scrollContainerRef}>
          {shorts.map((short) => (
            <div key={short.id} className="inline-short-card">
              <div className="inline-short-thumbnail">
                <img src={short.thumbnail} alt={short.title} loading="lazy" />
                <div className="inline-short-duration">{short.duration}</div>
                <div className="inline-short-overlay">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="inline-short-info">
                <h4>{short.title}</h4>
                <div className="inline-short-meta">
                  <span className="views">{short.views}</span>
                  <span className="career-tag">{short.career}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="shorts-scroll-btn right" 
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default InlineShorts;

