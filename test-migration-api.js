// Test the migration API endpoint
const testMigrationAPI = async () => {
  console.log('🧪 Testing migration API endpoint...');
  
  try {
    // First check current product status
    console.log('📡 Checking current products...');
    const checkResponse = await fetch('http://localhost:3002/api/products');
    const checkData = await checkResponse.json();
    
    if (checkResponse.ok) {
      const oldTypeCount = checkData.products?.filter(p => p.type && !p.giftType).length || 0;
      const newGiftTypeCount = checkData.products?.filter(p => p.giftType).length || 0;
      
      console.log(`📊 Products with old 'type' field: ${oldTypeCount}`);
      console.log(`📊 Products with new 'giftType' field: ${newGiftTypeCount}`);
      
      if (oldTypeCount > 0) {
        console.log('\n🔧 Running migration...');
        
        // Run the migration (Note: This requires admin authentication)
        const migrationResponse = await fetch('http://localhost:3002/api/migrate-products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const migrationData = await migrationResponse.json();
        
        if (migrationResponse.ok) {
          console.log('✅ Migration successful!');
          console.log(`📊 Migrated: ${migrationData.migrated} products`);
          console.log(`📊 Remaining old type: ${migrationData.remainingOldType}`);
          console.log(`📊 Total with giftType: ${migrationData.totalWithGiftType}`);
        } else {
          console.log('❌ Migration failed:', migrationData.error);
          if (migrationData.error.includes('Unauthorized')) {
            console.log('💡 Note: Migration requires admin authentication');
          }
        }
      } else {
        console.log('✅ No migration needed - all products already use giftType field');
      }
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
};

// Run the test
testMigrationAPI();
