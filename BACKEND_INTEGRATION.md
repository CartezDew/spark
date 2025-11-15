# Backend Integration Guide

This guide shows how to integrate the new backend API with your Spark frontend.

## 🚀 Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Create `backend/.env` file (see `backend/ENV_SETUP.md` for details):

```env
YOUTUBE_API_KEY=your_key_here
TWITCH_CLIENT_ID=your_id_here
TWITCH_CLIENT_SECRET=your_secret_here
PORT=3001
```

### 3. Start Backend Server

```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

Server runs on `http://localhost:3001`

## 📡 API Endpoints

### YouTube: `GET /api/youtube/top`

**Query Parameters:**
- `q` - Search query (optional, uses mostPopular if not provided)
- `regionCode` - Region code (default: 'US')
- `maxResults` - Max results (default: 20, max: 50)

**Example:**
```javascript
// Most popular videos
fetch('http://localhost:3001/api/youtube/top?maxResults=20')
  .then(res => res.json())
  .then(data => console.log(data));

// Search videos
fetch('http://localhost:3001/api/youtube/top?q=music+production&maxResults=20')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Response Format:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "title": "Video Title",
      "thumbnail": "https://...",
      "viewCount": 1234567,
      "channelName": "Channel Name",
      "platform": "youtube",
      "videoId": "abc123"
    }
  ]
}
```

### Twitch: `GET /api/twitch/top`

**Query Parameters:**
- `game` - Game name to filter (optional, gets top globally if not provided)
- `maxResults` - Max results (default: 20, max: 100)

**Example:**
```javascript
// Top streams globally
fetch('http://localhost:3001/api/twitch/top?maxResults=20')
  .then(res => res.json())
  .then(data => console.log(data));

// Filter by game
fetch('http://localhost:3001/api/twitch/top?game=Just+Chatting&maxResults=20')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Response Format:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "title": "Stream Title",
      "thumbnail": "https://...",
      "viewerCount": 12345,
      "channelName": "streamer_name",
      "platform": "twitch",
      "streamId": "123456789",
      "gameName": "Just Chatting",
      "startedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## 🔌 Frontend Integration

### Update `youthContentFetcher.js`

Replace the mock/Invidious calls with backend API:

```javascript
// In src/services/youthContentFetcher.js

const API_BASE_URL = 'http://localhost:3001/api';

export const fetchYouthContent = async (region = 'US', school = null) => {
  try {
    // Build query for career discovery
    const queries = buildYouthQueries(region, school);
    const query = queries[0]; // Use first query
    
    const response = await fetch(
      `${API_BASE_URL}/youtube/top?q=${encodeURIComponent(query)}&maxResults=20&regionCode=${region}`
    );
    
    if (!response.ok) {
      throw new Error('Backend API error');
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      // Transform backend response to frontend format
      return data.data.map(video => ({
        id: video.videoId,
        title: video.title,
        channel: video.channelName,
        description: 'Career discovery content',
        thumbnail: video.thumbnail,
        views: formatNumber(video.viewCount),
        likes: '0',
        comments: '0',
        careerCategory: detectCareerCategory(video.title),
        tags: generateTagsForCategory(detectCareerCategory(video.title))
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching from backend:', error);
    // Fallback to mock data
    return fetchMockYouthContent(region, school);
  }
};
```

### Add Twitch Integration (Optional)

```javascript
// New function in youthContentFetcher.js

export const fetchTwitchStreams = async (game = null) => {
  try {
    const url = game 
      ? `${API_BASE_URL}/twitch/top?game=${encodeURIComponent(game)}&maxResults=20`
      : `${API_BASE_URL}/twitch/top?maxResults=20`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data.map(stream => ({
        id: stream.streamId,
        title: stream.title,
        channel: stream.channelName,
        description: `Live stream - ${stream.gameName}`,
        thumbnail: stream.thumbnail,
        views: formatNumber(stream.viewerCount),
        platform: 'twitch',
        isLive: true,
        gameName: stream.gameName
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching Twitch streams:', error);
    return [];
  }
};
```

## 🧪 Testing

### Test Backend Directly

```bash
# Health check
curl http://localhost:3001/api/health

# YouTube - Most Popular
curl http://localhost:3001/api/youtube/top?maxResults=5

# YouTube - Search
curl http://localhost:3001/api/youtube/top?q=music+production&maxResults=5

# Twitch - Top Streams
curl http://localhost:3001/api/twitch/top?maxResults=5

# Twitch - By Game
curl http://localhost:3001/api/twitch/top?game=Just+Chatting&maxResults=5
```

### Test Script

Run the test script (requires `jq` for JSON formatting):

```bash
cd backend
chmod +x test-api.sh
./test-api.sh
```

## 🔒 Security Notes

- API keys are **never exposed** to frontend
- All requests go through backend
- CORS is enabled for `localhost` development
- For production, update CORS settings in `server.js`

## 🐛 Troubleshooting

### Backend won't start
- Check `.env` file exists and has all required keys
- Verify `node_modules` installed (`npm install`)
- Check port 3001 is not in use

### API returns errors
- Verify API keys are correct in `.env`
- Check YouTube API quota (10,000 units/day)
- Verify Twitch credentials are valid
- Check server logs for detailed errors

### CORS errors in frontend
- Backend CORS is enabled by default
- For production, update CORS origin in `server.js`
- Check browser console for specific CORS errors

## 📝 Next Steps

1. Update frontend to use backend API
2. Add error handling for API failures
3. Implement caching to reduce API calls
4. Add rate limiting (if needed)
5. Deploy backend to production server

---

**Backend is ready! Start the server and integrate with your frontend.** 🚀

