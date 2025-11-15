# 🎯 Spark Career Discovery Platform

**"Netflix for your Future" | "TikTok for Career Discovery"**

Spark is a TikTok-style career discovery web app that helps youth (ages 14-24) discover creative industry careers through short-form videos. The AI learns from every interaction to curate a personalized feed that reveals hidden career matches.

## ✨ Core Concept

> "Every video you watch teaches the app what you vibe with. If you stay longer on 'How to Become a Choreographer,' the app knows you're into dance. If you skip dance but watch a lot of 'Behind the Scenes of a Music Video Set,' it knows you might like directing or production."

**Exposure → Exploration → Experience** in ONE platform.

## 🚀 Key Features

### 1. **AI-Powered Learning System**

The app tracks and learns from:
- ✅ **Watch Time** - How long you watch each video
- ✅ **Scroll Patterns** - Which videos you skip vs. engage with
- ✅ **Likes** - Videos you heart
- ✅ **Replays** - Content you watch multiple times
- ✅ **Reactions** - "Inspired" button clicks
- ✅ **Comments** - Optional engagement

### 2. **Personalized Feed Curation**

The AI automatically:
- Scores videos based on your interests
- Prioritizes content matching your career interests
- Mixes recommendations (60% top matches, 20% diverse, 20% local artists)
- Prevents filter bubbles with diverse content
- Shows recommendation reasons ("Matches your interest in Music Production")

### 3. **Youth-Focused Content (Ages 14-24)**

Automatically fetches:
- Trending music videos
- Behind-the-scenes content
- Career discovery videos
- Local artist features
- Creative industry content

### 4. **Local Artist Discovery**

Features artists from:
- Selected school regions
- Atlanta area (if applicable)
- Regional music scenes
- School-specific content

### 5. **Career Categories**

Focuses on creative careers:
- 🎵 Music Production
- 💃 Dance & Choreography
- 🎬 Filmmaking
- ✂️ Video Editing
- 🎤 Rap & Hip Hop
- 🎨 Creative Direction
- 📹 Video Production
- 💼 Music Business

## 🎨 User Interface

### Navigation Bar
- **Company Profile** - Company information
- **Regions** - Select school regions (Atlanta High School Partnerships, etc.)
- **Nationwide** - National content
- **User Icon** - Profile access

### Video Feed
- TikTok-style vertical scrolling
- Auto-play when in view
- Snap-to-center behavior
- Career discovery badges
- Local artist indicators

### Career Insights Panel
- **Bottom-right corner** - Expandable insights widget
- Shows top career interests
- Interest score percentages
- Career suggestions
- Real-time updates as you watch

### Video Actions
- **❤️ Like** - Tracks interest (turns red when liked)
- **🔄 Replay** - Watch again (tracks replays)
- **✨ Inspired** - React to content
- **📤 Share** - Share videos

## 🧠 How the AI Works

### Interest Scoring

Each career category gets an interest score (0-100) based on:

1. **Watch Time** (25 points)
   - Watched >70% of video = high engagement
   - Watched <10% and quickly scrolled = skipped

2. **Likes** (10 points per like)
   - Direct interest indicator

3. **Replays** (15 points per replay)
   - Strong interest signal

4. **Reactions** (8 points per positive reaction)
   - Emotional engagement

5. **Comments** (12 points per comment)
   - High engagement indicator

### Recommendation Algorithm

1. **Score Videos** - Each video gets a recommendation score
2. **Match Interests** - Videos matching user interests get boosted
3. **Local Boost** - Local artist content gets +15 points
4. **Engagement Boost** - Previously engaged content gets +30 points
5. **Diversity Mix** - Ensures variety to prevent filter bubbles

### Feed Composition

- **60%** Top recommendations (highest scores)
- **20%** Diverse content (different categories)
- **20%** Local artists (from user's region)

## 📊 Career Discovery Flow

```
User watches video
    ↓
AI tracks behavior
    ↓
Interest scores update
    ↓
Feed re-curates
    ↓
New recommendations appear
    ↓
Career insights update
```

## 🎯 Example Scenarios

### Scenario 1: Discovering Dance
1. User watches "How to Become a Choreographer"
2. User watches 80% of video (high engagement)
3. User likes the video
4. AI increases "dance" interest score
5. Feed shows more dance/choreography content
6. Career Insights shows "You're showing strong interest in Dance & Choreography!"

### Scenario 2: Music Production Interest
1. User watches multiple "Music Production" videos
2. User replays a beat-making tutorial
3. User clicks "Inspired" on studio session video
4. AI boosts "music_production" interest
5. Feed prioritizes music production content
6. Local Atlanta producer videos appear

### Scenario 3: Exploring Multiple Paths
1. User watches dance, music, and filmmaking content
2. AI tracks all three interests
3. Feed mixes content from all three
4. Career Insights shows top 3 interests
5. User discovers connections between careers

## 🔧 Technical Implementation

### Services

1. **`youthContentFetcher.js`**
   - Fetches content for ages 14-24
   - Targets local artists
   - Includes career discovery queries

2. **`userBehaviorTracker.js`**
   - Tracks all user interactions
   - Stores data in localStorage
   - Calculates interest scores

3. **`aiRecommendationEngine.js`**
   - Scores videos for user
   - Curates personalized feed
   - Provides career insights

### Data Storage

- **localStorage** - User behavior data
- **In-memory** - Current session data
- **Persistent** - Survives page refreshes

## 🎨 UI Features

### Recommendation Badges
- **✨ Spark Badge** - Shows why video was recommended
- **🎵 Local Artist Badge** - Highlights local content

### Career Insights Widget
- Expandable panel
- Real-time interest scores
- Visual progress bars
- Career descriptions

### Video Actions
- Color-coded buttons
- Liked state (red)
- Replay counter
- Reaction tracking

## 🚀 Getting Started

1. **Start the app**: `npm run dev`
2. **Watch videos** - Scroll through the feed
3. **Interact** - Like, replay, react to content
4. **Check insights** - Click the Career Discovery widget
5. **Explore regions** - Select school regions for local content

## 📈 Future Enhancements

- [ ] Backend API for advanced ML
- [ ] Career path recommendations
- [ ] Connect with industry professionals
- [ ] Job/internship opportunities
- [ ] Skill development resources
- [ ] Community features
- [ ] Progress tracking
- [ ] Career quizzes

## 🎓 For Youth

**This app is designed for you!**

- No sign-up required (works immediately)
- Privacy-focused (data stays local)
- Discover careers you never knew existed
- See real people doing real creative work
- Find your passion through exploration

**Every scroll, every like, every replay helps the app understand what sparks your interest.**

---

**Built with ❤️ for the next generation of creatives**

