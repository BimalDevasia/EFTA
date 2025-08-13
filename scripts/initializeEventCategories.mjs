import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

import { connectDB } from '../src/lib/mongoose.js';
import EventCategory from '../src/lib/models/eventCategory.js';

const defaultEventCategories = [
  {
    title: "Valentine's Day",
    tag: "valentine",
    color: "#FB7D76",
    emoji: "❤️",
    displayOrder: 1,
    isActive: true
  },
  {
    title: "Christmas",
    tag: "christmas", 
    color: "#F06995",
    emoji: "🎄",
    displayOrder: 2,
    isActive: true
  },
  {
    title: "Halloween",
    tag: "halloween",
    color: "#DB53AA", 
    emoji: "🎃",
    displayOrder: 3,
    isActive: true
  },
  {
    title: "Birthday",
    tag: "birthday",
    color: "#9B59B6",
    emoji: "🎂",
    displayOrder: 4,
    isActive: true
  },
  {
    title: "Anniversary",
    tag: "anniversary",
    color: "#E74C3C",
    emoji: "💕",
    displayOrder: 5,
    isActive: true
  }
];

async function initializeEventCategories() {
  try {
    await connectDB();
    
    // Check if event categories already exist
    const existingCount = await EventCategory.countDocuments();
    
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing event categories. Skipping initialization.`);
      return;
    }
    
    // Create default event categories
    const createdCategories = await EventCategory.insertMany(defaultEventCategories);
    
    console.log(`Successfully created ${createdCategories.length} default event categories:`);
    createdCategories.forEach(category => {
      console.log(`- ${category.title} (${category.tag})`);
    });
    
  } catch (error) {
    console.error('Error initializing event categories:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeEventCategories()
  .then(() => {
    console.log('Event categories initialization completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to initialize event categories:', error);
    process.exit(1);
  });
