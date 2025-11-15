# 🏫 Regions & Schools Feature Guide

Your Spark app now includes a comprehensive regions dropdown with schools organized by geographic areas!

## 🎯 How It Works

### Accessing Regions

1. **Click the "Regions" tab** in the navigation bar
2. A beautiful dropdown modal will appear showing all available regions
3. **Select a region** to see all schools in that area
4. **Click on a school** to filter content for that specific school

### Available Regions

#### 🏛️ Atlanta High School Partnerships
This is the main region containing all 28 schools from your list:
- BEST Academy High School
- Campbell High School
- Chapel Hill High School
- Charles Drew High School
- Charles R Drew Charter School
- Columbia High School
- DeKalb School of the Arts
- Douglas County High School
- Elite Scholars Academy
- Genesis Innovation Academy
- Georgia Cyber Academy
- Hillgrove High School
- Jonesboro High School
- Kennesaw Mountain High School
- KIPP Atlanta Collegiate
- Marietta High School
- Mundy's Mill High School
- North Atlanta High School
- North Cobb High School
- North Springs High School
- Phillips Exeter High School
- Riverwood International Charter School
- Rockdale County High School
- Salem High School
- St. Anne Pacelli Catholic School
- The Paideia School
- Westlake High School
- Woodward Academy

#### Additional Regions
- **Metro Atlanta North** - 8 schools
- **Metro Atlanta South** - 6 schools
- **Metro Atlanta East** - 7 schools
- **Metro Atlanta West** - 6 schools
- **Greater Georgia** - 5 schools

## ✨ Features

### 🔍 Search Functionality
- **Search regions** by name
- **Search schools** within a selected region
- Real-time filtering as you type

### 📱 Responsive Design
- Works perfectly on desktop and mobile
- Touch-friendly interface
- Smooth animations

### 🎨 Beautiful UI
- Modern gradient backgrounds
- Smooth transitions
- Clear visual hierarchy
- Easy navigation with back button

## 🛠️ Customization

### Adding More Schools

Edit `src/data/schools.js`:

```javascript
export const schoolRegions = {
  'Your New Region': {
    name: 'Your New Region',
    schools: [
      'School 1',
      'School 2',
      'School 3'
    ]
  }
};
```

### Adding More Regions

Simply add a new entry to the `schoolRegions` object in `src/data/schools.js`.

### Customizing Region Names

Change the region names in `src/data/schools.js` to match your needs.

## 📋 Usage Flow

1. **User clicks "Regions" tab**
   - Dropdown opens showing all regions

2. **User selects "Atlanta High School Partnerships"**
   - View switches to show all 28 schools
   - Can search for specific schools

3. **User clicks on a school (e.g., "Woodward Academy")**
   - Dropdown closes
   - Videos refresh for that school's region
   - Selected school is stored in app state

4. **Videos update**
   - Video feed automatically loads content for the selected region
   - School name is logged to console for debugging

## 🎬 Integration with Video Feed

When a school is selected:
- The `onSchoolChange` callback is triggered
- The `currentRegion` state is updated
- The `VideoFeed` component receives the new region
- Videos are automatically refreshed

## 🔧 Technical Details

### Components

- **`RegionsDropdown.jsx`** - Main dropdown component
- **`Navigation.jsx`** - Updated to handle region selection
- **`schools.js`** - Data file containing all regions and schools

### State Management

- `selectedRegion` - Currently selected region name
- `selectedSchool` - Currently selected school name
- `showRegionsDropdown` - Controls dropdown visibility

### Props Flow

```
App.jsx
  ├─ Navigation
  │   ├─ onTabChange
  │   ├─ onRegionChange
  │   └─ onSchoolChange
  └─ VideoFeed
      ├─ region
      └─ school
```

## 🎨 Styling

All styles are in:
- `src/components/RegionsDropdown.css` - Dropdown styles
- `src/components/Navigation.css` - Navigation updates

## 🚀 Future Enhancements

Potential additions:
- [ ] School-specific video playlists
- [ ] Region-based video recommendations
- [ ] School profile pages
- [ ] Multi-select for multiple schools
- [ ] Favorites/bookmarks
- [ ] Recent selections history

## 📝 Notes

- The dropdown automatically closes when clicking outside
- Selected region is displayed in the Regions tab
- All interactions are logged to console for debugging
- The component is fully accessible with keyboard navigation

---

**Enjoy exploring your regions and schools! 🎓**

