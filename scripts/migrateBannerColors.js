const { connectDB } = require('../src/lib/mongoose');
const mongoose = require('mongoose');

async function migrateBannerColors() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Drop the existing enum constraint by dropping and recreating the collection schema
    const db = mongoose.connection.db;
    
    // Get the current collection
    const collection = db.collection('banners');
    
    // Check if collection exists
    const collections = await db.listCollections({ name: 'banners' }).toArray();
    if (collections.length > 0) {
      console.log('Banners collection exists, updating schema...');
      
      // Drop the index/constraint that enforces the enum
      try {
        await collection.dropIndexes();
        console.log('Dropped existing indexes');
      } catch (error) {
        console.log('No indexes to drop or error dropping indexes:', error.message);
      }
      
      // The Mongoose model will automatically recreate with the new schema
      console.log('Schema migration completed');
    } else {
      console.log('Banners collection does not exist yet');
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateBannerColors();
