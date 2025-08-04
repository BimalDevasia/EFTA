import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Product ID is required'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Product ID cannot exceed 50 characters'],
    match: [/^[a-z0-9-]+$/, 'Product ID can only contain lowercase letters, numbers, and hyphens']
  },
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
  specifications: [{
    heading: {
      type: String,
      required: true,
      trim: true
    },
    color: {
      type: String,
      trim: true,
      default: ''
    },
    details: [{
      key: {
        type: String,
        required: true,
        trim: true
      },
      value: {
        type: String,
        required: true,
        trim: true
      }
    }]
  }],
  whatsInside: [{
    type: String,
    trim: true
  }],
  giftType: {
    type: String,
    required: [true, 'Gift type is required'],
    enum: ['personalisedGift', 'corporateGift', 'coperateGift'], // Include both spellings for backward compatibility
    default: 'personalisedGift'
  },
  productCategory: {
    type: String,
    required: [true, 'Product category is required'],
    lowercase: true,
    trim: true,
    maxlength: [50, 'Product category cannot exceed 50 characters']
  },
  productMRP: {
    type: Number,
    required: [true, 'Product MRP is required'],
    min: [0, 'Product MRP must be positive']
  },
  offerType: {
    type: String,
    enum: ['none', 'percentage', 'price'],
    default: 'none'
  },
  offerPercentage: {
    type: Number,
    default: 0,
    min: [0, 'Offer percentage cannot be negative'],
    max: [100, 'Offer percentage cannot exceed 100']
  },
  offerPrice: {
    type: Number,
    default: null,
    min: [0, 'Offer price cannot be negative']
  },
  productType: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['non-customisable', 'customisable', 'heavyCustomisable'],
    default: 'non-customisable'
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
  isVisible: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
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
  colors: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    hex: {
      type: String,
      required: true,
      match: [/^#[0-9A-F]{6}$/i, 'Color hex must be a valid 6-digit hex color code']
    }
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
ProductSchema.index({ giftType: 1, isActive: 1 });
ProductSchema.index({ productName: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ createdAt: -1 });

// Virtual for calculated final price
ProductSchema.virtual('finalPrice').get(function() {
  if (this.offerType === 'percentage') {
    return this.productMRP - (this.productMRP * this.offerPercentage / 100);
  } else if (this.offerType === 'price') {
    return this.offerPrice;
  } else {
    return this.productMRP;
  }
});

// Ensure virtual fields are included in JSON output
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

// Validation for customizable products and offers
ProductSchema.pre('validate', function(next) {
  // Validate offer types
  if (this.offerType === 'percentage' && (!this.offerPercentage || this.offerPercentage <= 0)) {
    this.invalidate('offerPercentage', 'Offer percentage is required when offer type is percentage');
  }
  
  if (this.offerType === 'price' && (!this.offerPrice || this.offerPrice <= 0)) {
    this.invalidate('offerPrice', 'Offer price is required when offer type is price');
  }
  
  if (this.offerType === 'price' && this.offerPrice >= this.productMRP) {
    this.invalidate('offerPrice', 'Offer price must be less than MRP');
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
