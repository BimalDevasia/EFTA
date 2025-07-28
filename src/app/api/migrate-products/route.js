import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Product from '@/lib/models/product';
import { verifyAdmin } from '@/lib/auth-helpers';

// POST - Migrate products from type to giftType field (Admin only)
export async function POST(request) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    console.log('🔧 Starting product field migration...');
    
    // Get the raw collection for bulk operations
    const db = Product.db;
    const collection = db.collection('products');
    
    // Find products with the old 'type' field
    const productsWithOldType = await collection.find({
      type: { $exists: true },
      giftType: { $exists: false }
    }).toArray();
    
    console.log(`📊 Found ${productsWithOldType.length} products to migrate`);
    
    if (productsWithOldType.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No products need migration',
        migrated: 0
      });
    }
    
    let migrated = 0;
    const updates = [];
    
    for (const product of productsWithOldType) {
      let newGiftType = 'personalisedGift'; // default
      
      // Map old values to new values
      if (product.type === 'corporate') {
        newGiftType = 'coperateGift';
      } else if (product.type === 'personalised gift') {
        newGiftType = 'personalisedGift';
      }
      
      updates.push({
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: { giftType: newGiftType },
            $unset: { type: 1 }
          }
        }
      });
    }
    
    // Perform bulk update
    if (updates.length > 0) {
      const result = await collection.bulkWrite(updates);
      migrated = result.modifiedCount;
      
      console.log(`✅ Migration completed: ${migrated} products updated`);
    }
    
    // Verify migration
    const remainingOldType = await collection.countDocuments({ type: { $exists: true } });
    const newGiftTypeCount = await collection.countDocuments({ giftType: { $exists: true } });
    
    return NextResponse.json({
      success: true,
      message: 'Product field migration completed',
      migrated,
      remainingOldType,
      totalWithGiftType: newGiftTypeCount
    });
    
  } catch (error) {
    console.error('💥 Migration error:', error);
    return NextResponse.json(
      { success: false, error: 'Migration failed', details: error.message },
      { status: 500 }
    );
  }
}
