# 🏆 Leaderboard Feature Setup Guide

## ✅ What's Been Created

### Backend
1. **MongoDB Model** (`backend/models/UserPoints.js`)
   - Tracks user XP, badges, and progress across career categories
   - Auto-calculates total points
   - Badge system with 8 different badges
   - Weekly challenges and streak tracking

2. **API Routes** (`backend/routes/points.js`)
   - `POST /api/points/add` - Add points to a user
   - `GET /api/points/leaderboard` - Get global or category leaderboard
   - `GET /api/points/user/:userId` - Get individual user progress

3. **Server Integration** (`backend/server.js`)
   - MongoDB connection setup
   - Points routes integrated

### Frontend
1. **Points Service** (`src/services/pointsService.js`)
   - Functions to award points for watching videos, liking, quizzes
   - Leaderboard data fetching
   - User progress tracking

2. **Leaderboard Page** (`src/pages/Leaderboard.jsx`)
   - Global leaderboard view
   - Category-specific leaderboards
   - User progress dashboard
   - Badge statistics
   - Weekly challenge progress

3. **VideoCard Integration** (`src/components/VideoCard.jsx`)
   - Awards points when videos are watched
   - Awards points when videos are liked

4. **Navigation** (`src/components/Navigation.jsx`)
   - Leaderboard link added to nav bar

5. **Routing** (`src/main.jsx`, `src/App.jsx`)
   - React Router setup
   - `/leaderboard` route configured

## 🚀 Setup Instructions

### 1. Install MongoDB

**Option A: Local MongoDB**
```bash
# macOS
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string

### 2. Configure Backend Environment

Add to `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/spark
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spark?retryWrites=true&w=majority
```

### 3. Install Dependencies

Backend dependencies are already installed (mongoose was added).

### 4. Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Spark Backend Server running on http://localhost:3001
🏆 Points API: http://localhost:3001/api/points
```

### 5. Start Frontend

```bash
npm run dev
```

### 6. Test the Leaderboard

1. Open http://localhost:5173
2. Watch some videos (points are awarded automatically)
3. Like some videos (+3 points each)
4. Click the 🏆 Leaderboard link in the navigation
5. See your progress and rankings!

## 📊 How Points Work

### Points Awarded:
- **Watching Videos:**
  - 80%+ watched: 10 XP
  - 50-79% watched: 5 XP
  - 25-49% watched: 2 XP
  - <25% watched: 0 XP

- **Liking Videos:** 3 XP per like

- **Completing Quizzes:**
  - 90%+ score: 20 XP
  - 70-89% score: 15 XP
  - 50-69% score: 10 XP
  - <50% score: 5 XP

### Badges:
- 🎬 **First Watch** - Earn 10 points in any category
- 🎥 **Video Master** - Earn 100 points in a category
- 🗺️ **Category Explorer** - Earn 50+ points in 3+ categories
- ⚔️ **Week Warrior** - Earn 500 weekly points
- 🔥 **Streak King** - Maintain daily streak
- 🏆 **Career Champion** - Earn 1000 points in one category
- 📚 **Knowledge Seeker** - (Future)
- 💬 **Engagement Pro** - (Future)

## 🎨 Category Colors

- **Acting** - Yellow (#FFD700)
- **Directing** - Purple (#9B59B6)
- **Gaming** - Neon Green (#00FF00)
- **Animation & Visual Effects** - Turquoise (#1ABC9C)
- **Music** - Orange (#FF8C00)
- **Fashion** - Pink (#FF69B4)
- **Business & Management** - Blue (#3498DB)
- **Writing & Journalism** - Red (#E74C3C)
- **Sports** - Green (#2ECC71)
- **Film & Television** - Gold (#F39C12)

## 🔧 API Endpoints

### Add Points
```bash
POST /api/points/add
Body: {
  "userId": "user_123",
  "careerCategory": "Music",
  "points": 10,
  "reason": "video_watched"
}
```

### Get Leaderboard
```bash
GET /api/points/leaderboard?type=global&limit=50
GET /api/points/leaderboard?type=category&category=Music&limit=50
```

### Get User Progress
```bash
GET /api/points/user/user_123
```

## 🎯 Features

✅ **Global Leaderboard** - See top users by total XP  
✅ **Category Leaderboards** - Filter by career category  
✅ **User Progress Dashboard** - Your XP, badges, and streaks  
✅ **Progress Bars** - Visual progress for each career path  
✅ **Badge System** - 8 different achievement badges  
✅ **Weekly Challenges** - 500 XP weekly goal  
✅ **Streak Tracking** - Daily activity streaks  
✅ **Auto Points** - Points awarded automatically when watching/liking  

## 🚨 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `brew services list` (macOS)
- Check your `MONGODB_URI` in `backend/.env`
- For Atlas, ensure your IP is whitelisted

### Points Not Saving
- Check browser console for errors
- Verify backend is running on port 3001
- Check MongoDB connection in backend logs

### Leaderboard Empty
- Watch some videos first to earn points
- Check that points are being added (check browser console)
- Verify API endpoints are working

## 📝 Next Steps (Optional Enhancements)

1. **Quiz Integration** - Add quiz completion points
2. **Toast Notifications** - Show badge earned notifications
3. **User Profiles** - Expand user profile page
4. **Social Features** - Follow friends, compare progress
5. **Achievements** - More badge types and milestones
6. **Rewards** - Unlock content based on XP/badges

---

**The leaderboard feature is fully functional! Start watching videos to earn XP and climb the ranks! 🚀**

