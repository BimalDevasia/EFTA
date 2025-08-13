const mongoose = require('mongoose');
require('dotenv').config();

// Event schema (simple version to match our current model)
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

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

async function checkEvents() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully\n');

    // Get total count
    const totalEvents = await Event.countDocuments();
    console.log(`📊 Total Events in Database: ${totalEvents}\n`);

    if (totalEvents === 0) {
      console.log('❌ No events found in the database.');
      console.log('💡 You can create events through the admin panel at /admin/events');
      return;
    }

    // Get all events
    const events = await Event.find({}).sort({ createdAt: -1 });

    console.log('📋 Events List:');
    console.log('=' .repeat(80));

    events.forEach((event, index) => {
      console.log(`\n${index + 1}. Event ID: ${event._id}`);
      console.log(`   Name: ${event.eventName}`);
      console.log(`   Category: ${event.eventCategory === 'corporate' ? 'Corporate Event' : 'Normal Event'}`);
      console.log(`   Description: ${event.eventDescription.substring(0, 100)}${event.eventDescription.length > 100 ? '...' : ''}`);
      console.log(`   Images: ${event.images ? event.images.length : 0} images`);
      console.log(`   Created: ${event.createdAt ? new Date(event.createdAt).toLocaleString() : 'Unknown'}`);
      console.log(`   Updated: ${event.updatedAt ? new Date(event.updatedAt).toLocaleString() : 'Unknown'}`);
      
      if (event.images && event.images.length > 0) {
        console.log(`   Image URLs:`);
        event.images.forEach((img, imgIndex) => {
          console.log(`     ${imgIndex + 1}. ${img.url}`);
        });
      }
    });

    console.log('\n' + '=' .repeat(80));

    // Category breakdown
    const normalEvents = await Event.countDocuments({ eventCategory: 'normal' });
    const corporateEvents = await Event.countDocuments({ eventCategory: 'corporate' });

    console.log('\n📈 Category Breakdown:');
    console.log(`   Normal Events: ${normalEvents}`);
    console.log(`   Corporate Events: ${corporateEvents}`);

    // Recent events (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentEvents = await Event.countDocuments({ 
      createdAt: { $gte: weekAgo } 
    });

    console.log(`\n📅 Events created in the last 7 days: ${recentEvents}`);

    // Events with insufficient images
    const eventsWithFewImages = await Event.countDocuments({
      $expr: { $lt: [{ $size: "$images" }, 3] }
    });

    const eventsWithTooManyImages = await Event.countDocuments({
      $expr: { $gt: [{ $size: "$images" }, 6] }
    });

    if (eventsWithFewImages > 0 || eventsWithTooManyImages > 0) {
      console.log('\n⚠️  Image Issues:');
      if (eventsWithFewImages > 0) {
        console.log(`   Events with less than 3 images: ${eventsWithFewImages}`);
      }
      if (eventsWithTooManyImages > 0) {
        console.log(`   Events with more than 6 images: ${eventsWithTooManyImages}`);
      }
    }

  } catch (error) {
    console.error('❌ Error checking events:', error);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Database connection failed. Please check:');
      console.log('   - MongoDB connection string in .env file');
      console.log('   - Network connectivity');
      console.log('   - MongoDB server status');
    }
  } finally {
    // Close the connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n🔌 Database connection closed.');
    }
  }
}

// Run the script
console.log('🚀 EFTA Events Database Checker');
console.log('================================\n');

checkEvents().then(() => {
  console.log('\n✅ Script completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
});
