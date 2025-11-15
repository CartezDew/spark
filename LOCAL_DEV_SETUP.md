# 🔧 Local Development Setup

## How It Works Now

**Frontend (Local):**
- Runs on: `http://localhost:5173`
- Connects to: Netlify backend at `https://cool-biscochitos-b96e4c.netlify.app/api`

**Backend (Netlify):**
- Hosted on: Netlify Functions
- Uses: YouTube API key from Netlify environment variables

## Local Development Workflow

### 1. Start Local Dev Server
```bash
npm run dev
```
This starts the frontend on `http://localhost:5173`

### 2. Edit Code
Make your changes to the React app in `src/`

### 3. Test Locally
- Open: `http://localhost:5173`
- The frontend runs locally
- API calls go to Netlify backend (already deployed)
- Fast refresh for instant updates

### 4. Deploy Changes
```bash
git add .
git commit -m "Your message"
git push origin main
```
Netlify auto-deploys in ~2 minutes

## Why This Setup?

✅ **Fast local development** - Hot reload, instant updates
✅ **No local backend needed** - Uses Netlify backend
✅ **Same backend for dev and prod** - Consistent behavior
✅ **No environment setup** - API keys only in Netlify

## After Making Changes

**Frontend changes (React components, styles):**
- Just save the file
- Browser auto-refreshes
- No need to deploy

**Backend changes (Netlify Functions):**
- Edit `netlify/functions/`
- Commit and push
- Netlify redeploys backend
- Changes live in ~2 min

## Current Configuration

```javascript
// src/config/config.js
backendApiUrl: 'https://cool-biscochitos-b96e4c.netlify.app/api'
```

**Local dev (`localhost:5173`):**
- ✅ Frontend runs locally
- ✅ Backend calls go to Netlify

**Production (Netlify):**
- ✅ Frontend on Netlify
- ✅ Backend on Netlify
- ✅ Uses `/api/*` (same domain)

## Restart Your Dev Server

After this change, restart your local dev server:

1. Stop the current server (Ctrl+C in terminal)
2. Run: `npm run dev`
3. Open: `http://localhost:5173`

Now it will connect to the Netlify backend instead of `localhost:3001`!

## Troubleshooting

### Still getting "Connection Refused"?
1. Make sure you restarted the dev server after the config change
2. Clear browser cache (Cmd+Shift+R on Mac)
3. Check Network tab in browser console for the API URL

### Backend not working?
1. Make sure Netlify has deployed the functions
2. Check: https://app.netlify.com/sites/cool-biscochitos-b96e4c/functions
3. Test directly: `curl https://cool-biscochitos-b96e4c.netlify.app/api/health`

### Want to use a local backend?
Set environment variable:
```bash
VITE_BACKEND_API_URL=http://localhost:3001/api npm run dev
```

---

**Your local dev server will now use the Netlify backend!** 🚀

