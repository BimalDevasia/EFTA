// Test script to verify ExploreMoreGifts component works with new giftType
const testExploreMoreGifts = async () => {
  console.log('🧪 Testing ExploreMoreGifts component with new giftType...');
  
  try {
    // Test the default API call that ExploreMoreGifts would make
    console.log('📡 Testing default category API call...');
    const response = await fetch('http://localhost:3000/api/products?limit=24&category=personalisedGift&visible=true');
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ExploreMoreGifts API call successful - found ${data.products?.length || 0} products`);
      
      if (data.products && data.products.length > 0) {
        console.log('📝 Sample products from ExploreMoreGifts:');
        data.products.slice(0, 3).forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.productName}`);
          console.log(`      - giftType: ${product.giftType}`);
          console.log(`      - visible: ${product.isVisible}`);
          console.log(`      - category: ${product.productCategory}`);
        });
        
        // Verify all products have the correct giftType
        const hasCorrectGiftType = data.products.every(p => p.giftType === 'personalisedGift');
        const allVisible = data.products.every(p => p.isVisible !== false);
        
        console.log('\n🔍 Validation:');
        console.log(`   - All products have personalisedGift type: ${hasCorrectGiftType ? '✅ YES' : '❌ NO'}`);
        console.log(`   - All products are visible: ${allVisible ? '✅ YES' : '❌ NO'}`);
        
        if (hasCorrectGiftType && allVisible) {
          console.log('\n🎉 ExploreMoreGifts component is working correctly with new giftType!');
        } else {
          console.log('\n⚠️ Some products may not meet the expected criteria');
        }
      } else {
        console.log('📊 No products returned - this is expected if no visible personalisedGift products exist');
      }
      
    } else {
      console.log('❌ ExploreMoreGifts API call failed:', data.error);
    }
    
    // Test with custom category
    console.log('\n📡 Testing with custom category parameter...');
    const customResponse = await fetch('http://localhost:3000/api/products?limit=24&category=coperateGift&visible=true');
    const customData = await customResponse.json();
    
    if (customResponse.ok) {
      console.log(`✅ Custom category API call successful - found ${customData.products?.length || 0} corporate gifts`);
    } else {
      console.log('❌ Custom category API call failed:', customData.error);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
};

// Run the test
testExploreMoreGifts();
