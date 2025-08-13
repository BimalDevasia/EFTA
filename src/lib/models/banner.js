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
    unique: true // Each page can have only one banner (unique automatically creates index)
  },
  buttonText: {
    type: String,
    default: 'Shop Now'
  },
  buttonColor: {
    type: String,
    default: '#8300FF'
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

// Index is already created in the schema definition

// Check if model exists before creating a new one
const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

export default Banner;
