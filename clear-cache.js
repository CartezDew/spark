/**
 * Clear Cache Script
 * Run this in browser console to clear all cached video data
 */

// Clear all Spark-related localStorage
console.log('🧹 Clearing Spark cache...');

const sparkKeys = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.startsWith('spark_')) {
    sparkKeys.push(key);
  }
}

sparkKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ Removed: ${key}`);
});

console.log(`🎉 Cache cleared! Removed ${sparkKeys.length} items.`);
console.log('🔄 Please refresh the page to load fresh videos.');
