const mongoose = require('mongoose');
require('dotenv').config();

// Simple script to check normal events specifically
async function checkNormalEvents() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully\n');

    // Use a simple query without schemas to avoid model issues
    const db = mongoose.connection.db;
    const eventsCollection = db.collection('events');

    // Get normal events only
    const normalEvents = await eventsCollection.find({ eventCategory: 'normal' }).toArray();
    
    console.log(`📊 Normal Events Found: ${normalEvents.length}\n`);

    if (normalEvents.length === 0) {
      console.log('❌ No normal events found in database.');
      console.log('💡 Current events check:');
      
      // Check all events
      const allEvents = await eventsCollection.find({}).toArray();
      console.log(`📊 Total Events: ${allEvents.length}`);
      
      allEvents.forEach((event, index) => {
        console.log(`${index + 1}. ${event.eventName} - Category: ${event.eventCategory}`);
      });
    } else {
      normalEvents.forEach((event, index) => {
        console.log(`${index + 1}. Event: ${event.eventName}`);
        console.log(`   Category: ${event.eventCategory}`);
        console.log(`   Description: ${event.eventDescription.substring(0, 100)}...`);
        console.log(`   Images: ${event.images ? event.images.length : 0}`);
        if (event.images && event.images.length > 0) {
          console.log(`   First Image: ${event.images[0].url}`);
        }
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
}

checkNormalEvents().then(() => {
  console.log('✅ Script completed!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
