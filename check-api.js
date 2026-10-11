// Quick API Check - Paste this in your browser console

console.clear();
console.log('🔍 Checking Spark API Status...\n');

async function checkAPI() {
  const url = 'https://cool-biscochitos-b96e4c.netlify.app/api/youtube/top?category=Music&regionCode=US&maxResults=3';
  
  console.log('📡 Testing:', url);
  console.log('⏳ Please wait...\n');
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📦 Response Data:', data);
    
    if (data.success && data.data && data.data.length > 0) {
      console.log('\n✅ SUCCESS! Real YouTube videos are loading!');
      console.log(`📹 Got ${data.data.length} videos`);
      console.log(`🎬 First video: "${data.data[0].title}"`);
      console.log('\n💡 Your app should be loading real videos now!');
    } else if (data.error) {
      console.log('\n❌ API ERROR:', data.error);
      console.log('📝 Message:', data.message || 'No message');
      console.log('\n🔧 FIX: You need to add YOUTUBE_API_KEY to Netlify');
      console.log('👉 Go to: https://app.netlify.com/sites/cool-biscochitos-b96e4c/configuration/env');
      console.log('👉 Add: YOUTUBE_API_KEY = your_youtube_api_key');
      console.log('👉 Then redeploy your site');
    } else {
      console.log('\n⚠️ UNEXPECTED RESPONSE');
      console.log('The API returned data but not in the expected format');
    }
  } catch (error) {
    console.log('\n❌ FETCH ERROR:', error.message);
    console.log('The API request failed completely');
  }
}

checkAPI();
