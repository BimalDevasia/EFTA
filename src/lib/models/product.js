import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  productDetails: {
    type: String,
    required: [true, 'Product details are required'],
    trim: true
  },
  productCategory: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['gift', 'bundle', 'cake'],
    lowercase: true
  },
  productMRP: {
    type: Number,
    required: [true, 'Product MRP is required'],
    min: [0, 'Product MRP must be positive']
  },
  offerPercentage: {
    type: Number,
    default: 0,
    min: [0, 'Offer percentage cannot be negative'],
    max: [100, 'Offer percentage cannot exceed 100']
  },
  productType: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['non-customisable', 'customisable', 'heavyCustomisable'],
    default: 'non-customisable'
  },
  customTextHeading: {
    type: String,
    default: '',
    trim: true,
    maxlength: [100, 'Custom text heading cannot exceed 100 characters']
  },
  numberOfCustomImages: {
    type: Number,
    default: 0,
    min: [0, 'Number of custom images cannot be negative']
  },
  images: [{
    url: {
      type: String,
      required: [true, 'Image URL is required']
    },
    public_id: {
      type: String,
      required: [true, 'Image public ID is required']
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  tags: [{
    type: String,
    trim: true
  }],
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
}, {
  timestamps: true
});

// Indexes for better query performance
ProductSchema.index({ productCategory: 1, isActive: 1 });
ProductSchema.index({ productName: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ createdAt: -1 });

// Virtual for calculated offer price
ProductSchema.virtual('offerPrice').get(function() {
  return this.productMRP - (this.productMRP * this.offerPercentage / 100);
});

// Ensure virtual fields are included in JSON output
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

// Validation for customizable products
ProductSchema.pre('validate', function(next) {
  if ((this.productType === 'customisable' || this.productType === 'heavyCustomisable') && !this.customTextHeading) {
    this.invalidate('customTextHeading', 'Custom text heading is required for customizable products');
  }
  next();
});

// Update the updatedAt field before saving
ProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
