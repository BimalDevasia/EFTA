import { connectDB } from '@/lib/mongoose';
import EventCategory from '@/lib/models/eventCategory';
import { NextResponse } from 'next/server';

const defaultEventCategories = [
  {
    title: "Valentine's Day",
    tag: "valentine",
    color: "#FB7D76",
    emoji: "heart-fill",
    products: [],
    isActive: true
  },
  {
    title: "Christmas",
    tag: "christmas", 
    color: "#F06995",
    emoji: "christmas-tree",
    products: [],
    isActive: true
  },
  {
    title: "Halloween",
    tag: "halloween",
    color: "#DB53AA", 
    emoji: "pumpkin",
    products: [],
    isActive: true
  },
  {
    title: "Birthday",
    tag: "birthday",
    color: "#9B59B6",
    emoji: "birthday-cake",
    products: [],
    isActive: true
  },
  {
    title: "Anniversary",
    tag: "anniversary",
    color: "#E74C3C",
    emoji: "wedding-rings",
    products: [],
    isActive: true
  }
];

// POST - Initialize default event categories
export async function POST(req) {
  try {
    await connectDB();
    
    // Check if event categories already exist
    const existingCount = await EventCategory.countDocuments();
    
    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Found ${existingCount} existing event categories. Skipping initialization.`,
        existingCount
      });
    }
    
    // Create default event categories
    const createdCategories = await EventCategory.insertMany(defaultEventCategories);
    
    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdCategories.length} default event categories`,
      createdCategories
    });
    
  } catch (error) {
    console.error('Error initializing event categories:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
