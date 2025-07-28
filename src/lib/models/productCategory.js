import mongoose from 'mongoose';

const ProductCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Category name cannot exceed 50 characters'],
    match: [/^[a-z0-9\s\-]+$/, 'Category name can only contain letters, numbers, spaces, and hyphens']
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true,
    maxlength: [50, 'Display name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  productCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
// Note: name index is already created by unique: true
ProductCategorySchema.index({ isActive: 1 });

// Update the updatedAt field before saving
ProductCategorySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to find or create category
ProductCategorySchema.statics.findOrCreate = async function(categoryName, adminId, displayName = null) {
  const normalizedName = categoryName.toLowerCase().trim();
  const finalDisplayName = displayName || categoryName.trim();
  
  let category = await this.findOne({ name: normalizedName });
  
  if (!category) {
    category = new this({
      name: normalizedName,
      displayName: finalDisplayName,
      createdBy: adminId
    });
    await category.save();
  }
  
  return category;
};

// Static method to increment product count
ProductCategorySchema.statics.incrementProductCount = async function(categoryName) {
  const normalizedName = categoryName.toLowerCase().trim();
  await this.updateOne(
    { name: normalizedName },
    { $inc: { productCount: 1 } }
  );
};

// Static method to decrement product count
ProductCategorySchema.statics.decrementProductCount = async function(categoryName) {
  const normalizedName = categoryName.toLowerCase().trim();
  await this.updateOne(
    { name: normalizedName },
    { $inc: { productCount: -1 } }
  );
};

const ProductCategory = mongoose.models.ProductCategory || mongoose.model('ProductCategory', ProductCategorySchema);

export default ProductCategory;
