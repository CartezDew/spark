# 🚨 Quick Fix for Netlify - Videos Not Loading

## The Problem
Your app is trying to connect to `http://localhost:3001/api` which doesn't exist in production.

## ✅ Solution 1: Quick Fix (Use Invidious - 2 minutes)

**This will work immediately without deploying a backend:**

1. Go to **Netlify Dashboard** → Your Site → **Site Settings** → **Environment Variables**
2. Click **"Add a variable"**
3. Add:
   - **Key**: `VITE_API_MODE`
   - **Value**: `invidious`
4. Click **"Save"**
5. Go to **Deploys** tab → Click **"Trigger deploy"** → **"Deploy site"**

**Done!** Your app will now use Invidious API (no backend needed).

---

## ✅ Solution 2: Deploy Backend (Recommended - 10 minutes)

### Step 1: Deploy Backend to Railway

1. Go to **[railway.app](https://railway.app/)** and sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your **Spark** repository
4. In Railway dashboard:
   - Click on your project
   - Go to **Settings** → **Root Directory**: Set to `backend`
   - Go to **Variables** tab and add:
     ```
     YOUTUBE_API_KEY=AIzaSyC3v9ZwOHvBvLcvIhhFrPTuU9TpUVGCE9A
     PORT=3001
     NODE_ENV=production
     ```
5. Railway will auto-deploy. Wait for it to finish.
6. Copy your Railway URL (looks like: `https://your-app.railway.app`)

### Step 2: Update Netlify

1. Go to **Netlify Dashboard** → Your Site → **Site Settings** → **Environment Variables**
2. Add/Update:
   - **Key**: `VITE_BACKEND_API_URL`
   - **Value**: `https://your-app.railway.app/api` (replace with your Railway URL)
   - **Key**: `VITE_API_MODE`
   - **Value**: `backend`
3. Click **"Save"**
4. Go to **Deploys** tab → Click **"Trigger deploy"** → **"Deploy site"**

**Done!** Your app will now use your deployed backend.

---

## 🔍 How to Check if It's Working

1. Open your Netlify site
2. Open browser console (F12)
3. Look for logs:
   - ✅ `[Backend] Fetching videos...` = Backend working
   - ✅ `[Invidious] Fetching...` = Invidious working
   - ❌ `Failed to fetch` = Check backend URL

---

## 🐛 Still Not Working?

### Check Backend is Running:
- Go to Railway dashboard → Check status is "Active"
- Test backend directly: `https://your-backend-url.railway.app/api/health`
- Should return: `{"status":"ok"}`

### Check Netlify Environment Variables:
- Make sure `VITE_BACKEND_API_URL` has no trailing slash (except `/api`)
- Make sure `VITE_API_MODE` is set correctly

### Check Browser Console:
- Look for CORS errors (backend CORS is configured, but check)
- Look for 404 errors (wrong URL)
- Look for 403 errors (YouTube API key issue)

---

## 📝 Summary

**Fastest Fix:** Add `VITE_API_MODE=invidious` to Netlify env vars → Redeploy

**Best Fix:** Deploy backend to Railway → Add `VITE_BACKEND_API_URL` to Netlify → Redeploy

