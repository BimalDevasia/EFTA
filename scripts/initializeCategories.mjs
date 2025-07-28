import mongoose from 'mongoose';
import connectDB from '../src/lib/mongoose.js';
import Product from '../src/lib/models/product.js';
import ProductCategory from '../src/lib/models/productCategory.js';
import Admin from '../src/lib/models/admin.js';

async function initializeCategories() {
  try {
    await connectDB();
    console.log('Connected to database');
    
    // Get the first admin user to assign as creator
    const admin = await Admin.findOne({ isActive: true }).lean();
    if (!admin) {
      console.log('No admin user found. Please create an admin user first.');
      return;
    }
    
    console.log('Using admin:', admin.email);
    
    // Get all unique categories from existing products
    const existingCategories = await Product.distinct('productCategory', { 
      productCategory: { $exists: true, $ne: '' } 
    });
    
    console.log('Found existing product categories:', existingCategories);
    
    // Create ProductCategory entries for existing categories
    for (const categoryName of existingCategories) {
      try {
        const normalizedName = categoryName.toLowerCase().trim();
        const displayName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        
        // Check if category already exists
        const existingCategory = await ProductCategory.findOne({ name: normalizedName });
        
        if (!existingCategory) {
          // Count products in this category
          const productCount = await Product.countDocuments({ productCategory: categoryName });
          
          const category = new ProductCategory({
            name: normalizedName,
            displayName,
            description: `Auto-imported category: ${displayName}`,
            productCount,
            createdBy: admin._id
          });
          
          await category.save();
          console.log(`✅ Created category: ${displayName} (${productCount} products)`);
        } else {
          // Update product count
          const productCount = await Product.countDocuments({ productCategory: categoryName });
          await ProductCategory.updateOne(
            { name: normalizedName },
            { productCount }
          );
          console.log(`✅ Updated category: ${existingCategory.displayName} (${productCount} products)`);
        }
      } catch (error) {
        console.error(`❌ Error processing category "${categoryName}":`, error.message);
      }
    }
    
    // Add default categories if none exist
    const defaultCategories = [
      { name: 'lamp', displayName: 'Lamp', description: 'LED and decorative lamps' },
      { name: 'bulb', displayName: 'Bulb', description: 'Custom LED bulbs' },
      { name: 'bundle', displayName: 'Bundle', description: 'Product bundles and combo offers' },
      { name: 'cake', displayName: 'Cake', description: 'Custom photo cakes' },
      { name: 'mug', displayName: 'Mug', description: 'Personalized mugs and cups' },
      { name: 'frame', displayName: 'Frame', description: 'Photo frames and wall art' },
      { name: 'wallet', displayName: 'Wallet', description: 'Custom wallets and purses' },
      { name: 'keychain', displayName: 'Keychain', description: 'Personalized keychains' },
      { name: 'tshirt', displayName: 'T-Shirt', description: 'Custom printed t-shirts' },
      { name: 'cushion', displayName: 'Cushion', description: 'Personalized cushions and pillows' }
    ];
    
    for (const defaultCat of defaultCategories) {
      try {
        const existingCategory = await ProductCategory.findOne({ name: defaultCat.name });
        
        if (!existingCategory) {
          const category = new ProductCategory({
            ...defaultCat,
            createdBy: admin._id
          });
          
          await category.save();
          console.log(`✅ Created default category: ${defaultCat.displayName}`);
        }
      } catch (error) {
        console.error(`❌ Error creating default category "${defaultCat.name}":`, error.message);
      }
    }
    
    // Display final summary
    const totalCategories = await ProductCategory.countDocuments();
    console.log(`\n🎉 Initialization complete! Total categories: ${totalCategories}`);
    
    const categories = await ProductCategory.find().sort({ productCount: -1, name: 1 });
    console.log('\nAll categories:');
    categories.forEach(cat => {
      console.log(`- ${cat.displayName}: ${cat.productCount} products`);
    });
    
  } catch (error) {
    console.error('Error initializing categories:', error);
  } finally {
    process.exit(0);
  }
}

// Check if this script is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeCategories();
}

export { initializeCategories };
