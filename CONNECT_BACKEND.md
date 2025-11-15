# 🔌 Connect Frontend to Backend - Step by Step

Follow these steps to connect your Spark frontend to the backend API.

## ✅ Step 1: Set Up Backend

### 1.1 Install Backend Dependencies

```bash
cd backend
npm install
```

### 1.2 Create `.env` File

Create `backend/.env` file:

```bash
cd backend
# Copy the example (or create manually)
touch .env
```

Add your API keys to `backend/.env`:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
TWITCH_CLIENT_ID=your_twitch_client_id_here
TWITCH_CLIENT_SECRET=your_twitch_client_secret_here
PORT=3001
NODE_ENV=development
```

**Get API Keys:**
- **YouTube**: [Google Cloud Console](https://console.cloud.google.com/) → Enable YouTube Data API v3 → Create API Key
- **Twitch**: [Twitch Developers](https://dev.twitch.tv/) → Register Application → Get Client ID & Secret

### 1.3 Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
🚀 Spark Backend Server running on http://localhost:3001
📺 YouTube API: http://localhost:3001/api/youtube/top
🎮 Twitch API: http://localhost:3001/api/twitch/top
```

**Keep this terminal open!** The backend needs to be running.

## ✅ Step 2: Verify Backend is Working

Test the backend in a new terminal:

```bash
# Health check
curl http://localhost:3001/api/health

# Test YouTube endpoint
curl http://localhost:3001/api/youtube/top?maxResults=5
```

You should see JSON responses. If you get errors, check:
- Backend server is running
- `.env` file has correct API keys
- API keys are valid

## ✅ Step 3: Frontend is Already Configured! 🎉

The frontend has been **automatically updated** to use the backend! Here's what changed:

### What Was Updated:

1. **`src/config/config.js`**
   - Set `apiMode: 'backend'` (was 'mock')
   - Added `backendApiUrl: 'http://localhost:3001/api'`

2. **`src/services/youthContentFetcher.js`**
   - Added `fetchFromBackend()` function
   - Automatically uses backend when `apiMode === 'backend'`
   - Falls back to mock data if backend fails

### How It Works:

- Frontend calls: `http://localhost:3001/api/youtube/top?q=...`
- Backend fetches from YouTube API (keeps keys secure)
- Backend returns clean JSON
- Frontend displays videos

## ✅ Step 4: Start Frontend

In a **new terminal** (keep backend running):

```bash
# Make sure you're in the root Spark directory
cd /Users/cartezdewberry/Spark

# Start frontend
npm run dev
```

Frontend will open at `http://localhost:5173` (or similar)

## ✅ Step 5: Test It!

1. **Open browser** to frontend URL
2. **Open browser console** (F12 or Cmd+Option+I)
3. **Watch for logs:**
   - `[Backend] Fetching videos from backend API...`
   - `[Backend] Received X videos`

4. **Check Network tab:**
   - Look for requests to `localhost:3001`
   - Should see successful API calls

## 🐛 Troubleshooting

### "Backend API error: 500"
- Check backend terminal for error messages
- Verify API keys in `.env` are correct
- Check YouTube API quota (10,000 units/day)

### "Failed to fetch" or CORS errors
- Make sure backend is running on port 3001
- Check backend terminal shows server started
- Verify `backendApiUrl` in `config.js` matches backend port

### "Falling back to mock data"
- Backend connection failed
- Check backend is running
- Check browser console for specific errors
- Verify backend URL is correct

### Videos not loading
- Check backend terminal for API errors
- Verify YouTube API key is valid
- Check browser console for errors
- Try: `curl http://localhost:3001/api/youtube/top?maxResults=5`

## 🔄 Switching Between Modes

You can switch between backend and other modes in `src/config/config.js`:

```javascript
// Use backend (recommended)
apiMode: 'backend'

// Use direct YouTube API (requires API key in frontend)
apiMode: 'youtube'

// Use Invidious (no API key needed)
apiMode: 'invidious'

// Use mock data (for testing)
apiMode: 'mock'
```

## 📊 What You Should See

### Backend Terminal:
```
[API] GET /api/youtube/top - query: how to become choreographer OR music producer OR dancer, region: US, max: 20
[YouTube] Searching for: "how to become choreographer OR music producer OR dancer"
[YouTube] Found 20 videos
[YouTube] Fetching details for 20 videos
[YouTube] Retrieved details for 20 videos
```

### Frontend Console:
```
[Backend] Fetching videos from backend API...
[Backend] Calling: http://localhost:3001/api/youtube/top?q=...
[Backend] Received 20 videos
Successfully loaded 20 personalized videos
```

### Browser:
- Videos load from YouTube
- Real view counts
- Real channel names
- Career discovery content

## 🎯 Next Steps

1. ✅ Backend running on port 3001
2. ✅ Frontend connected to backend
3. ✅ Videos loading from YouTube API
4. 🚀 **You're done!** Start exploring careers!

---

**Need help?** Check:
- `backend/README.md` - Backend documentation
- `BACKEND_INTEGRATION.md` - Detailed integration guide
- Browser console for errors
- Backend terminal for API logs

