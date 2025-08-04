// Migration script to update existing products from 'type' to 'giftType'
import mongoose from 'mongoose';
import connectDB from './src/lib/mongoose.js';

const migrateProductFields = async () => {
  try {
    await connectDB();
    console.log('🔗 Connected to database');
    
    // Get the raw collection to perform bulk updates
    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');
    
    console.log('🔍 Finding products with old type field...');
    
    // Find products that have the old 'type' field
    const productsWithOldType = await productsCollection.find({
      type: { $exists: true }
    }).toArray();
    
    console.log(`📊 Found ${productsWithOldType.length} products with old type field`);
    
    if (productsWithOldType.length === 0) {
      console.log('✅ No products need migration');
      return;
    }
    
    let updatedCount = 0;
    
    for (const product of productsWithOldType) {
      let newGiftType = 'personalisedGift'; // default
      
      // Map old values to new values
      if (product.type === 'corporate') {
        newGiftType = 'corporateGift';
      } else if (product.type === 'personalised gift') {
        newGiftType = 'personalisedGift';
      }
      
      // Update the document
      const result = await productsCollection.updateOne(
        { _id: product._id },
        {
          $set: { giftType: newGiftType },
          $unset: { type: 1 } // Remove the old field
        }
      );
      
      if (result.modifiedCount > 0) {
        updatedCount++;
        console.log(`✅ Updated product: ${product.productName || product._id} - ${product.type} → ${newGiftType}`);
      }
    }
    
    console.log(`\n🎉 Migration completed! Updated ${updatedCount} products`);
    
    // Verify the migration
    console.log('\n🔍 Verifying migration...');
    const remainingOldType = await productsCollection.countDocuments({ type: { $exists: true } });
    const newGiftTypeCount = await productsCollection.countDocuments({ giftType: { $exists: true } });
    
    console.log(`📊 Products with old 'type' field: ${remainingOldType}`);
    console.log(`📊 Products with new 'giftType' field: ${newGiftTypeCount}`);
    
    if (remainingOldType === 0) {
      console.log('✅ Migration successful - no products with old type field remain');
    } else {
      console.log('⚠️ Some products still have the old type field');
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the migration
migrateProductFields();
