// Test API endpoint for featured products
require('dotenv').config();

async function testAPI() {
  const url = 'http://localhost:3001/api/products?giftType=personalisedGift&featured=true&visible=true';
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('API Response Status:', response.status);
    console.log('API Response OK:', response.ok);
    console.log('Number of products returned:', data.products?.length || 0);
    
    if (data.products && data.products.length > 0) {
      console.log('\nProducts returned:');
      data.products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name || 'Unnamed Product'}`);
        console.log(`   - Featured: ${product.isFeatured}`);
        console.log(`   - Visible: ${product.isVisible}`);
        console.log(`   - GiftType: ${product.giftType}`);
        console.log(`   - Category: ${product.category}`);
        console.log('');
      });
    } else {
      console.log('No products returned');
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI();
