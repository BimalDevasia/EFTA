// Test the featured products functionality
require('dotenv').config();

async function testFeaturedProducts() {
  console.log('Testing Featured Products Functionality...\n');
  
  try {
    // Test 1: API endpoint with featured=true
    console.log('1. Testing API endpoint with featured=true:');
    const apiResponse = await fetch('http://localhost:3001/api/products?giftType=personalisedGift&featured=true&visible=true');
    const apiData = await apiResponse.json();
    console.log(`   - Status: ${apiResponse.status}`);
    console.log(`   - Products returned: ${apiData.products?.length || 0}`);
    
    if (apiData.products && apiData.products.length > 0) {
      console.log('   - Sample products:');
      apiData.products.forEach((product, index) => {
        console.log(`     ${index + 1}. Featured: ${product.isFeatured}, Visible: ${product.isVisible}, GiftType: ${product.giftType}`);
      });
    }
    
    console.log('\n2. Testing API endpoint without featured filter:');
    const allResponse = await fetch('http://localhost:3001/api/products?giftType=personalisedGift&visible=true');
    const allData = await allResponse.json();
    console.log(`   - Status: ${allResponse.status}`);
    console.log(`   - Total visible personalized gifts: ${allData.products?.length || 0}`);
    
    console.log('\n3. Comparison:');
    console.log(`   - Featured products: ${apiData.products?.length || 0}`);
    console.log(`   - All visible personalized gifts: ${allData.products?.length || 0}`);
    console.log(`   - Filtering working correctly: ${(apiData.products?.length || 0) < (allData.products?.length || 0) ? 'YES' : 'NEEDS INVESTIGATION'}`);
    
  } catch (error) {
    console.error('Error testing featured products:', error);
  }
}

testFeaturedProducts();
