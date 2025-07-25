import mongoose from 'mongoose';

const testimonySchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  customerImage: {
    type: String,
    trim: true,
    default: null
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  product: {
    type: String,
    trim: true,
    maxlength: 200,
    default: null
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
testimonySchema.index({ isActive: 1, deletedAt: 1, createdAt: -1 });
testimonySchema.index({ rating: 1 });

// Static method to get active testimonies
testimonySchema.statics.findActive = function() {
  return this.find({ 
    isActive: true, 
    deletedAt: null 
  });
};

// Static method to get testimonies by rating
testimonySchema.statics.findByRating = function(rating) {
  return this.find({ 
    rating: rating,
    isActive: true, 
    deletedAt: null 
  });
};

// Virtual for formatted rating
testimonySchema.virtual('formattedRating').get(function() {
  return '⭐'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
});

// Method to get safe object (exclude sensitive data)
testimonySchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.createdBy;
  delete obj.deletedAt;
  delete obj.__v;
  return obj;
};

const Testimony = mongoose.models.Testimony || mongoose.model('Testimony', testimonySchema);

export default Testimony;
