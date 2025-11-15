# 🚂 Deploy Backend to Railway - Step by Step

## Quick Deploy (10 minutes)

### Step 1: Create Railway Account & Project

1. **Go to [railway.app](https://railway.app/)**
   - Click **"Start a New Project"**
   - Sign up with **GitHub** (recommended - easiest)

2. **Deploy from GitHub:**
   - Click **"Deploy from GitHub repo"**
   - Authorize Railway to access your GitHub
   - Select your **Spark** repository
   - Click **"Deploy Now"**

### Step 2: Configure Backend Directory

1. **In Railway Dashboard:**
   - Click on your newly created project
   - Go to **Settings** tab
   - Find **"Root Directory"** section
   - Set to: `backend`
   - Click **"Update"**

   ⚠️ **Important:** This tells Railway to look in the `backend` folder for your Node.js app.

### Step 3: Add Environment Variables

1. **In Railway Dashboard:**
   - Go to **Variables** tab
   - Click **"New Variable"**

2. **Add these 3 variables:**

   **Variable 1:**
   - **Key:** `YOUTUBE_API_KEY`
   - **Value:** `AIzaSyC3v9ZwOHvBvLcvIhhFrPTuU9TpUVGCE9A`
   - Click **"Add"**

   **Variable 2:**
   - **Key:** `PORT`
   - **Value:** `3001`
   - Click **"Add"**

   **Variable 3:**
   - **Key:** `NODE_ENV`
   - **Value:** `production`
   - Click **"Add"**

### Step 4: Wait for Deployment

1. **Go to Deployments tab**
   - Railway will automatically:
     - Install dependencies (`npm install`)
     - Start your server (`npm start`)
   - Wait 2-3 minutes for deployment to complete
   - Status will show **"Active"** when ready

2. **Get Your Backend URL:**
   - Go to **Settings** tab
   - Find **"Domains"** section
   - Copy the URL (looks like: `https://spark-backend-production.railway.app`)
   - **OR** go to **Deployments** → Click on latest deployment → Copy the URL

### Step 5: Connect Frontend (Netlify)

1. **Go to Netlify Dashboard:**
   - Your Site → **Site Settings** → **Environment Variables**

2. **Add/Update Variables:**

   **Variable 1:**
   - **Key:** `VITE_BACKEND_API_URL`
   - **Value:** `https://your-railway-url.railway.app/api`
     - ⚠️ Replace `your-railway-url` with your actual Railway URL
     - ⚠️ Make sure to include `/api` at the end
   - Click **"Save"**

   **Variable 2:**
   - **Key:** `VITE_API_MODE`
   - **Value:** `backend`
   - Click **"Save"**

3. **Redeploy Netlify:**
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Deploy site"**
   - Wait for deployment to complete

### Step 6: Test It!

1. **Test Backend:**
   ```bash
   # Health check
   curl https://your-railway-url.railway.app/api/health
   
   # Should return: {"status":"ok"}
   
   # Test YouTube endpoint
   curl https://your-railway-url.railway.app/api/youtube/top?maxResults=5
   
   # Should return JSON with videos
   ```

2. **Test Frontend:**
   - Open your Netlify site
   - Open browser console (F12)
   - Look for: `[Backend] Received X videos`
   - ✅ Videos should load!

---

## 🐛 Troubleshooting

### Backend not deploying
- ✅ Check Railway logs (Deployments → View Logs)
- ✅ Verify Root Directory is set to `backend`
- ✅ Check that `package.json` exists in `backend/` folder
- ✅ Verify environment variables are set

### Backend returns 403 errors
- ✅ Check `YOUTUBE_API_KEY` is set correctly in Railway
- ✅ Verify API key is valid in Google Cloud Console
- ✅ Ensure "YouTube Data API v3" is enabled

### Frontend can't connect
- ✅ Verify `VITE_BACKEND_API_URL` includes `/api` at the end
- ✅ Check backend URL is correct (no typos)
- ✅ Test backend URL directly in browser
- ✅ Check browser console for CORS errors

### Videos not loading
- ✅ Check Railway deployment is "Active"
- ✅ Check Netlify environment variables are set
- ✅ Verify backend health endpoint works
- ✅ Check browser console for errors

---

## 📝 What Gets Deployed

Railway will:
1. ✅ Clone your GitHub repo
2. ✅ Navigate to `backend/` directory
3. ✅ Run `npm install` (installs dependencies)
4. ✅ Run `npm start` (starts server)
5. ✅ Expose on public URL

Your backend will be accessible at:
```
https://your-project.railway.app/api/youtube/top
https://your-project.railway.app/api/twitch/top
https://your-project.railway.app/api/health
```

---

## 🎯 Next Steps After Deployment

1. ✅ Test backend endpoints
2. ✅ Update Netlify environment variables
3. ✅ Redeploy Netlify
4. ✅ Test frontend
5. ✅ Monitor Railway logs for any issues

---

## 💡 Pro Tips

- **Free Tier:** Railway gives you $5 free credit/month
- **Auto-Deploy:** Railway auto-deploys on every git push
- **Logs:** Check Railway logs if something breaks
- **Variables:** Never commit `.env` file - use Railway Variables instead

---

**Your backend is now live! 🚀**

