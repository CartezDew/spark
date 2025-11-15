# 🚀 Deploy Frontend + Backend on Netlify

Your app is now configured to run both frontend and backend on Netlify using Netlify Functions!

## ✅ What's Been Set Up

1. **Netlify Functions** - Backend API converted to serverless functions
2. **netlify.toml** - Configuration for build and routing
3. **Frontend Config** - Updated to use Netlify Functions endpoints

## 📁 File Structure

```
Spark/
├── netlify/
│   └── functions/
│       ├── youtube-top.js    # GET /api/youtube/top
│       ├── twitch-top.js     # GET /api/twitch/top
│       └── health.js         # GET /api/health
├── backend/
│   └── services/            # Shared services (youtubeService, twitchService)
├── netlify.toml             # Netlify configuration
└── src/                     # Frontend React app
```

## 🚀 Deployment Steps

### Step 1: Install Dependencies

```bash
# Install frontend + backend dependencies
npm install

# This will install:
# - React dependencies (frontend)
# - axios, dotenv (for Netlify Functions)
```

### Step 2: Set Environment Variables in Netlify

1. **Go to Netlify Dashboard**
   - Your Site → **Site Settings** → **Environment Variables**

2. **Add these variables:**

   **YouTube API Key:**
   - **Key:** `YOUTUBE_API_KEY`
   - **Value:** `AIzaSyC3v9ZwOHvBvLcvIhhFrPTuU9TpUVGCE9A`
   - **Scopes:** All scopes (or just Functions)

   **Twitch (Optional):**
   - **Key:** `TWITCH_CLIENT_ID`
   - **Value:** Your Twitch Client ID
   - **Key:** `TWITCH_CLIENT_SECRET`
   - **Value:** Your Twitch Client Secret

   **Frontend Config:**
   - **Key:** `VITE_API_MODE`
   - **Value:** `backend`

3. **Click "Save"**

### Step 3: Deploy to Netlify

**Option A: Connect GitHub (Recommended)**
1. Push your code to GitHub
2. In Netlify Dashboard → **Add new site** → **Import an existing project**
3. Connect your GitHub repo
4. Netlify will auto-detect settings from `netlify.toml`
5. Click **"Deploy site"**

**Option B: Manual Deploy**
1. Build your site: `npm run build`
2. In Netlify Dashboard → **Add new site** → **Deploy manually**
3. Drag and drop the `dist` folder
4. Set environment variables (Step 2)

### Step 4: Verify Deployment

1. **Check Functions:**
   - Go to **Functions** tab in Netlify
   - You should see: `youtube-top`, `twitch-top`, `health`

2. **Test Endpoints:**
   ```
   https://your-site.netlify.app/api/health
   https://your-site.netlify.app/api/youtube/top?maxResults=5
   ```

3. **Test Frontend:**
   - Open your Netlify site
   - Open browser console (F12)
   - Look for: `[Backend] Received X videos`
   - ✅ Videos should load!

## 🔧 How It Works

### Netlify Functions
- **Location:** `netlify/functions/`
- **Routing:** `/api/*` automatically routes to `/.netlify/functions/*`
- **Environment:** Functions have access to environment variables set in Netlify

### API Endpoints
- `GET /api/youtube/top` → `netlify/functions/youtube-top.js`
- `GET /api/twitch/top` → `netlify/functions/twitch-top.js`
- `GET /api/health` → `netlify/functions/health.js`

### Frontend
- Uses `/api/*` endpoints (automatically routes to functions)
- In production: Uses Netlify Functions
- In local dev: Can use `localhost:3001` if backend server is running

## 🐛 Troubleshooting

### Functions not deploying
- ✅ Check `netlify.toml` exists in root
- ✅ Verify functions are in `netlify/functions/` directory
- ✅ Check Netlify build logs for errors

### Environment variables not working
- ✅ Variables must be set in Netlify Dashboard (not in `.env` file)
- ✅ For functions: Variables are automatically available as `process.env.*`
- ✅ For frontend: Variables must start with `VITE_` prefix

### 403 YouTube API errors
- ✅ Check `YOUTUBE_API_KEY` is set in Netlify environment variables
- ✅ Verify API key is valid
- ✅ Check YouTube API quota (10,000 units/day)

### CORS errors
- ✅ Netlify Functions include CORS headers automatically
- ✅ Check function logs in Netlify Dashboard

### Functions timeout
- ✅ Netlify Functions have 10s timeout (free tier) or 26s (pro)
- ✅ If timeout, check function logs for slow operations

## 📝 Local Development

### Run Frontend Only:
```bash
npm run dev
```

### Run Backend Server (Optional for local dev):
```bash
cd backend
npm install
npm start
```

Then set in `src/config/config.js`:
```javascript
backendApiUrl: 'http://localhost:3001/api'
```

### Test Netlify Functions Locally:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run locally
netlify dev
```

This will:
- Start frontend dev server
- Run Netlify Functions locally
- Simulate production environment

## 🎯 Benefits of Netlify Functions

✅ **Single Platform** - Frontend + Backend on one platform
✅ **Serverless** - No server management
✅ **Auto-scaling** - Handles traffic automatically
✅ **Free Tier** - 125,000 requests/month free
✅ **Easy Deploy** - Deploy with git push
✅ **Environment Variables** - Secure API key storage

## 📊 Function Limits (Free Tier)

- **Execution Time:** 10 seconds
- **Memory:** 1024 MB
- **Requests:** 125,000/month
- **Concurrent Executions:** 50

For most use cases, free tier is sufficient!

---

**Your app is now ready to deploy on Netlify! 🚀**

Both frontend and backend will be on the same platform, making deployment and management much easier.

