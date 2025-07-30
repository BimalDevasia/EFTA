// Test script to verify the giftType field update
const testGiftTypeUpdate = async () => {
  console.log('🧪 Testing giftType field update...');
  
  try {
    // Test fetching products with the new giftType field
    console.log('📡 Testing product fetch...');
    const response = await fetch('http://localhost:3002/api/products');
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Products API working');
      console.log('📊 Products count:', data.products?.length || 0);
      
      if (data.products && data.products.length > 0) {
        const sampleProduct = data.products[0];
        console.log('📝 Sample product fields:');
        console.log('   - giftType:', sampleProduct.giftType);
        console.log('   - type (old field):', sampleProduct.type);
        console.log('   - productType:', sampleProduct.productType);
        console.log('   - productCategory:', sampleProduct.productCategory);
      }
    } else {
      console.error('❌ Products API failed:', data.error);
    }
    
    // Test fetching with giftType filter
    console.log('\n📡 Testing giftType filter...');
    const filterResponse = await fetch('http://localhost:3002/api/products?category=personalisedGift');
    const filterData = await filterResponse.json();
    
    if (filterResponse.ok) {
      console.log('✅ GiftType filter working');
      console.log('📊 Filtered products count:', filterData.products?.length || 0);
    } else {
      console.error('❌ GiftType filter failed:', filterData.error);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
};

// Run the test
testGiftTypeUpdate();
