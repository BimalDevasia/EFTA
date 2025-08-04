// This script updates the giftType from 'coperateGift' to 'corporateGift'
// to fix the spelling inconsistency across the application

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

async function fixCorporateGiftSpelling() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
    
    // Define a schema just for this migration
    const productSchema = new mongoose.Schema({
      giftType: String,
    }, { strict: false }); // strict: false allows accessing fields not defined in schema
    
    // Create a model for this migration
    const Product = mongoose.model('Product', productSchema);
    
    // Count how many records need updating
    const count = await Product.countDocuments({ giftType: 'coperateGift' });
    console.log(`Found ${count} products with giftType 'coperateGift'`);
    
    if (count === 0) {
      console.log('No products need updating. Exiting...');
      process.exit(0);
    }
    
    // Update all products with giftType 'coperateGift' to 'corporateGift'
    const result = await Product.updateMany(
      { giftType: 'coperateGift' },
      { $set: { giftType: 'corporateGift' } }
    );
    
    console.log(`Updated ${result.modifiedCount} products successfully`);
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the connection and exit
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Run the migration
fixCorporateGiftSpelling();
