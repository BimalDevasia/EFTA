// Test complete user journey for featured products
require('dotenv').config();
const fs = require('fs');

// Define the base URL with proper port
const BASE_URL = 'http://localhost:3000';

async function testUserJourney() {
  console.log('Testing Complete User Journey...\n');
  
  try {
    // Test 1: Home page featured section
    console.log('1. Testing Home Page Featured Section API Call:');
    const featuredResponse = await fetch(`${BASE_URL}/api/products?category=personalisedGift&visible=true&featured=true&limit=20`);
    const featuredData = await featuredResponse.json();
    console.log(`   - Status: ${featuredResponse.status}`);
    console.log(`   - Featured carousel products: ${featuredData.products?.length || 0}`);
    
    // Test 2: View All page
    console.log('\n2. Testing "View All" Page:');
    const viewAllResponse = await fetch(`${BASE_URL}/api/products?giftType=personalisedGift&featured=true&visible=true`);
    const viewAllData = await viewAllResponse.json();
    console.log(`   - Status: ${viewAllResponse.status}`);
    console.log(`   - View All page products: ${viewAllData.products?.length || 0}`);
    
    // Test 3: Regular products page (should show more)
    console.log('\n3. Testing Regular Products Page:');
    const regularResponse = await fetch(`${BASE_URL}/api/products?giftType=personalisedGift&visible=true`);
    const regularData = await regularResponse.json();
    console.log(`   - Status: ${regularResponse.status}`);
    console.log(`   - Regular products page: ${regularData.products?.length || 0}`);
    
    console.log('\n4. Summary:');
    console.log(`   - ✅ Featured carousel shows: ${featuredData.products?.length || 0} featured products`);
    console.log(`   - ✅ "View All" shows: ${viewAllData.products?.length || 0} featured products`);
    console.log(`   - ✅ Regular page shows: ${regularData.products?.length || 0} total products`);
    
    const isWorking = 
      (featuredData.products?.length || 0) <= (regularData.products?.length || 0) &&
      (viewAllData.products?.length || 0) < (regularData.products?.length || 0);
    
    console.log(`   - 🎯 Feature working correctly: ${isWorking ? 'YES' : 'NO'}`);
    
    // Save results for debugging
    fs.writeFileSync('featured-test-results.json', JSON.stringify({
      featured: featuredData.products?.length || 0,
      viewAll: viewAllData.products?.length || 0,
      regular: regularData.products?.length || 0,
      isWorking
    }, null, 2));
    
  } catch (error) {
    console.error('Error testing user journey:', error);
  }
}

testUserJourney();
