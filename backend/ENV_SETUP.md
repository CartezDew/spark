# Environment Variables Setup

Create a `.env` file in the `backend/` directory with the following:

```env
# YouTube Data API v3
YOUTUBE_API_KEY=your_youtube_api_key_here

# Twitch API
TWITCH_CLIENT_ID=your_twitch_client_id_here
TWITCH_CLIENT_SECRET=your_twitch_client_secret_here

# Server
PORT=3001
NODE_ENV=development
```

## Getting API Keys

### YouTube API Key
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Go to Credentials → Create Credentials → API Key
5. Copy the key to `YOUTUBE_API_KEY`

### Twitch Credentials
1. Visit [Twitch Developers](https://dev.twitch.tv/)
2. Sign in and go to "Your Console"
3. Click "Register Your Application"
4. Fill in:
   - Name: Spark App
   - OAuth Redirect URLs: http://localhost:3001
   - Category: Website Integration
5. Copy Client ID to `TWITCH_CLIENT_ID`
6. Click "New Secret" and copy to `TWITCH_CLIENT_SECRET`

