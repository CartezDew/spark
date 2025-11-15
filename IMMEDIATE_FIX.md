# 🚨 Immediate Fix for Netlify

## Current Issue
Your app is trying to use Invidious as a fallback, but the instance is blocking CORS.

## ✅ Solution: Deploy Backend to Railway (10 minutes)

This is the **best solution** - it will work reliably with your YouTube API.

### Step 1: Deploy Backend (5 minutes)

1. **Go to [railway.app](https://railway.app/)**
   - Sign up with GitHub (free)
   - Click **"New Project"** → **"Deploy from GitHub repo"**
   - Select your **Spark** repository

2. **Configure:**
   - Click on your project
   - **Settings** → **Root Directory**: `backend`
   - **Variables** tab → Add:
     ```
     YOUTUBE_API_KEY=AIzaSyC3v9ZwOHvBvLcvIhhFrPTuU9TpUVGCE9A
     PORT=3001
     NODE_ENV=production
     ```

3. **Wait for deployment** (2-3 minutes)
   - Status will show "Active" when ready
   - Copy your Railway URL (e.g., `https://spark-backend-production.railway.app`)

### Step 2: Update Netlify (2 minutes)

1. **Netlify Dashboard** → Your Site → **Site Settings** → **Environment Variables**

2. **Add/Update:**
   ```
   VITE_BACKEND_API_URL=https://your-railway-url.railway.app/api
   VITE_API_MODE=backend
   ```
   ⚠️ Replace `your-railway-url` with your actual Railway URL

3. **Save** → **Deploys** → **Trigger deploy**

**✅ Done! Videos will load from your backend with YouTube API.**

---

## 🔄 Alternative: Quick Test with Invidious

If you want to test immediately while setting up Railway:

1. **Netlify** → **Environment Variables** → Add:
   ```
   VITE_API_MODE=invidious
   ```

2. **Redeploy**

**Note:** The code now tries multiple Invidious instances, but CORS may still block some. Backend is more reliable.

---

## 🎯 Recommended: Use Backend

The backend solution is better because:
- ✅ Uses your YouTube API key (no CORS issues)
- ✅ More reliable
- ✅ Better video quality and selection
- ✅ Supports category-based searches
- ✅ Free on Railway

---

## 📝 What I Fixed

1. ✅ Updated Invidious fallback to try 6 different instances
2. ✅ Better error handling and logging
3. ✅ Graceful fallback to mock data if all fails
4. ✅ Production detection improved

**Next:** Deploy backend to Railway for best results! 🚀

