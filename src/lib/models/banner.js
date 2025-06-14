import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    url: {
      type: String,
      required: [true, 'Banner image is required']
    },
    public_id: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  },
  pageType: {
    type: String,
    required: true,
    enum: ['home', 'gifts', 'courses', 'events', 'corporate'],
    unique: true // Each page can have only one banner
  },
  buttonText: {
    type: String,
    default: 'Shop Now'
  },
  buttonLink: {
    type: String,
    default: '/gifts'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create index for pageType
bannerSchema.index({ pageType: 1 });

// Check if model exists before creating a new one
const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

export default Banner;
