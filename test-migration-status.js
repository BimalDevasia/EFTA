// Simple migration test using the API
const testAndMigrateViaAPI = async () => {
  console.log('🧪 Testing product field migration via API...');
  
  try {
    // First, let's fetch current products to see their structure
    console.log('📡 Fetching current products...');
    const response = await fetch('http://localhost:3002/api/products');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`API Error: ${data.error}`);
    }
    
    console.log(`📊 Found ${data.products?.length || 0} products`);
    
    if (data.products && data.products.length > 0) {
      console.log('\n📝 Current product field structure:');
      data.products.forEach((product, index) => {
        console.log(`Product ${index + 1}: ${product.productName}`);
        console.log(`   - type (old): ${product.type}`);
        console.log(`   - giftType (new): ${product.giftType}`);
        console.log(`   - productType: ${product.productType}`);
        console.log(`   - productCategory: ${product.productCategory}`);
        console.log('');
      });
    }
    
    // Note: Since we don't have direct database access from this script,
    // we'll need to manually update products through the admin interface
    // or create a proper migration API endpoint
    
    console.log('💡 Migration Notes:');
    console.log('   - Existing products still have the old "type" field');
    console.log('   - New products will use the "giftType" field');
    console.log('   - Consider updating existing products manually or via admin interface');
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
};

// Run the test
testAndMigrateViaAPI();
