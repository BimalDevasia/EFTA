require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Banner Schema
const bannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  image: {
    url: String,
    public_id: String,
    alt: String
  },
  pageType: {
    type: String,
    enum: ['home', 'gifts', 'courses', 'events', 'corporate'],
    unique: true
  },
  buttonText: String,
  buttonColor: String,
  buttonLink: String,
  isActive: Boolean
}, {
  timestamps: true
});

const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

async function updateBannerColors() {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB successfully');

    console.log('🎨 Updating banner colors to match frontend...');
    
    // Update gifts banner color
    await Banner.updateOne(
      { pageType: 'gifts' },
      { buttonColor: '#F46782' }  // primary_color
    );
    console.log('✅ Updated gifts banner color to #F46782 (primary_color)');

    // Update courses banner color
    await Banner.updateOne(
      { pageType: 'courses' },
      { buttonColor: '#1F76BD' }  // gift_blue
    );
    console.log('✅ Updated courses banner color to #1F76BD (gift_blue)');

    // Update events banner color
    await Banner.updateOne(
      { pageType: 'events' },
      { buttonColor: '#1F76BD' }  // gift_blue
    );
    console.log('✅ Updated events banner color to #1F76BD (gift_blue)');

    // Update corporate banner color
    await Banner.updateOne(
      { pageType: 'corporate' },
      { buttonColor: '#1F76BD' }  // gift_blue
    );
    console.log('✅ Updated corporate banner color to #1F76BD (gift_blue)');

    console.log('\n📊 Updated Banner Colors Summary:');
    
    const allBanners = await Banner.find({});
    allBanners.forEach(banner => {
      console.log(`   • ${banner.pageType.toUpperCase()}: "${banner.subtitle} ${banner.title}" - ${banner.buttonText} (${banner.buttonColor})`);
    });

    console.log('\n🎉 Banner colors updated successfully to match frontend!');
    
  } catch (error) {
    console.error('❌ Error updating banner colors:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the update
updateBannerColors();
