import mongoose from 'mongoose';

const eventCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event category title is required'],
    trim: true
  },
  tag: {
    type: String,
    required: [true, 'Event category tag is required'],
    trim: true,
    lowercase: true,
    unique: true
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    enum: ['#FB7D76', '#F06995', '#DB53AA', '#9B59B6', '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#E67E22', '#95A5A6'],
    default: '#FB7D76'
  },
  emoji: {
    type: String,
    default: '',
    trim: true
  },
  icon: {
    type: String,
    default: '',
    trim: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
eventCategorySchema.index({ isActive: 1, createdAt: 1 });
eventCategorySchema.index({ products: 1 });

export default mongoose.models.EventCategory || mongoose.model('EventCategory', eventCategorySchema);
