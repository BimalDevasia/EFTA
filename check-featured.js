// Script to check featured products in database
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function checkFeaturedProducts() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const products = db.collection('products');
    
    // Count total products
    const totalCount = await products.countDocuments();
    console.log(`Total products: ${totalCount}`);
    
    // Count featured products
    const featuredCount = await products.countDocuments({ isFeatured: true });
    console.log(`Featured products: ${featuredCount}`);
    
    // Count visible products
    const visibleCount = await products.countDocuments({ isVisible: true });
    console.log(`Visible products: ${visibleCount}`);
    
    // Count featured AND visible products
    const featuredVisibleCount = await products.countDocuments({ 
      isFeatured: true, 
      isVisible: true 
    });
    console.log(`Featured AND visible products: ${featuredVisibleCount}`);
    
    // Count featured, visible, and personalized gift products
    const featuredVisiblePersonalizedCount = await products.countDocuments({ 
      isFeatured: true, 
      isVisible: true,
      giftType: 'personalisedGift'
    });
    console.log(`Featured, visible, personalized gift products: ${featuredVisiblePersonalizedCount}`);
    
    // Show some sample products
    const sampleProducts = await products.find({}, { 
      projection: { name: 1, isFeatured: 1, isVisible: 1, giftType: 1 } 
    }).limit(5).toArray();
    
    console.log('\nSample products:');
    sampleProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - Featured: ${product.isFeatured}, Visible: ${product.isVisible}, GiftType: ${product.giftType}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkFeaturedProducts();
