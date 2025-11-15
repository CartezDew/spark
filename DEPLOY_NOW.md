# 🚨 DEPLOY TO NETLIFY NOW - Step by Step

## Current Issue
The Netlify Functions aren't deployed yet because the code changes are still local. You need to push to GitHub and set environment variables.

## ✅ Step 1: Commit and Push Changes

```bash
# In your terminal (in the Spark directory):
git add .
git commit -m "Add Netlify Functions for backend API"
git push origin main
```

## ✅ Step 2: Set Environment Variables in Netlify

**CRITICAL: You must do this BEFORE the deployment completes!**

1. **Go to Netlify Dashboard:**
   - Open https://app.netlify.com
   - Click on your site (cool-biscochitos-b96e4c)

2. **Navigate to Site Settings:**
   - Click "Site settings" (top navigation)
   - Click "Environment variables" (left sidebar under "Build & deploy")

3. **Add Environment Variable:**
   - Click "Add a variable" → "Add a single variable"
   
   **Variable:**
   - **Key:** `YOUTUBE_API_KEY`
   - **Value:** `AIzaSyC3v9ZwOHvBvLcvIhhFrPTuU9TpUVGCE9A`
   - **Scopes:** Select "All scopes" or "Functions"
   - Click "Create variable"

4. **Click "Save"**

## ✅ Step 3: Trigger Deploy (or wait for auto-deploy)

If connected to GitHub:
- Netlify will auto-deploy after you push
- Go to "Deploys" tab to watch progress

If not connected:
- Go to "Deploys" tab
- Click "Trigger deploy" → "Deploy site"

## ✅ Step 4: Verify Deployment

1. **Wait for deployment to complete** (2-3 minutes)
   - Status will show "Published" when ready

2. **Check Functions Tab:**
   - Go to "Functions" tab in Netlify
   - You should see:
     - `youtube/top`
     - `twitch/top`
     - `health`

3. **Test the functions:**
   ```bash
   # Test health endpoint
   curl https://cool-biscochitos-b96e4c.netlify.app/api/health
   
   # Should return: {"success":true,"status":"ok",...}
   
   # Test YouTube endpoint
   curl https://cool-biscochitos-b96e4c.netlify.app/api/youtube/top?maxResults=3
   
   # Should return: {"success":true,"count":3,"data":[...]}
   ```

4. **Test the frontend:**
   - Open https://cool-biscochitos-b96e4c.netlify.app
   - Open browser console (F12)
   - You should see: `[Backend] Received X videos`
   - Videos should load!

## 🐛 If Functions Still Not Found

### Check Build Logs:
1. Go to "Deploys" tab
2. Click on the latest deployment
3. Click "View deploy logs"
4. Look for:
   ```
   ✔ Functions bundled successfully
   Functions:
     - youtube/top
     - twitch/top
     - health
   ```

### If functions aren't in the logs:
- Check `netlify.toml` has `functions = "netlify/functions"`
- Verify functions are in `netlify/functions/youtube/top.js` etc.
- Try clearing cache: Site Settings → Build & deploy → "Clear cache and deploy site"

### If environment variable not working:
- Go back to Environment variables
- Verify `YOUTUBE_API_KEY` is set
- Check spelling and value
- Redeploy after adding: "Trigger deploy" → "Clear cache and deploy site"

## 📝 Quick Checklist

- [ ] Changes committed locally
- [ ] Changes pushed to GitHub
- [ ] `YOUTUBE_API_KEY` set in Netlify
- [ ] Deployment triggered/completed
- [ ] Functions show in Functions tab
- [ ] `/api/health` endpoint works
- [ ] `/api/youtube/top` endpoint works
- [ ] Frontend loads videos

---

## 🚀 Summary Commands

```bash
# 1. Commit and push
cd /Users/cartezdewberry/Spark
git add .
git commit -m "Add Netlify Functions"
git push origin main

# 2. Set environment variable in Netlify Dashboard
#    (YOUTUBE_API_KEY = AIzaSyC3v9ZwOHvBvLcvIhhFrPTuU9TpUVGCE9A)

# 3. Wait for deploy, then test:
curl https://cool-biscochitos-b96e4c.netlify.app/api/health
```

**The functions are ready in your code - they just need to be deployed!** 🎯

