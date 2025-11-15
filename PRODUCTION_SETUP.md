# 🚀 Production Setup - Complete Guide

## Current Status
Your app is deployed on Netlify but videos aren't loading because:
1. Backend is trying to connect to `localhost:3001` (doesn't exist in production)
2. Backend needs to be deployed separately

## ✅ Solution Options

### Option 1: Quick Fix - Use Invidious (2 minutes) ⚡

**This works immediately without deploying a backend:**

1. **Go to Netlify Dashboard**
   - Your Site → **Site Settings** → **Environment Variables**

2. **Add these variables:**
   ```
   VITE_API_MODE=invidious
   ```

3. **Save and Redeploy**
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Deploy site"**

**Done!** Your app will now use Invidious API (no backend needed).

---

### Option 2: Deploy Backend to Railway (Recommended - 10 minutes) 🎯

#### Step 1: Deploy Backend

1. **Go to [railway.app](https://railway.app/)**
   - Sign up with GitHub
   - Click **"New Project"** → **"Deploy from GitHub repo"**
   - Select your **Spark** repository

2. **Configure Railway:**
   - Click on your project
   - Go to **Settings** → **Root Directory**: Set to `backend`
   - Railway will auto-detect Node.js

3. **Add Environment Variables in Railway:**
   - Go to **Variables** tab
   - Click **"New Variable"**
   - Add these:
     ```
     YOUTUBE_API_KEY=AIzaSyC3v9ZwOHvBvLcvIhhFrPTuU9TpUVGCE9A
     PORT=3001
     NODE_ENV=production
     ```
   - Click **"Add"** for each

4. **Wait for Deployment**
   - Railway will auto-deploy
   - Wait until status shows **"Active"** (green)
   - Copy your Railway URL (looks like: `https://spark-backend-production.railway.app`)

#### Step 2: Update Netlify

1. **Go to Netlify Dashboard**
   - Your Site → **Site Settings** → **Environment Variables**

2. **Add/Update these variables:**
   ```
   VITE_BACKEND_API_URL=https://your-railway-url.railway.app/api
   VITE_API_MODE=backend
   ```
   ⚠️ **Important:** Replace `your-railway-url` with your actual Railway URL (no trailing slash except `/api`)

3. **Save and Redeploy**
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Deploy site"**

**Done!** Your app will now use your deployed backend.

---

### Option 3: Deploy Backend to Render (Alternative)

1. **Go to [render.com](https://render.com/)**
   - Sign up
   - Click **"New +"** → **"Web Service"**

2. **Connect Repository:**
   - Connect your GitHub repo
   - Settings:
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Add Environment Variables:**
   ```
   YOUTUBE_API_KEY=AIzaSyC3v9ZwOHvBvLcvIhhFrPTuU9TpUVGCE9A
   PORT=3001
   NODE_ENV=production
   ```

4. **Get URL and Update Netlify:**
   - Render gives you: `https://spark-backend.onrender.com`
   - Add to Netlify: `VITE_BACKEND_API_URL=https://spark-backend.onrender.com/api`

---

## 🔍 How to Verify It's Working

### Check Backend is Running:
1. Test backend health endpoint:
   ```
   https://your-backend-url.railway.app/api/health
   ```
   Should return: `{"status":"ok"}`

2. Test YouTube endpoint:
   ```
   https://your-backend-url.railway.app/api/youtube/top?maxResults=5
   ```
   Should return JSON with videos

### Check Frontend:
1. Open your Netlify site
2. Open browser console (F12)
3. Look for logs:
   - ✅ `[Backend] Fetching videos...` = Backend working
   - ✅ `[Backend] Received X videos` = Success!
   - ❌ `Backend URL is localhost` = Need to set `VITE_BACKEND_API_URL`
   - ❌ `Failed to fetch` = Backend not deployed or wrong URL

---

## 🐛 Troubleshooting

### "No videos found" on Netlify
- ✅ Check Netlify environment variables are set correctly
- ✅ Check backend is deployed and shows "Active" status
- ✅ Check backend URL in Netlify has `/api` at the end (not just domain)
- ✅ Check browser console for specific errors

### Backend not responding
- ✅ Check Railway/Render dashboard shows "Active"
- ✅ Check backend logs for errors (Railway → Deployments → View Logs)
- ✅ Verify environment variables in backend are set
- ✅ Test backend URL directly: `curl https://your-backend-url.com/api/health`

### CORS errors
- ✅ Backend CORS is configured to allow all origins in production
- ✅ If issues persist, check backend `server.js` CORS settings

### YouTube API 403 errors
- ✅ Verify `YOUTUBE_API_KEY` is set in Railway/Render
- ✅ Check API key is valid in Google Cloud Console
- ✅ Ensure "YouTube Data API v3" is enabled in Google Cloud Console

### Environment variables not working
- ✅ In Netlify, variables must start with `VITE_` to be available in frontend
- ✅ After adding variables, you MUST redeploy
- ✅ Check variable names match exactly (case-sensitive)

---

## 📝 Summary

**Fastest Solution:**
1. Add `VITE_API_MODE=invidious` to Netlify
2. Redeploy
3. ✅ Works immediately

**Best Solution:**
1. Deploy backend to Railway
2. Add `VITE_BACKEND_API_URL` to Netlify
3. Redeploy
4. ✅ Full backend control with YouTube API

---

## 🎯 Recommended Next Steps

1. **Immediate:** Use Invidious mode to get videos working now
2. **Later:** Deploy backend to Railway for full control
3. **Test:** Verify both frontend and backend are working
4. **Monitor:** Check Railway logs for any API issues

Your app is now production-ready! 🚀

