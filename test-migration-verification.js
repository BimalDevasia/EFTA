// Test script to verify the migration worked correctly
const testMigrationResults = async () => {
  console.log('🧪 Testing migration results...');
  
  try {
    // Test fetching products
    console.log('📡 Fetching products after migration...');
    const response = await fetch('http://localhost:3000/api/products');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`API Error: ${data.error}`);
    }
    
    console.log(`📊 Found ${data.products?.length || 0} products`);
    
    if (data.products && data.products.length > 0) {
      console.log('\n📝 Product field structure after migration:');
      data.products.forEach((product, index) => {
        console.log(`Product ${index + 1}: ${product.productName}`);
        console.log(`   - giftType (new): ${product.giftType}`);
        console.log(`   - type (old): ${product.type || 'REMOVED ✅'}`);
        console.log(`   - productType: ${product.productType}`);
        console.log(`   - productCategory: ${product.productCategory}`);
        console.log('');
      });
      
      // Check if any products still have the old field
      const hasOldField = data.products.some(p => p.type);
      const hasNewField = data.products.every(p => p.giftType);
      
      console.log('🔍 Migration Validation:');
      console.log(`   - All products have giftType field: ${hasNewField ? '✅ YES' : '❌ NO'}`);
      console.log(`   - No products have old type field: ${!hasOldField ? '✅ YES' : '❌ NO'}`);
      
      if (hasNewField && !hasOldField) {
        console.log('\n🎉 Migration validation successful!');
      } else {
        console.log('\n⚠️ Migration validation failed - some issues detected');
      }
    }
    
    // Test filtering by giftType
    console.log('\n📡 Testing giftType filtering...');
    const filterResponse = await fetch('http://localhost:3000/api/products?category=personalisedGift');
    const filterData = await filterResponse.json();
    
    if (filterResponse.ok) {
      console.log(`✅ GiftType filter working - found ${filterData.products?.length || 0} personalisedGift products`);
    } else {
      console.log('❌ GiftType filter failed:', filterData.error);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
};

// Run the test
testMigrationResults();
