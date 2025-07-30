import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import ProductCategory from '@/lib/models/productCategory';
import { verifyAdmin } from '@/lib/auth-helpers';

// GET - Fetch all active product categories (optimized)
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let query = { isActive: true };
    
    // If search parameter is provided, filter categories
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } }
      ];
    }

    // Use lean() for better performance and limit fields
    const categories = await ProductCategory.find(query, {
      name: 1,
      displayName: 1,
      productCount: 1
    })
      .sort({ productCount: -1, name: 1 })
      .lean()
      .limit(50); // Limit to prevent excessive data transfer
    
    // Extract just the display names for the dropdown
    const categoryNames = categories.map(cat => cat.displayName);
    
    // Add some default categories if no categories exist yet
    if (categoryNames.length === 0) {
      const defaultCategories = [
        'Lamp', 'Bulb', 'Bundle', 'Cake', 'Mug', 
        'Frame', 'Wallet', 'Keychain', 'T-Shirt', 'Cushion'
      ];
      
      return NextResponse.json({
        success: true,
        categories: defaultCategories,
        categoriesData: defaultCategories.map(name => ({ 
          name: name.toLowerCase(), 
          displayName: name,
          productCount: 0 
        }))
      });
    }
    
    // Set cache headers for better performance
    const response = NextResponse.json({
      success: true,
      categories: categoryNames,
      categoriesData: categories
    });
    
    // Cache for 5 minutes
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    
    return response;
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create a new product category
export async function POST(request) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { name, displayName, description } = body;
    
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    // Check if category already exists
    const normalizedName = name.toLowerCase().trim();
    const existingCategory = await ProductCategory.findOne({ name: normalizedName });
    
    if (existingCategory) {
      return NextResponse.json({
        success: true,
        category: existingCategory,
        message: 'Category already exists'
      });
    }
    
    // Create new category
    const category = new ProductCategory({
      name: normalizedName,
      displayName: displayName || name.trim(),
      description: description || '',
      createdBy: adminUser.id
    });
    
    await category.save();
    
    return NextResponse.json({
      success: true,
      category,
      message: 'Category created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
