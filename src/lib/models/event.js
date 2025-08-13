import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: [200, 'Event name cannot exceed 200 characters']
  },
  eventCategory: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['normal', 'corporate'],
    default: 'normal'
  },
  eventDescription: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [2000, 'Event description cannot exceed 2000 characters']
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

// Add validation for images array length
eventSchema.path('images').validate(function(images) {
  return images.length >= 3 && images.length <= 6;
}, 'Event must have between 3 and 6 images');

// Index for better query performance
eventSchema.index({ eventCategory: 1 });
eventSchema.index({ eventName: 'text', eventDescription: 'text' });

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
