// Migration script to update products from old 'type' field to new 'giftType' field
// CommonJS version for better compatibility
// Run this from the project root: node scripts/migrateProductFieldsCJS.js

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your .env file');
}

async function migrateProductFields() {
  let client;
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const collection = db.collection('products');
    
    console.log('🔍 Finding products with old type field...');
    
    // Find products that have the old 'type' field but no 'giftType' field
    const productsToMigrate = await collection.find({
      type: { $exists: true },
      giftType: { $exists: false }
    }).toArray();
    
    console.log(`📊 Found ${productsToMigrate.length} products to migrate`);
    
    if (productsToMigrate.length === 0) {
      console.log('✅ No products need migration');
      return;
    }
    
    // Display products that will be migrated
    console.log('\n📝 Products to be migrated:');
    productsToMigrate.forEach((product, index) => {
      console.log(`${index + 1}. ${product.productName || 'Unnamed'} - type: "${product.type}"`);
    });
    
    console.log('\n🔧 Starting migration...');
    
    const bulkOps = [];
    
    for (const product of productsToMigrate) {
      let newGiftType = 'personalisedGift'; // default
      
      // Map old values to new values
      if (product.type === 'corporate') {
        newGiftType = 'corporateGift';
      } else if (product.type === 'personalised gift') {
        newGiftType = 'personalisedGift';
      }
      
      bulkOps.push({
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: { giftType: newGiftType },
            $unset: { type: 1 } // Remove old field
          }
        }
      });
      
      console.log(`📦 Queued: ${product.productName || product._id} - "${product.type}" → "${newGiftType}"`);
    }
    
    if (bulkOps.length > 0) {
      console.log('\n💾 Executing bulk update...');
      const result = await collection.bulkWrite(bulkOps);
      
      console.log(`✅ Migration completed!`);
      console.log(`   - Matched: ${result.matchedCount}`);
      console.log(`   - Modified: ${result.modifiedCount}`);
    }
    
    // Verify migration
    console.log('\n🔍 Verifying migration...');
    const remainingOldType = await collection.countDocuments({ type: { $exists: true } });
    const newGiftTypeCount = await collection.countDocuments({ giftType: { $exists: true } });
    const totalProducts = await collection.countDocuments({});
    
    console.log('\n📊 Migration Results:');
    console.log(`   - Total products: ${totalProducts}`);
    console.log(`   - Products with old 'type' field: ${remainingOldType}`);
    console.log(`   - Products with new 'giftType' field: ${newGiftTypeCount}`);
    
    if (remainingOldType === 0) {
      console.log('\n🎉 Migration successful! All products now use the giftType field.');
    } else {
      console.log('\n⚠️  Some products still have the old type field. You may need to run the migration again.');
    }
    
    // Show sample migrated products
    console.log('\n📝 Sample migrated products:');
    const sampleProducts = await collection.find({ giftType: { $exists: true } }).limit(3).toArray();
    sampleProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.productName} - giftType: "${product.giftType}"`);
    });
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the migration
console.log('🚀 Starting Product Field Migration');
console.log('=====================================\n');

migrateProductFields()
  .then(() => {
    console.log('\n🏁 Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration script failed:', error);
    process.exit(1);
  });
