# 🚀 Netlify Deployment Guide

Your Spark app is deployed on Netlify, but the backend needs to be deployed separately. Here are your options:

## Option 1: Deploy Backend to Railway (Recommended - Free)

Railway is free and easy to deploy Node.js apps.

### Steps:

1. **Go to [Railway.app](https://railway.app/)**
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Connect Your Repository**
   - Select your Spark repository
   - Railway will detect it's a Node.js app

3. **Configure the Deployment**
   - Set root directory to: `backend`
   - Railway will auto-detect `package.json`

4. **Add Environment Variables in Railway**
   - Go to your project → Variables
   - Add:
     ```
     YOUTUBE_API_KEY=your_youtube_api_key
     TWITCH_CLIENT_ID=your_twitch_client_id
     TWITCH_CLIENT_SECRET=your_twitch_client_secret
     PORT=3001
     NODE_ENV=production
     ```

5. **Get Your Backend URL**
   - Railway will give you a URL like: `https://your-app.railway.app`
   - Copy this URL

6. **Update Netlify Environment Variables**
   - Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
   - Add:
     ```
     VITE_BACKEND_API_URL=https://your-app.railway.app/api
     VITE_API_MODE=backend
     ```

7. **Redeploy Netlify**
   - Trigger a new deployment
   - Videos should now load!

## Option 2: Deploy Backend to Render (Free)

1. **Go to [Render.com](https://render.com/)**
   - Sign up
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your GitHub repo
   - Set:
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Add Environment Variables**
   - Same as Railway (YOUTUBE_API_KEY, etc.)

4. **Get URL and Update Netlify**
   - Render gives you: `https://your-app.onrender.com`
   - Add to Netlify: `VITE_BACKEND_API_URL=https://your-app.onrender.com/api`

## Option 3: Use Invidious Mode (No Backend Needed)

If you don't want to deploy a backend, switch to Invidious mode:

1. **In Netlify Environment Variables:**
   ```
   VITE_API_MODE=invidious
   ```

2. **Redeploy**
   - This uses public Invidious API (no backend needed)
   - Less reliable but works immediately

## Option 4: Quick Fix - Update Config for Production

If you want to use Invidious temporarily while setting up backend:

1. **In Netlify Dashboard:**
   - Go to Site Settings → Environment Variables
   - Add: `VITE_API_MODE=invidious`
   - Redeploy

2. **Or update `src/config/config.js` directly:**
   ```javascript
   apiMode: import.meta.env.VITE_API_MODE || 'invidious', // Fallback to invidious
   ```

## 🔧 Current Issue

Your app is trying to connect to `http://localhost:3001/api` which doesn't exist in production.

**Quick Fix:** Add this to Netlify Environment Variables:
```
VITE_API_MODE=invidious
```

Then redeploy. This will use Invidious API (no backend needed) until you deploy your backend.

## 📝 Recommended: Deploy Backend to Railway

1. **Railway Setup** (5 minutes):
   ```bash
   # In Railway dashboard:
   - New Project → Deploy from GitHub
   - Select Spark repo
   - Set root directory: backend
   - Add environment variables
   ```

2. **Get Backend URL:**
   - Railway gives you: `https://spark-backend.railway.app`

3. **Update Netlify:**
   ```
   VITE_BACKEND_API_URL=https://spark-backend.railway.app/api
   VITE_API_MODE=backend
   ```

4. **Redeploy Netlify**

## 🐛 Troubleshooting

### "No videos found" on Netlify
- Check Netlify environment variables are set
- Check backend is deployed and running
- Check backend URL is correct (no trailing slash except `/api`)
- Check browser console for CORS errors

### Backend not responding
- Check Railway/Render dashboard shows "Active"
- Check backend logs for errors
- Verify environment variables in backend are set
- Test backend URL directly: `curl https://your-backend-url.com/api/health`

### CORS errors
- Backend CORS is enabled for all origins
- If issues persist, check backend `server.js` CORS settings

---

**Quickest Solution:** Add `VITE_API_MODE=invidious` to Netlify env vars and redeploy. This will work immediately while you set up the backend.

