import connectDB from "@/lib/mongoose";
import Product from "@/lib/models/product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Connect to database
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const limit = parseInt(searchParams.get('limit')) || 8;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Convert string ID to ObjectId
    const objectId = new mongoose.Types.ObjectId(productId);

    // First, get the current product to understand its category and tags
    const currentProduct = await Product.findById(objectId);
    if (!currentProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const currentCategory = currentProduct.giftType || currentProduct.type; // Support both new and old field for backward compatibility
    const currentTags = currentProduct.tags || [];

    // Build aggregation pipeline for finding similar products
    const pipeline = [
      // Exclude the current product - be more flexible with visible field
      { $match: { 
        _id: { $ne: objectId }, 
        $or: [
          { visible: true },
          { visible: { $exists: false } },
          { visible: null }
        ]
      } },
      
      // Add computed fields for scoring similarity
      {
        $addFields: {
          categoryMatch: { 
            $cond: [
              { $or: [
                { $eq: ["$giftType", currentCategory] },
                { $eq: ["$type", currentCategory] }  // backward compatibility
              ]}, 
              1, 
              0
            ] 
          },
          tagMatches: {
            $size: {
              $ifNull: [
                { $setIntersection: ["$tags", currentTags] },
                []
              ]
            }
          },
          totalTags: { $size: { $ifNull: ["$tags", []] } },
          // Calculate similarity score: category match (weight 10) + tag matches (weight 1 each)
          similarityScore: {
            $add: [
              { $multiply: [
                { $cond: [
                  { $or: [
                    { $eq: ["$giftType", currentCategory] },
                    { $eq: ["$type", currentCategory] }  // backward compatibility
                  ]}, 
                  1, 
                  0
                ]}, 
                10
              ]},
              {
                $size: {
                  $ifNull: [
                    { $setIntersection: ["$tags", currentTags] },
                    []
                  ]
                }
              }
            ]
          }
        }
      },
      
      // Sort by similarity score (descending), then by featured status, then by creation date
      {
        $sort: {
          similarityScore: -1,
          featured: -1,
          createdAt: -1
        }
      },
      
      // Limit results
      { $limit: limit }
    ];

    let similarProducts = await Product.aggregate(pipeline);

    // Check if we have any truly similar products (similarity score > 0)
    const hasTrulySimilar = similarProducts.some(p => p.similarityScore > 0);

    // If no truly similar products found, get completely random products instead
    if (!hasTrulySimilar || similarProducts.length === 0) {
      const randomProductsPipeline = [
        {
          $match: {
            _id: { $ne: objectId },
            $or: [
              { visible: true },
              { visible: { $exists: false } },
              { visible: null }
            ]
          }
        },
        { $sample: { size: limit } }, // Get random products
        {
          $addFields: {
            categoryMatch: { 
              $cond: [
                { $or: [
                  { $eq: ["$giftType", currentCategory] },
                  { $eq: ["$type", currentCategory] }  // backward compatibility
                ]}, 
                1, 
                0
              ] 
            },
            tagMatches: 0,
            similarityScore: 0
          }
        }
      ];
      
      similarProducts = await Product.aggregate(randomProductsPipeline);
    }
    // If we don't have enough similar products, add some random products to fill the gap
    else if (similarProducts.length < limit) {
      const remainingCount = limit - similarProducts.length;
      const excludeIds = [objectId, ...similarProducts.map(p => p._id)];
      
      // Use MongoDB aggregation to get random products
      const randomProductsPipeline = [
        {
          $match: {
            _id: { $nin: excludeIds },
            $or: [
              { visible: true },
              { visible: { $exists: false } },
              { visible: null }
            ]
          }
        },
        { $sample: { size: remainingCount } }, // Get random products
        {
          $addFields: {
            categoryMatch: { 
              $cond: [
                { $or: [
                  { $eq: ["$giftType", currentCategory] },
                  { $eq: ["$type", currentCategory] }  // backward compatibility
                ]}, 
                1, 
                0
              ] 
            },
            tagMatches: 0,
            similarityScore: 0
          }
        }
      ];
      
      const additionalProducts = await Product.aggregate(randomProductsPipeline);

      similarProducts = [...similarProducts, ...additionalProducts];
    }

    return NextResponse.json({
      success: true,
      products: similarProducts,
      total: similarProducts.length,
      currentProduct: {
        category: currentCategory,
        tags: currentTags
      }
    });

  } catch (error) {
    console.error("Error fetching similar products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch similar products" },
      { status: 500 }
    );
  }
}
