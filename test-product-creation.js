// Test script to verify product creation functionality
// Run this file with node to test the API endpoints

const testProductCreation = async () => {
  console.log('🧪 Testing Product Creation Endpoint...');
  
  try {
    // Test product ID availability check first
    console.log('\n1. Testing Product ID availability check...');
    const checkResponse = await fetch('http://localhost:3001/api/products/check-id?productId=test-product-123');
    const checkData = await checkResponse.json();
    console.log('Check ID Response:', checkData);
    
    // Test creating a product (this will fail due to admin auth, but we can see the validation)
    console.log('\n2. Testing Product Creation (without auth - should fail at auth)...');
    const createResponse = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: 'test-product-123',
        productName: 'Test Product',
        description: 'Test Description',
        productDetails: 'Test Product Details',
        productCategory: 'test',
        productMRP: 100,
        offerType: 'none',
        offerPercentage: 0,
        offerPrice: null,
        productType: 'non-customisable',
        giftType: 'personalisedGift',
        images: [{
          url: 'https://example.com/image.jpg',
          public_id: 'test_image',
          alt: 'Test Image'
        }],
        tags: [],
        colors: [],
        isVisible: true,
        isFeatured: false
      })
    });
    
    const createData = await createResponse.json();
    console.log('Create Response Status:', createResponse.status);
    console.log('Create Response:', createData);
    
  } catch (error) {
    console.error('Test Error:', error);
  }
};

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  testProductCreation();
}

module.exports = { testProductCreation };
