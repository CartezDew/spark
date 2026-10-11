# Spark: Career Discovery Platform

## 🌟 Project Overview

**Spark** is an innovative career discovery platform designed to help young people aged 14-24 explore creative industry careers through an engaging, TikTok-style video experience. The platform connects students with real-world career content through dynamic video feeds, gamification, and personalized recommendations.

## 💡 Inspiration & Mission

### The Story Behind Spark

Our project was inspired by the story of **Tony and Denise'ann**, New Look staff members who experienced the transformative benefits of participating in New Look's programming when they were young. They emphasized that the program made the biggest difference in their careers by **"getting them in the room"** and helping them understand the vast possibilities available in creative industries.

Their story highlighted a critical challenge: **many young people don't know what career paths exist** or how to access them. Traditional career exploration methods often fail to capture the attention of today's youth, who are accustomed to dynamic, short-form content.

### The Challenge

New Look already hosts successful programs, including:
- **Annual Youth Summit**: A yearly gathering where students receive leadership training, advisement, and entertainment
- **Summer Programs**: Hands-on creative experiences
- **School Partnerships**: Collaborations with local high schools (including Atlanta High School partnerships)

Our challenge was to:
1. **Narrow down our approach** to complement (not duplicate) existing programs
2. **Seamlessly integrate** technology into New Look's activities
3. **Empower students** to take ownership of their career discovery journey
4. **Scale the impact** of "getting students in the room" beyond physical events

### Our Solution

Rather than creating another talent show (which already exists within New Look's summit), we developed **Spark** as a digital platform that:
- Brings career discovery to students wherever they are
- Uses familiar social media patterns (TikTok-style scrolling) to engage youth
- Leverages real-world content from YouTube and Twitch to show authentic career paths
- Gamifies the learning experience to maintain engagement
- Uses AI to personalize content based on individual interests

**The vision**: Students can explore careers through Spark, gain points and badges, and use this platform to **organize and lead New Look's summit themselves**, further using their "spark" to inspire others.

---

## 🎯 How Spark Works

### Core Features

#### 1. **TikTok-Style Video Feed**
- **Vertical scrolling interface** optimized for mobile and desktop
- **Short-form videos** (typically 30 seconds to 3 minutes) showcasing different careers
- **Snap-scroll behavior** ensures one video is in focus at a time
- **Auto-play functionality** when videos enter the viewport
- **Continuous content loading** with infinite scroll

#### 2. **Career Categories**

Spark organizes content into six primary career paths:

| Category | Example Careers | Color Code |
|----------|----------------|------------|
| **Business & Management** | Talent Manager, Event Coordinator, Marketing Manager, Producer | Blue (#3498DB) |
| **Animation & Visual Effects** | 3D Animator, VFX Artist, Motion Graphics Designer, Concept Artist | Turquoise (#1ABC9C) |
| **Writing & Journalism** | Content Creator, Scriptwriter, Entertainment Journalist, Publicist | Red (#E74C3C) |
| **Music** | Music Producer, Audio Engineer, Songwriter, DJ | Orange (#FF8C00) |
| **Sports** | Sports Broadcaster, Athletic Trainer, Sports Marketing, Event Coordinator | Green (#2ECC71) |
| **Film & Television** | Director, Cinematographer, Editor, Actor, Set Designer | Gold (#F39C12) |

#### 3. **Inline Career Shorts**
- **Horizontal swipeable shorts** appear every 8 videos in the main feed
- **10 shorts per section** focused on specific career skills
- **Category-specific content** (e.g., "Film & Television Shorts" when user is watching film content)
- Quick career tips, tutorials, and "day in the life" glimpses

---

## 🔌 API Integration & Content Sources

### YouTube Data API v3 Integration

Spark integrates with **YouTube Data API v3** to fetch high-quality career content:

#### Backend Implementation (`backend/routes/api.js`)
```javascript
// Two-step process for quality results
1. Search Query → Get Video IDs
2. Video Details → Get full metadata (views, thumbnails, statistics)
```

#### Features:
- **Search by keyword** with configurable queries
- **Most popular videos** using YouTube's chart rankings
- **Filtered by region** (defaults to US, supports worldwide)
- **Engagement metrics**: View counts, like counts, comment counts
- **Thumbnail optimization**: Multiple resolution options (default, medium, high, maxres)
- **Rate limiting protection**: Configurable requests per minute
- **Error handling**: Graceful fallbacks when API limits are reached

#### Customizable Filters:
- **Career-specific queries**: Automatically searches for "career", "day in the life", "how to become"
- **Relevance ranking**: YouTube's algorithm prioritizes educational content
- **Video length**: Targets 1-5 minute videos for optimal engagement
- **Freshness**: Prioritizes recent content (last 6-12 months)
- **Language**: Filters for English content

### Twitch Helix API Integration

Spark also integrates **Twitch Helix API** to show live streaming careers:

#### Backend Implementation (`backend/routes/api.js`)
```javascript
// OAuth 2.0 Client Credentials Flow
1. Obtain App Access Token
2. Auto-refresh before expiry
3. Fetch top live streams
```

#### Features:
- **Live content**: Shows careers in action (gaming, music production, art creation)
- **Viewer metrics**: Real-time viewer counts
- **Category filtering**: Filter by game/category (optional `?game=` parameter)
- **Global discovery**: Browse top streams worldwide
- **Stream thumbnails**: Dynamic 320x180 thumbnail generation
- **OAuth token management**: Automatic refresh for uninterrupted service

#### Use Cases:
- **Gaming Industry Careers**: Streamers, content creators, esports coordinators
- **Music Production**: Live beat-making, DJ sessions
- **Creative Arts**: Digital art, animation processes
- **Talk Shows**: Career advice streams, industry Q&As

---

## 🤖 AI-Powered Personalization

### User Behavior Tracking (`src/services/userBehaviorTracker.js`)

Spark implements an **AI recommendation engine** that learns from user behavior:

#### Tracked Metrics:
1. **Watch Time**: How long users watch each video (percentage completion)
2. **Likes**: Videos users explicitly like
3. **Replays**: Videos users rewatch
4. **Scroll Patterns**: How quickly users scroll past content
5. **Category Engagement**: Which career paths users explore most
6. **Comments/Reactions**: Engagement signals (placeholder for future implementation)

#### Smart Recommendations:
```javascript
Algorithm Logic:
- User watches 3+ videos in same category back-to-back
  → Increase priority for that category (70% weight)
- User watches <25% of a video
  → Deprioritize similar content
- User likes or replays video
  → Boost similar career paths
- User has no clear preference
  → Rotate randomly through all categories
```

#### Adaptive Feed:
- **First 10 videos**: Random mix to establish baseline preferences
- **After engagement patterns emerge**: 70% preferred category, 30% exploratory
- **Streak detection**: 3+ consecutive watches in one category triggers preference
- **Reset mechanism**: Users can clear preferences to start fresh

### Content Fetcher (`src/services/youthContentFetcher.js`)

The content fetcher intelligently sources videos:

#### Features:
- **100+ videos pre-loaded** to ensure smooth infinite scroll
- **Category rotation**: Ensures diverse exposure
- **Career-specific titles**: Curated list of 60+ career video titles
- **Mock data support**: Development/demo mode with realistic placeholders
- **Dynamic career detection**: Automatically categorizes content by keywords
- **Local artist highlighting**: Special flags for school partnerships (e.g., Atlanta High School students)

---

## 🏆 Gamification & Leaderboards

### XP Points System

Users earn experience points (XP) through various actions:

| Action | XP Reward | Notes |
|--------|-----------|-------|
| Watch 25% of video | 2 XP | Minimum engagement |
| Watch 50% of video | 5 XP | Moderate engagement |
| Watch 75%+ of video | 10 XP | High engagement |
| Like a video | 3 XP | Explicit interest signal |
| Complete daily challenge | 10-30 XP | Varies by challenge |
| Maintain streak | 10 XP/day | Consecutive day bonus |

### Badge System

**8 Achievement Badges** to unlock:

1. **🎬 First Watch** - Watch your first video (10 XP threshold)
2. **🎥 Video Master** - Watch 10+ videos (100 XP threshold)
3. **🗺️ Category Explorer** - Explore 3+ categories (requires diverse engagement)
4. **⚔️ Week Warrior** - Earn 500+ XP in one week
5. **🔥 Streak King** - Maintain 7+ day login streak
6. **🏆 Career Champion** - Earn 500+ total XP
7. **📚 Knowledge Seeker** - Complete 5+ daily challenges
8. **💬 Engagement Pro** - High interaction rate (likes, comments, replays)

### Leaderboard Types

#### **Nationwide Leaderboard**
- Shows top users across the entire platform
- Ranks by **total XP** across all categories
- Displays:
  - User rank (🥇🥈🥉 or numeric)
  - Profile avatar (from headshots)
  - Screen name
  - Total XP
  - Top category
  - Badges earned
  - Current streak

#### **Category Leaderboards**
- Separate rankings for each career path
- Shows who's leading in specific industries
- Helps users find like-minded peers

#### **Regional Leaderboards** (Planned)
- School-specific rankings (e.g., Atlanta High School Partnerships)
- City/region-based competition
- Local artist spotlights

### Daily Challenges

**5 Rotating Challenges** to encourage engagement:

1. **Watch 5 Videos** - Watch at least 5 career discovery videos (25 XP)
2. **Like 3 Videos** - Show appreciation for content (15 XP)
3. **Explore a Category** - Watch videos from 3 different career paths (30 XP)
4. **Complete a Quiz** - Test your knowledge (20 XP) [Placeholder]
5. **Maintain Your Streak** - Come back tomorrow (10 XP)

Challenges reset daily and encourage consistent platform usage.

---

## 🎨 User Interface & Design

### Navigation

**Simplified Navigation Bar**:
- **Spark Logo**: Branding with "CAREER DISCOVERY" badge
- **Feed Tab**: Appears only on leaderboard page (returns to main feed)
- **🏆 Leaderboard**: Access rankings and progress
- **User Avatar**: Profile picture from headshots

### Main Video Feed

**Design Principles**:
- **Full-screen immersive experience**: Videos take up entire viewport
- **Minimal distractions**: Controls fade out during viewing
- **Smooth animations**: Scroll-snap creates TikTok-like feel
- **Mobile-first**: Optimized for vertical phone screens
- **Responsive**: Adapts to tablets and desktops

**Video Card Components**:
- **Thumbnail/Video Player**: Embedded YouTube iframes with autoplay
- **Video Information Overlay**:
  - Career category badge (color-coded)
  - Channel name
  - View count
  - Upload date
- **Interaction Buttons**:
  - ❤️ Like button (toggleable, tracked for XP)
  - 🔁 Replay button
  - 💬 Comment button (placeholder)
  - 📤 Share button (placeholder)

### Career Insights Sidebar (Desktop)

**Desktop-only feature** showing real-time insights:
- **Top 3 trending careers** based on view counts
- **Career category distribution** pie chart
- **Your interest tags** based on watch history
- **Recommended next steps** (resources, courses, events)

---

## 📊 Data Flow & Architecture

### Frontend (React + Vite)

**Tech Stack**:
- **React 18**: Functional components with hooks
- **React Router**: Client-side routing (`/`, `/leaderboard`)
- **Axios**: HTTP requests to backend APIs
- **Local Storage**: User behavior tracking, preferences, IDs
- **CSS Modules**: Scoped styling per component

**Key Services**:
1. **`videoFetcher.js`**: Manages API mode switching (YouTube/Twitch/Mock)
2. **`youthContentFetcher.js`**: Generates career-focused content queries
3. **`aiRecommendationEngine.js`**: Personalizes video feed order
4. **`userBehaviorTracker.js`**: Records interactions, calculates preferences
5. **`pointsService.js`**: Handles XP, badges, leaderboard API calls

### Backend (Node.js + Express)

**API Endpoints**:

#### YouTube API Routes
- `GET /api/youtube/top`: Fetch top YouTube videos
  - Query params: `?q=search_query&maxResults=20`
  - Returns: Clean JSON with title, thumbnail, views, channel, videoId

#### Twitch API Routes
- `GET /api/twitch/top`: Fetch top Twitch streams
  - Query params: `?game=game_name&limit=20`
  - Returns: Clean JSON with title, thumbnail, viewers, streamId

#### Points/Leaderboard API Routes
- `POST /api/points/add`: Award XP to user
- `GET /api/points/leaderboard`: Get nationwide/category rankings
- `GET /api/points/user/:id`: Get individual user progress
- `GET /api/points/challenges`: Get daily challenges
- `POST /api/points/challenges/update`: Update challenge progress
- `POST /api/points/seed`: Populate leaderboard with demo data

### Database (MongoDB)

**Collections**:

1. **UserPoints**: Stores user XP and progress
   ```javascript
   {
     userId: String,
     screenName: String,
     careerCategory: String,
     points: Number,
     badges: [String],
     streak: Number,
     weeklyPoints: Number,
     lastActivity: Date
   }
   ```

2. **DailyChallenge**: Defines available challenges
   ```javascript
   {
     challengeId: String,
     title: String,
     description: String,
     pointsReward: Number,
     actionType: String,
     targetValue: Number,
     date: Date
   }
   ```

3. **UserChallenge**: Tracks user challenge progress
   ```javascript
   {
     userId: String,
     challengeId: String,
     progress: Number,
     completed: Boolean,
     completedAt: Date
   }
   ```

---

## 🔐 Security & Environment Setup

### Environment Variables

**Backend (`.env`)**:
```bash
# YouTube Data API v3
YOUTUBE_API_KEY=your_youtube_api_key_here

# Twitch Helix API
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret

# MongoDB
MONGODB_URI=mongodb://localhost:27017/spark
# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spark

# Server
PORT=3001
NODE_ENV=development
```

**Frontend (`.env.local`)**:
```bash
# API Mode: 'backend' for live APIs, 'mock' for development
VITE_API_MODE=mock

# Backend URL (optional, defaults to Netlify backend)
VITE_BACKEND_API_URL=http://localhost:3001/api
```

### API Key Management

**Security Best Practices**:
1. ✅ **Never expose API keys in frontend code**
2. ✅ **Backend proxy pattern**: Frontend → Backend → External APIs
3. ✅ **Environment variables**: Keys stored in `.env` files (gitignored)
4. ✅ **Rate limiting**: Backend throttles requests to prevent quota exhaustion
5. ✅ **CORS configuration**: Restricts API access to authorized domains
6. ✅ **Mock mode**: Allows development without consuming API quotas

---

## 🚀 Deployment

### Local Development

```bash
# 1. Install dependencies
npm install
cd backend && npm install

# 2. Set up environment variables
# Create .env in /backend with YouTube, Twitch, MongoDB keys
# Create .env.local in / with VITE_API_MODE=mock

# 3. Start MongoDB (if using local database)
mongod

# 4. Start backend server
cd backend
npm start
# Backend runs on http://localhost:3001

# 5. Start frontend dev server
npm run dev
# Frontend runs on http://localhost:5173
```

### Production Deployment

**Frontend**: Netlify (Static Site)
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: Set in Netlify dashboard

**Backend**: Railway / Render (Node.js Server)
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: Set in platform dashboard

**Database**: MongoDB Atlas (Cloud Database)
- Managed MongoDB cluster
- Connection string in `MONGODB_URI` environment variable

---

## 🎓 Integration with New Look Programs

### Summer Program Integration

**How Spark Complements Summer Activities**:
- **Pre-program**: Students explore careers before attending
- **During program**: Track learning through XP and badges
- **Post-program**: Continue engagement year-round
- **Portfolio building**: XP scores show dedication to career exploration

### School Partnership Integration

**Atlanta High School Partnerships**:
- **School-specific leaderboards**: Compete within your school
- **Local artist features**: Highlight student/alumni work
- **Career days**: Use Spark to introduce industries before guest speakers
- **Assignment integration**: Teachers can assign "Watch 5 Animation videos" for homework

### Youth Summit Enhancement

**Student-Led Summit Vision**:

Instead of creating a separate talent show, Spark enables students to **organize and lead the New Look Youth Summit**:

1. **Summit Planning Committee**: Top leaderboard users earn roles in planning
2. **Content Curation**: Students select which careers to spotlight based on Spark data
3. **Peer Presentations**: High-XP students share career insights they've learned
4. **Gamified Attendance**: Summit participants earn bonus XP and exclusive badges
5. **Alumni Connection**: Former participants (like Tony and Denise'ann) featured in videos

**Benefits**:
- ✅ **Student ownership**: Youth lead the summit, not just attend
- ✅ **Data-driven**: Spark analytics show which careers students care about most
- ✅ **Year-round engagement**: Not limited to annual event
- ✅ **Scalable**: Digital platform reaches students who can't attend in person
- ✅ **Measurable impact**: XP tracking shows career exploration progress

---

## 📈 Success Metrics

### Engagement Metrics
- **Daily Active Users (DAU)**: Students returning daily
- **Average Session Length**: Time spent exploring careers
- **Videos Watched per Session**: Depth of engagement
- **Category Diversity**: Are students exploring multiple paths?
- **Completion Rate**: Percentage of videos watched fully

### Learning Outcomes
- **Career Awareness**: Did students learn about new careers?
- **Interest Identification**: Can students articulate preferred paths?
- **Confidence**: Do students feel more prepared for career decisions?

### Program Integration
- **Summer Program Participation**: Correlation with Spark usage
- **Summit Attendance**: Do Spark users attend events?
- **School Partnership Engagement**: Usage across partner schools

---

## 🔮 Future Enhancements

### Planned Features

1. **Live Streaming Integration**
   - Host live Q&A sessions with professionals
   - Virtual career fairs through Twitch integration
   - Student-led workshops streamed on platform

2. **Social Features**
   - Follow other users exploring similar careers
   - Share videos with friends
   - Comment threads with moderation

3. **Advanced Personalization**
   - Machine learning model for better recommendations
   - Career quiz to establish baseline interests
   - Integration with career assessment tools

4. **Educational Resources**
   - Curated playlists by industry professionals
   - Downloadable career guides
   - College/training program directories

5. **Mentor Matching**
   - Connect students with New Look alumni
   - Industry professional mentorship
   - Peer mentorship (older students → younger students)

6. **Analytics Dashboard (For New Look Staff)**
   - View platform usage statistics
   - Identify trending careers
   - Track student progress across programs
   - Generate reports for funders/stakeholders

---

## 🤝 Contributing & Feedback

### For New Look Staff
- **Content Curation**: Suggest YouTube channels to feature
- **Challenge Ideas**: Propose new daily challenges
- **Partnership Opportunities**: Connect with industry partners for exclusive content

### For Students
- **Feature Requests**: What would make Spark more useful?
- **Bug Reports**: Help us improve the experience
- **Success Stories**: Share how Spark helped your career exploration

### For Developers
- **Code Contributions**: Submit pull requests for new features
- **API Integrations**: Add new content sources (Instagram Reels, TikTok API)
- **Accessibility**: Improve screen reader support, keyboard navigation

---

## 📞 Contact & Support

**Project Team**: [Your Team Name]  
**Partner Organization**: New Look  
**Technical Questions**: [Your Email]  
**Program Integration**: [New Look Contact]

---

## 📝 License & Attribution

This project uses:
- **YouTube Data API v3**: [Google Terms of Service](https://developers.google.com/youtube/terms/api-services-terms-of-service)
- **Twitch Helix API**: [Twitch Developer Agreement](https://www.twitch.tv/p/legal/developer-agreement/)
- **MongoDB**: [MongoDB Atlas Terms](https://www.mongodb.com/legal/terms-of-use)

All career content rights belong to original creators. Spark is an educational discovery tool.

---

## 🌟 Conclusion

**Spark** transforms career discovery from a daunting question ("What do you want to be?") into an engaging exploration ("What sparks your interest?").

By leveraging the content consumption habits of Gen Z (short-form video, gamification, social competition), we make career exploration feel less like homework and more like entertainment.

Just as Tony and Denise'ann found their spark through New Look's programs, Spark ensures that **every student can get "in the room"** with hundreds of careers—wherever they are, whenever they're ready.

**The result**: More young people discovering careers they never knew existed, building confidence to pursue creative industries, and ultimately, finding their spark. ✨

---

*Last Updated: November 2024*  
*Version: 1.0*  
*Built with ❤️ for New Look and the next generation of creative professionals*

