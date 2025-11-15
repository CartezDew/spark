# 🚀 Quick Start - Auto-Fetch Popular Videos

Your Spark app now **automatically fetches the most popular trending videos** from YouTube!

## 🎯 Three Easy Ways to Get Real Videos

### Option 1: FREE - No API Key Needed (Recommended to Start!)

**Using Invidious (YouTube alternative API)** - Works immediately, no setup required!

1. Open `src/config/config.js`
2. Change this line:
   ```javascript
   apiMode: 'mock', // Change this
   ```
   To:
   ```javascript
   apiMode: 'invidious', // Real videos, no API key!
   ```
3. Save and refresh your app

**That's it!** You'll now see real trending YouTube videos automatically.

---

### Option 2: Official YouTube API (Best Quality)

**Get real YouTube data with full statistics**

1. **Get API Key** (5 minutes):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create project → Enable "YouTube Data API v3"
   - Create API Key

2. **Configure Your App**:
   Open `src/config/config.js`:
   ```javascript
   youtubeApiKey: 'YOUR_API_KEY_HERE', // Paste your key
   apiMode: 'youtube', // Use official API
   ```

3. **Done!** Your app will now fetch official YouTube trending videos.

---

### Option 3: Demo Mode (Testing)

Currently active by default - shows realistic mock data for testing.

```javascript
apiMode: 'mock', // Demo data
```

---

## ⚙️ Configuration Options

Edit `src/config/config.js` to customize:

```javascript
export const config = {
  // Choose your mode: 'invidious', 'youtube', or 'mock'
  apiMode: 'invidious', // 👈 Change this!
  
  // How many videos to load at once
  maxVideosPerLoad: 20,
  
  // Auto-refresh videos every 5 minutes
  autoRefreshInterval: 5 * 60 * 1000,
  
  // Default region for videos
  defaultRegion: 'US', // Options: 'US', 'GB', 'CA', 'IN', etc.
  
  // Cache videos to reduce API calls
  cacheDuration: 10 * 60 * 1000, // 10 minutes
};
```

---

## 🌍 How Regions Work

Your navigation tabs automatically fetch different content:

- **Company Profile** → US content
- **Regions** → GB (United Kingdom) content  
- **Nationwide** → US content

**To customize regions**, edit `src/components/Navigation.jsx`:

```javascript
const regionMap = {
  'profile': 'US',
  'regions': 'CA',  // Change to any country code
  'nationwide': 'US'
};
```

**Available regions**: US, GB, CA, AU, IN, DE, FR, JP, BR, MX, etc.

---

## 🎬 Features Now Working

✅ **Auto-fetches trending videos** from YouTube  
✅ **Updates automatically** every 5 minutes  
✅ **Region-based content** - Different videos per tab  
✅ **Smart caching** - Reduces API calls  
✅ **Fallback system** - Always shows content  
✅ **Error handling** - Graceful failures  
✅ **Loading states** - Beautiful animations  

---

## 🔥 Quick Commands

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Your app will open at http://localhost:5173
```

---

## 📱 Test It Out

1. **Start your app**: `npm run dev`
2. **Change mode to 'invidious'** in config.js
3. **Save the file** - app auto-reloads
4. **Watch real trending videos appear!**
5. **Click navigation tabs** - see different regional content

---

## 🐛 Troubleshooting

### "No videos found"
- Check your internet connection
- Try switching from 'mock' to 'invidious' mode
- Check browser console for errors

### "API quota exceeded" (YouTube API)
- You hit daily limit (10,000 units)
- Switch to 'invidious' mode temporarily
- Increase `cacheDuration` in config

### Videos load slowly
- Increase `cacheDuration` to cache longer
- Use 'mock' mode for faster testing
- Check your internet speed

### Invidious not working
- The service auto-tries backup servers
- If all fail, it falls back to mock data
- Try again in a few minutes

---

## 🎨 What You Can Customize

**Video Count**:
```javascript
maxVideosPerLoad: 50, // Load more videos
```

**Auto-refresh Frequency**:
```javascript
autoRefreshInterval: 15 * 60 * 1000, // Refresh every 15 minutes
```

**Disable Auto-refresh**:
```javascript
autoRefreshInterval: 0, // No auto-refresh
```

**Change Default Region**:
```javascript
defaultRegion: 'GB', // United Kingdom
```

---

## 🎯 Recommended Setup for Production

```javascript
export const config = {
  apiMode: 'invidious',           // Free, no API key needed
  maxVideosPerLoad: 30,            // More content
  autoRefreshInterval: 10 * 60 * 1000, // 10 min refresh
  cacheDuration: 15 * 60 * 1000,   // 15 min cache
  defaultRegion: 'US',             // Your target region
};
```

---

## 🚀 Ready to Go!

Your app is now configured to automatically fetch and display the most popular trending videos from YouTube. Just change the `apiMode` in `config.js` and you're live!

**Need help?** Check the full documentation in `README.md` and `YOUTUBE_SETUP.md`.

---

**Enjoy your viral video feed! 🎉**

