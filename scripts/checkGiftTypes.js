// This script checks if there are any corporate gifts in the database
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

async function checkGiftTypes() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
    
    // Define a schema just for this check
    const productSchema = new mongoose.Schema({
      giftType: String,
      productName: String,
      isVisible: Boolean,
      isFeatured: Boolean
    }, { strict: false });
    
    // Create a model for this check
    const Product = mongoose.model('Product', productSchema);
    
    // Count products by giftType
    const coperateCount = await Product.countDocuments({ giftType: 'coperateGift' });
    const corporateCount = await Product.countDocuments({ giftType: 'corporateGift' });
    const personalisedCount = await Product.countDocuments({ giftType: 'personalisedGift' });
    
    console.log('Product counts by gift type:');
    console.log(`- coperateGift: ${coperateCount}`);
    console.log(`- corporateGift: ${corporateCount}`);
    console.log(`- personalisedGift: ${personalisedCount}`);
    
    // Get details of corporate gifts
    if (corporateCount > 0) {
      console.log('\nCorporate Gift Details:');
      const corporateGifts = await Product.find({ giftType: 'corporateGift' })
        .select('productName isVisible isFeatured')
        .limit(5);
      
      corporateGifts.forEach(gift => {
        console.log(`- ${gift.productName} (Visible: ${gift.isVisible}, Featured: ${gift.isFeatured})`);
      });
    }
    
    if (coperateCount > 0) {
      console.log('\nCoperate Gift Details (old spelling):');
      const coperateGifts = await Product.find({ giftType: 'coperateGift' })
        .select('productName isVisible isFeatured')
        .limit(5);
      
      coperateGifts.forEach(gift => {
        console.log(`- ${gift.productName} (Visible: ${gift.isVisible}, Featured: ${gift.isFeatured})`);
      });
      
      // Offer to update these remaining products
      console.log('\nThese products need to be updated to use "corporateGift" spelling.');
      console.log('Run the fixCorporateGiftSpelling.js script to update them.');
    }
    
  } catch (error) {
    console.error('Error checking gift types:', error);
  } finally {
    // Close the connection and exit
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Run the check
checkGiftTypes();
