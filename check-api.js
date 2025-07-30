// Direct API test for featured products
// We'll use node-fetch to interact with the API directly
const fetch = require('node-fetch');

async function checkAPI() {
  console.log('Testing API filtering for featured products...');
  
  try {
    // Test parameters from the "View All" link
    const params = 'giftType=personalisedGift&featured=true&visible=true';
    const apiUrl = `http://localhost:3000/api/products?${params}`;
    
    console.log(`Making request to: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    console.log(`Status code: ${response.status}`);
    console.log(`Featured products found: ${data.products?.length || 0}`);
    
    if (data.products && data.products.length > 0) {
      // Log the first few products
      console.log('\nSample products:');
      data.products.slice(0, 3).forEach((product, index) => {
        console.log(`${index + 1}. ${product.productName} (Featured: ${product.isFeatured}, Visible: ${product.isVisible})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAPI();
