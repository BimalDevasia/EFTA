// Test API with different filter combinations to diagnose the issue
require('dotenv').config();

// Using global fetch (available in Node.js 18+)

async function testFiltering() {
  console.log('Testing product filtering...');
  
  // Base URL
  const BASE_URL = 'http://localhost:3000/api';
  
  // Test cases
  const tests = [
    { name: 'All products', url: `${BASE_URL}/products` },
    { name: 'Featured products only', url: `${BASE_URL}/products?featured=true` },
    { name: 'Personalized gifts only', url: `${BASE_URL}/products?giftType=personalisedGift` },
    { name: 'Featured personalized gifts', url: `${BASE_URL}/products?giftType=personalisedGift&featured=true` },
    { name: 'View All link params', url: `${BASE_URL}/products?giftType=personalisedGift&featured=true&visible=true` }
  ];
  
  // Run tests
  for (const test of tests) {
    try {
      console.log(`\nTesting: ${test.name}`);
      const response = await fetch(test.url);
      const data = await response.json();
      console.log(`Status: ${response.status}, Products found: ${data.products?.length || 0}`);
      
      if (data.products && data.products.length > 0) {
        console.log('Sample products:');
        data.products.slice(0, 2).forEach((product, i) => {
          console.log(`  ${i+1}. ${product.productName} (Featured: ${product.isFeatured}, GiftType: ${product.giftType})`);
        });
      }
      
    } catch (error) {
      console.error(`Error with ${test.name}:`, error.message);
    }
  }
}

testFiltering();
