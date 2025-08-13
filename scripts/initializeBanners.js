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
    unique: true
  },
  buttonText: {
    type: String,
    default: 'Shop Now'
  },
  buttonColor: {
    type: String,
    default: '#8300FF',
    enum: ['#8300FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57']
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

const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

const bannerData = [
  {
    title: "Valentine",
    subtitle: "Surprise your",
    description: "Create unique and memorable gifts for your loved ones with our personalized collection",
    pageType: "gifts",
    buttonText: "Shop Gifts",
    buttonColor: "#8300FF",
    buttonLink: "/gifts",
    image: {
      url: "/giftmain.png",
      public_id: "default_gift_banner",
      alt: "Personalized Gifts Banner"
    },
    isActive: true
  },
  {
    title: "Creativity",
    subtitle: "Unlock",
    description: "Learn new skills with our comprehensive course offerings and expert instructors",
    pageType: "courses",
    buttonText: "Browse Courses",
    buttonColor: "#4ECDC4",
    buttonLink: "/courses",
    image: {
      url: "/coursesfront.png",
      public_id: "default_course_banner",
      alt: "Courses Banner"
    },
    isActive: true
  },
  {
    title: "Style",
    subtitle: "Celebrate In",
    description: "Discover and join exciting events in your area with professional planning services",
    pageType: "events",
    buttonText: "View Events",
    buttonColor: "#FF6B6B",
    buttonLink: "/events",
    image: {
      url: "/eventmain.png",
      public_id: "default_event_banner",
      alt: "Events Banner"
    },
    isActive: true
  },
  {
    title: "Company",
    subtitle: "Brand your",
    description: "Professional solutions for your business needs with custom corporate gifts and services",
    pageType: "corporate",
    buttonText: "Learn More",
    buttonColor: "#45B7D1",
    buttonLink: "/corporate",
    image: {
      url: "/corporatefront.png",
      public_id: "default_corporate_banner",
      alt: "Corporate Banner"
    },
    isActive: true
  }
];

async function initializeBanners() {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB successfully');

    console.log('🗑️  Clearing existing banners...');
    await Banner.deleteMany({});
    console.log('✅ Existing banners cleared');

    console.log('📝 Creating default banners...');
    
    for (const bannerInfo of bannerData) {
      try {
        const banner = new Banner(bannerInfo);
        await banner.save();
        console.log(`✅ Created ${bannerInfo.pageType} banner: "${bannerInfo.subtitle} ${bannerInfo.title}"`);
      } catch (error) {
        console.error(`❌ Error creating ${bannerInfo.pageType} banner:`, error.message);
      }
    }

    console.log('\n🎉 Banner initialization completed successfully!');
    console.log('\n📊 Summary:');
    
    const allBanners = await Banner.find({});
    allBanners.forEach(banner => {
      console.log(`   • ${banner.pageType.toUpperCase()}: "${banner.subtitle} ${banner.title}" - ${banner.buttonText} (${banner.buttonColor})`);
    });

    console.log('\n🗃️  Script completed. The initialization script can now be removed.');
    
  } catch (error) {
    console.error('❌ Error initializing banners:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the initialization
initializeBanners();
