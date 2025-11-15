# 🚨 SECURITY FIX REQUIRED - API Key Exposed

Your YouTube API key was exposed in GitHub. Follow these steps IMMEDIATELY:

## Step 1: Revoke the Exposed API Key

1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials
2. Find your current API key (ending in ...CE9A)
3. Click the **Delete** button (trash icon) to revoke it
4. Confirm deletion

**Why?** Anyone who found your key on GitHub can use it, potentially:
- Exhausting your API quota
- Getting your key banned
- Incurring costs if you have billing enabled

## Step 2: Generate a NEW API Key

1. In Google Cloud Console, click **+ CREATE CREDENTIALS**
2. Select **API Key**
3. Copy the new key immediately
4. Click **RESTRICT KEY** (very important!)
5. Under "API restrictions":
   - Select "Restrict key"
   - Choose **YouTube Data API v3** only
6. Under "Application restrictions" (optional but recommended):
   - Select "HTTP referrers (websites)"
   - Add: `https://cool-biscochitos-b96e4c.netlify.app/*`
   - Add: `http://localhost:5173/*` (for local dev)
7. Click **SAVE**

## Step 3: Update Netlify Environment Variables

1. Go to: https://app.netlify.com/sites/cool-biscochitos-b96e4c/configuration/env
2. Find `YOUTUBE_API_KEY`
3. Click **Edit** → Delete the old key
4. Paste your NEW API key
5. Make sure scope is set to **"Functions"** or **"All scopes"**
6. Click **Save**

## Step 4: Create Local .env File (NOT committed to Git)

```bash
cd /Users/cartezdewberry/Spark/backend
echo "YOUTUBE_API_KEY=YOUR_NEW_KEY_HERE" > .env
```

Replace `YOUR_NEW_KEY_HERE` with your actual new key.

## Step 5: Clean Up Documentation Files

The old API key appears in these files:
- FINAL_NETLIFY_SETUP.md
- DEBUG_NETLIFY.md
- IMMEDIATE_ACTION.md
- DEPLOY_NOW.md
- NETLIFY_FUNCTIONS_SETUP.md
- RAILWAY_DEPLOY.md
- IMMEDIATE_FIX.md
- DEPLOYMENT_CHECKLIST.md
- PRODUCTION_SETUP.md
- QUICK_FIX_NETLIFY.md

I'll help you remove the key from these files.

## Step 6: Deploy Updated Code

```bash
cd /Users/cartezdewberry/Spark
git add .gitignore .env.example backend/.env.example
git commit -m "Security: Add .env to .gitignore and create .env.example templates"
git push origin main
```

## Step 7: Trigger Netlify Deploy

1. Go to: https://app.netlify.com/sites/cool-biscochitos-b96e4c/deploys
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait 3-4 minutes
4. Test: https://cool-biscochitos-b96e4c.netlify.app

## ✅ Verification

After completing all steps, test:
```bash
curl https://cool-biscochitos-b96e4c.netlify.app/api/youtube/top?maxResults=3
```

Should return videos (not 403 error).

---

## 🔒 Future Prevention

- ✅ .env files are now in .gitignore
- ✅ .env.example templates created (safe to commit)
- ✅ Never commit actual API keys
- ✅ Use Netlify environment variables for production
- ✅ Restrict API keys in Google Cloud Console

