# 🔍 Debug Netlify Functions - API Key Not Working

## Current Status
✅ Environment variable `YOUTUBE_API_KEY` is set in Netlify
❌ Functions still not working

## Most Likely Issues

### 1. Functions Not Redeployed After Setting Environment Variable

**Solution:**
1. Go to: https://app.netlify.com/sites/cool-biscochitos-b96e4c/deploys
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait for deployment to complete (2-3 minutes)

**Why:** Environment variables are only available to functions AFTER they're redeployed.

### 2. Check Function Logs

1. Go to: https://app.netlify.com/sites/cool-biscochitos-b96e4c/functions
2. Click on `youtube/top` function
3. Go to "Logs" tab
4. Look for:
   - `YOUTUBE_API_KEY found: AIzaSyC3v...` ✅ Good
   - `YOUTUBE_API_KEY not found` ❌ Problem
   - `ERROR: YOUTUBE_API_KEY is not set` ❌ Problem

### 3. Test Function Directly

Test the function endpoint:
```bash
curl https://cool-biscochitos-b96e4c.netlify.app/api/youtube/top?maxResults=3
```

**Expected responses:**
- ✅ `{"success":true,"count":3,"data":[...]}` - Working!
- ❌ `{"success":false,"error":"YOUTUBE_API_KEY not configured"}` - Need to redeploy
- ❌ `{"success":false,"error":"YouTube search failed: Request failed with status code 403"}` - API key issue

### 4. Verify Environment Variable Scope

In Netlify Dashboard:
1. Go to: Site Settings → Environment Variables
2. Click on `YOUTUBE_API_KEY`
3. Verify it shows:
   - ✅ "All scopes" OR "Functions"
   - ✅ Value is correct: `AIzaSyC3v9ZwOHvBvLcvIhhFrPTuU9TpUVGCE9A`

### 5. Check Build Logs

1. Go to: Deploys → Latest deployment → "View deploy logs"
2. Look for:
   ```
   ✔ Functions bundled successfully
   Functions:
     - youtube/top
     - twitch/top
     - health
   ```

## Step-by-Step Fix

### Step 1: Verify Environment Variable
- [ ] Go to Netlify Dashboard → Environment Variables
- [ ] Confirm `YOUTUBE_API_KEY` exists
- [ ] Confirm value is correct
- [ ] Confirm scope includes "Functions"

### Step 2: Trigger Redeploy
- [ ] Go to Deploys tab
- [ ] Click "Trigger deploy" → "Clear cache and deploy site"
- [ ] Wait for deployment to complete

### Step 3: Check Function Logs
- [ ] Go to Functions tab
- [ ] Click on `youtube/top`
- [ ] Check Logs tab for errors
- [ ] Look for API key confirmation message

### Step 4: Test Endpoint
```bash
curl https://cool-biscochitos-b96e4c.netlify.app/api/youtube/top?maxResults=3
```

### Step 5: Check Browser Console
- [ ] Open your site
- [ ] Open browser console (F12)
- [ ] Look for error messages
- [ ] Check Network tab for API calls

## Common Error Messages

### "YOUTUBE_API_KEY not configured"
**Fix:** Redeploy after setting environment variable

### "403 PERMISSION_DENIED"
**Possible causes:**
- API key is invalid
- YouTube Data API v3 not enabled in Google Cloud Console
- API key restrictions blocking the request

**Fix:**
1. Verify API key in Google Cloud Console
2. Ensure "YouTube Data API v3" is enabled
3. Check API key restrictions

### "404 Not Found"
**Fix:** 
- Check functions are deployed (Functions tab)
- Verify `netlify.toml` redirect rule
- Redeploy

## Quick Test Commands

```bash
# Test health endpoint (should work without API key)
curl https://cool-biscochitos-b96e4c.netlify.app/api/health

# Test YouTube endpoint (needs API key)
curl https://cool-biscochitos-b96e4c.netlify.app/api/youtube/top?maxResults=3

# Check response
# If you see {"success":true,"count":3,"data":[...]} → Working! ✅
# If you see {"success":false,"error":"..."} → Check error message
```

## Still Not Working?

1. **Check Function Logs:**
   - Functions tab → `youtube/top` → Logs
   - Look for specific error messages

2. **Check Build Logs:**
   - Deploys → Latest → View deploy logs
   - Look for function bundling errors

3. **Verify API Key:**
   - Test API key directly: https://console.cloud.google.com/
   - Ensure YouTube Data API v3 is enabled

4. **Try Manual Test:**
   ```bash
   # Test with curl to see exact error
   curl -v https://cool-biscochitos-b96e4c.netlify.app/api/youtube/top?maxResults=3
   ```

---

**Most common fix: Just redeploy after setting the environment variable!** 🚀

