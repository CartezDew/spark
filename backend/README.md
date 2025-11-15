# Spark Backend API

Backend server for Spark career discovery app providing YouTube and Twitch API endpoints.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env`:
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
TWITCH_CLIENT_ID=your_twitch_client_id_here
TWITCH_CLIENT_SECRET=your_twitch_client_secret_here
PORT=3001
```

### 3. Get API Keys

#### YouTube Data API v3
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)
5. Copy the API key to `.env`

#### Twitch API
1. Go to [Twitch Developers](https://dev.twitch.tv/)
2. Register your application
3. Get Client ID and Client Secret
4. Copy to `.env`

### 4. Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3001`

## 📡 API Endpoints

### GET /api/youtube/top

Fetch top YouTube videos.

**Query Parameters:**
- `q` (optional) - Search query. If provided, searches by query sorted by viewCount. If not, uses mostPopular.
- `regionCode` (optional) - Region code (default: 'US')
- `maxResults` (optional) - Maximum results (default: 20, max: 50)

**Examples:**
```bash
# Most popular videos
GET /api/youtube/top

# Search by query
GET /api/youtube/top?q=music+production

# With region and limit
GET /api/youtube/top?regionCode=GB&maxResults=30
```

**Response:**
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

### GET /api/twitch/top

Fetch top Twitch live streams.

**Query Parameters:**
- `game` (optional) - Game name to filter by. If not provided, gets top streams globally.
- `maxResults` (optional) - Maximum results (default: 20, max: 100)

**Examples:**
```bash
# Top streams globally
GET /api/twitch/top

# Filter by game
GET /api/twitch/top?game=Just+Chatting

# With limit
GET /api/twitch/top?maxResults=50
```

**Response:**
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

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Implementation Details

### YouTube Service

- **Two-step logic:**
  1. Search or get mostPopular → get video IDs
  2. Fetch full video details (statistics, thumbnails)

- **Search endpoint:** Used when `?q=` is provided, sorted by `viewCount`
- **MostPopular endpoint:** Used when no query, uses `chart=mostPopular`

### Twitch Service

- **OAuth flow:** Uses `client_credentials` grant type
- **Auto-refresh:** Token automatically refreshes before expiry (5 min buffer)
- **Thumbnail formatting:** Replaces `{width}` and `{height}` placeholders with 320x180

## 📦 Project Structure

```
backend/
├── server.js              # Express server
├── routes/
│   └── api.js            # API routes
├── services/
│   ├── youtubeService.js  # YouTube API service
│   └── twitchService.js   # Twitch API service
├── .env                   # Environment variables (not in git)
├── .env.example           # Example env file
├── package.json
└── README.md
```

## 🛠️ Development

### Scripts

- `npm start` - Start server
- `npm run dev` - Start with auto-reload (Node.js --watch)

### Error Handling

All endpoints include:
- Try-catch error handling
- Console logging
- Proper HTTP status codes
- Error messages in JSON response

### Logging

The server logs:
- All incoming requests
- API calls to YouTube/Twitch
- Errors with details
- Token refresh events

## 🔒 Security

- API keys stored in `.env` (not committed to git)
- Keys never exposed to frontend
- CORS enabled for frontend access
- Error messages don't expose sensitive data

## 📝 Notes

- Uses ESM (ES Modules) syntax
- Axios for HTTP requests
- Express for routing
- dotenv for environment variables
- CORS enabled for frontend integration

## 🐛 Troubleshooting

### "YOUTUBE_API_KEY not set"
- Check `.env` file exists
- Verify API key is correct
- Restart server after changing `.env`

### "Twitch OAuth failed"
- Verify Client ID and Secret in `.env`
- Check Twitch API status
- Ensure credentials are correct

### "YouTube search failed"
- Check API quota (10,000 units/day)
- Verify API key has YouTube Data API v3 enabled
- Check region code is valid

### "Twitch token expired"
- Token auto-refreshes, but if issues persist:
- Check Client ID and Secret
- Verify Twitch API access

## 📚 API Documentation

- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [Twitch Helix API](https://dev.twitch.tv/docs/api/)

---

**Built for Spark Career Discovery Platform** 🚀

