import mongoose from 'mongoose';

const giftSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product Name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  productDetails: {
    type: String,
    required: [true, 'Product Details are required'],
    trim: true
  },
  productCategory: {
    type: String,
    required: [true, 'Product Category is required'],
    enum: ['gift', 'corporate-gifts', 'cakes'],
    trim: true
  },
  productMRP: {
    type: Number,
    required: [true, 'MRP is required'],
    min: [0, 'MRP must be positive']
  },
  offerPercentage: {
    type: Number,
    required: true,
    min: [0, 'Offer percentage must be at least 0'],
    max: [100, 'Offer percentage cannot exceed 100'],
    default: 0
  },
  offerPrice: {
    type: Number,
    required: true,
    min: [0, 'Offer price must be positive']
  },
  productType: {
    type: String,
    required: true,
    enum: ['non-customisable', 'customisable', 'heavyCustomisable'],
    default: 'non-customisable'
  },
  customization: {
    customTextHeading: {
      type: String,
      required: function() {
        return this.productType === 'customisable' || this.productType === 'heavyCustomisable';
      }
    },
    numberOfCustomImages: {
      type: Number,
      min: [0, 'Number of custom images must be non-negative'],
      required: function() {
        return this.productType === 'customisable' || this.productType === 'heavyCustomisable';
      },
      validate: {
        validator: function(v) {
          if (this.productType === 'customisable' || this.productType === 'heavyCustomisable') {
            return v > 0;
          }
          return true;
        },
        message: 'Customisable products must have at least one custom image'
      }
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }]
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
giftSchema.index({ productName: 'text', description: 'text' });
giftSchema.index({ productCategory: 1 });
giftSchema.index({ productType: 1 });
giftSchema.index({ offerPrice: 1 });

// Check if model exists before creating a new one
const Gift = mongoose.models.Gift || mongoose.model('Gift', giftSchema);

export default Gift;