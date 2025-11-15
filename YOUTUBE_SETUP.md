# YouTube Integration Setup Guide

This guide will help you set up real YouTube video integration for your Spark app.

## Quick Setup (5 minutes)

### Step 1: Get YouTube API Key

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Click "Enable APIs and Services"
4. Search for "YouTube Data API v3"
5. Click "Enable"
6. Go to "Credentials" in the sidebar
7. Click "Create Credentials" → "API Key"
8. Copy your API key

### Step 2: Update Your App

Open `src/utils/youtubeService.js` and replace:

```javascript
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY_HERE';
```

With your actual API key:

```javascript
const YOUTUBE_API_KEY = 'AIzaSyC...your-actual-key...';
```

### Step 3: Enable Production Code

In the same file (`src/utils/youtubeService.js`), uncomment the production API calls and comment out the mock data sections.

## Backend Setup (Recommended for Production)

For better security and to avoid exposing your API key in the frontend, set up a backend:

### Option A: Node.js/Express Backend

1. **Create a new backend folder:**

```bash
mkdir spark-backend
cd spark-backend
npm init -y
npm install express cors dotenv axios
```

2. **Create `server.js`:**

```javascript
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Get trending videos
app.get('/api/videos/trending', async (req, res) => {
  try {
    const { maxResults = 20, regionCode = 'US' } = req.query;
    const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        part: 'snippet,statistics',
        chart: 'mostPopular',
        maxResults,
        regionCode,
        key: YOUTUBE_API_KEY
      }
    });
    
    const videos = response.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      likes: formatNumber(item.statistics.likeCount),
      views: formatNumber(item.statistics.viewCount),
      comments: formatNumber(item.statistics.commentCount)
    }));
    
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Search videos
app.get('/api/videos/search', async (req, res) => {
  try {
    const { query, maxResults = 10 } = req.query;
    const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults,
        key: YOUTUBE_API_KEY
      }
    });
    
    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url
    }));
    
    res.json(videos);
  } catch (error) {
    console.error('Error searching videos:', error);
    res.status(500).json({ error: 'Failed to search videos' });
  }
});

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
```

3. **Create `.env` file:**

```
YOUTUBE_API_KEY=your_api_key_here
PORT=3001
```

4. **Start the backend:**

```bash
node server.js
```

5. **Update frontend `youtubeService.js`:**

```javascript
const API_BASE_URL = 'http://localhost:3001/api';

export const fetchYouTubeVideos = async (category = 'trending', maxResults = 20) => {
  try {
    const response = await fetch(`${API_BASE_URL}/videos/trending?maxResults=${maxResults}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};
```

### Option B: Serverless Functions (Vercel/Netlify)

**For Vercel:**

1. Create `api/videos.js` in your project root:

```javascript
export default async function handler(req, res) {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=20&key=${YOUTUBE_API_KEY}`
  );
  
  const data = await response.json();
  res.json(data);
}
```

2. Add environment variable in Vercel dashboard

3. Deploy to Vercel

## Alternative: Invidious API

If you want to avoid YouTube API quotas, use Invidious (open-source YouTube frontend):

```javascript
const INVIDIOUS_INSTANCE = 'https://invidious.snopyta.org';

export const fetchYouTubeVideos = async () => {
  const response = await fetch(`${INVIDIOUS_INSTANCE}/api/v1/trending`);
  const data = await response.json();
  
  return data.map(video => ({
    id: video.videoId,
    title: video.title,
    channel: video.author,
    description: video.description,
    views: video.viewCount,
    // ... etc
  }));
};
```

## API Quota Management

YouTube Data API v3 has a daily quota of 10,000 units. Here's how requests cost:

- Search query: 100 units
- Video list: 1 unit
- Video details: 1 unit

**Tips to save quota:**
- Cache responses (use localStorage or Redis)
- Implement pagination
- Use webhook notifications for updates
- Consider multiple API keys for high traffic

## Caching Strategy

Add caching to reduce API calls:

```javascript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let videoCache = {
  data: null,
  timestamp: null
};

export const fetchYouTubeVideos = async () => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (videoCache.data && (now - videoCache.timestamp) < CACHE_DURATION) {
    return videoCache.data;
  }
  
  // Fetch new data
  const videos = await fetchFromAPI();
  
  videoCache = {
    data: videos,
    timestamp: now
  };
  
  return videos;
};
```

## Regional Content

To implement region-specific content (as per your navigation tabs):

```javascript
// In VideoFeed.jsx
const [region, setRegion] = useState('US');

useEffect(() => {
  fetchVideosByRegion(region);
}, [region]);

// Update based on navigation tab
<Navigation onRegionChange={setRegion} />
```

Region codes:
- `US` - United States (Nationwide)
- `GB` - United Kingdom
- `CA` - Canada
- `AU` - Australia
- `IN` - India
- etc.

## Error Handling

Always implement proper error handling:

```javascript
export const fetchYouTubeVideos = async () => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    
    // Fallback to mock data or show error message
    return getMockVideos();
  }
};
```

## Testing Your Integration

1. **Test with Browser Console:**
```javascript
// In browser console
import { fetchYouTubeVideos } from './utils/youtubeService';
fetchYouTubeVideos().then(console.log);
```

2. **Test API Endpoints:**
```bash
# Test backend endpoint
curl http://localhost:3001/api/videos/trending
```

3. **Check API Quota:**
- Go to Google Cloud Console
- Navigate to APIs & Services → Dashboard
- Check YouTube Data API v3 usage

## Common Issues

### CORS Errors
**Solution:** Use a backend proxy server

### API Key Invalid
**Solution:** Check that API key is correctly copied and API is enabled

### Quota Exceeded
**Solution:** Implement caching, use multiple keys, or upgrade quota

### Videos Not Playing
**Solution:** Check video IDs, ensure iframes are allowed

## Need Help?

- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [API Reference](https://developers.google.com/youtube/v3/docs)
- [Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)

---

Good luck with your integration! 🚀

