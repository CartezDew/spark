# Spark - TikTok-Style Video Feed App

A modern, TikTok-inspired video feed application that displays YouTube videos in a vertical scrolling format. Built with React and Vite.

![Spark App](https://img.shields.io/badge/React-19.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-7.2.2-purple)

## Features

- 🎥 **Vertical Video Scrolling** - Smooth, TikTok-style vertical video feed with snap scrolling
- 🧭 **Navigation Bar** - Top navigation with Company Profile, Regions, and Nationwide tabs
- 👤 **User Profile Icon** - Easy access to user profile
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Beautiful gradient designs and smooth animations
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and production builds
- 🔄 **YouTube Integration Ready** - Infrastructure for YouTube video scraping/API integration

## Project Structure

```
Spark/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx       # Top navigation bar component
│   │   ├── Navigation.css
│   │   ├── VideoFeed.jsx        # Main video feed container
│   │   ├── VideoFeed.css
│   │   ├── VideoCard.jsx        # Individual video card component
│   │   └── VideoCard.css
│   ├── utils/
│   │   └── youtubeService.js    # YouTube API/scraper service
│   ├── App.jsx                  # Main app component
│   ├── App.css
│   ├── index.css                # Global styles
│   └── main.jsx                 # App entry point
├── public/
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd /Users/cartezdewberry/Spark
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit the URL shown in the terminal (typically `http://localhost:5173`)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## YouTube Integration

### Current Implementation

The app currently uses **mock data** for demonstration purposes. The videos displayed are sample YouTube video IDs embedded via iframes.

### Setting Up Real YouTube Integration

To integrate real YouTube videos, you have two options:

#### Option 1: YouTube Data API v3 (Recommended)

1. **Get an API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable YouTube Data API v3
   - Create credentials (API key)

2. **Update the Service:**
   - Open `src/utils/youtubeService.js`
   - Replace `YOUR_YOUTUBE_API_KEY_HERE` with your actual API key
   - Uncomment the production implementation code
   - Remove or comment out the mock data functions

3. **Set Up Backend (Recommended for Security):**
   - Create a Node.js/Express backend server
   - Store API key in environment variables
   - Proxy YouTube API requests through your backend
   - Implement rate limiting and caching

#### Option 2: Alternative APIs

Consider these alternatives:
- **Invidious API** - Privacy-focused YouTube frontend with API
- **YouTube RSS Feeds** - Limited data but no API key required
- **Third-party APIs** - Services that provide YouTube data

### Important Notes

⚠️ **Web Scraping Warning**: Direct web scraping of YouTube violates their Terms of Service. Always use the official API or authorized methods.

⚠️ **API Limits**: YouTube Data API has daily quota limits. Implement caching and rate limiting.

⚠️ **CORS Issues**: You'll need a backend server to avoid CORS issues when making API requests from the browser.

## Features Explained

### Navigation Component

The top navigation bar includes:
- **Company Logo** - "Spark" branding
- **Three Tabs**:
  - Company Profile - View company information
  - Regions - Browse region-specific content
  - Nationwide - Explore nationwide content
- **User Icon** - Access user profile and settings

### Video Feed

- **Vertical Scrolling** - Scroll down to see more videos
- **Snap Behavior** - Videos snap to center for better viewing
- **Auto-play** - Videos play automatically when in view (can be configured)
- **Loading State** - Elegant loading animation while fetching videos

### Video Cards

Each video card features:
- **Embedded YouTube Player** - Full video playback
- **Video Information** - Title, channel name, description
- **Engagement Buttons**:
  - Like button with count
  - Comment button with count
  - Share button
- **Responsive Design** - Adapts to different screen sizes

## Customization

### Changing Colors

Edit the gradient colors in the CSS files:

**Navigation Bar** (`Navigation.css`):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Video Feed Background** (`VideoFeed.css`):
```css
background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
```

### Adding More Videos

Edit the mock data in `src/components/VideoFeed.jsx` or integrate real YouTube API in `src/utils/youtubeService.js`.

### Modifying Navigation Tabs

Update the tab names and logic in `src/components/Navigation.jsx`.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- Videos are lazy-loaded
- Scroll snap for smooth transitions
- CSS animations optimized with `transform` and `opacity`
- Component-level code splitting ready

## Future Enhancements

Potential features to add:
- [ ] User authentication and profiles
- [ ] Video search functionality
- [ ] Playlist creation
- [ ] Comments and interactions
- [ ] Video recommendations algorithm
- [ ] Dark/Light theme toggle
- [ ] Infinite scroll with pagination
- [ ] Video upload functionality
- [ ] Social sharing integrations
- [ ] Analytics dashboard

## Troubleshooting

### Videos Not Loading

- Check your internet connection
- Verify YouTube video IDs are valid
- Check browser console for errors
- Ensure iframes are not blocked by browser extensions

### Scroll Not Working

- Clear browser cache
- Check that `overflow-y: scroll` is applied to `.video-feed`
- Verify scroll-snap CSS properties are supported

### API Rate Limits

- Implement caching for API responses
- Use a backend server to pool requests
- Consider using alternative video sources

## Technologies Used

- **React 19.2.0** - UI framework
- **Vite 7.2.2** - Build tool and dev server
- **CSS3** - Styling with modern features
- **YouTube Embed API** - Video playback

## Contributing

Feel free to fork this project and customize it for your needs!

## License

This project is open source and available for personal and commercial use.

## Support

For issues and questions, please refer to the documentation or create an issue in the repository.

---

**Built with ❤️ using React and Vite**

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Enjoy your new video feed app! 🎉
