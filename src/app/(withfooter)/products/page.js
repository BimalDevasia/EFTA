"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Wrapper from "@/components/Wrapper";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, Filter, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FeaturedGiftCard } from "@/components/home/ExploreMoreGifts";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, priceRange]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      
      let allProducts = [];
      
      if (response.ok) {
        allProducts = data.products || [];
      } else {
        console.error('Failed to fetch products:', data.error);
      }
      
      // Add dummy products for demonstration
      const dummyProducts = [
        {
          _id: 'dummy-1',
          productName: 'Customized Birthday Cake',
          productCategory: 'cake',
          description: 'Delicious chocolate birthday cake with custom message and design',
          productMRP: 1200,
          offerPrice: 999,
          offerPercentage: 17,
          productType: 'customisable',
          tags: ['birthday', 'chocolate', 'custom'],
          images: [
            {
              url: '/cake.png',
              alt: 'Birthday Cake'
            }
          ]
        },
        {
          _id: 'dummy-2',
          productName: 'Personalized Photo Frame',
          productCategory: 'gift',
          description: 'Beautiful wooden photo frame with custom engraving',
          productMRP: 800,
          offerPrice: 650,
          offerPercentage: 19,
          productType: 'customisable',
          tags: ['photo', 'frame', 'personalized', 'wood'],
          images: [
            {
              url: '/gift.png',
              alt: 'Photo Frame'
            }
          ]
        },
        {
          _id: 'dummy-3',
          productName: 'Custom T-Shirt Design',
          productCategory: 'gift',
          description: 'High-quality cotton t-shirt with your custom design or text',
          productMRP: 599,
          offerPrice: 449,
          offerPercentage: 25,
          productType: 'customisable',
          tags: ['t-shirt', 'custom', 'clothing', 'cotton'],
          images: [
            {
              url: '/t-shirt.png',
              alt: 'Custom T-Shirt'
            }
          ]
        },
        {
          _id: 'dummy-4',
          productName: 'Wedding Gift Bundle',
          productCategory: 'bundle',
          description: 'Complete wedding gift set with photo album, frame, and chocolates',
          productMRP: 2500,
          offerPrice: 1999,
          offerPercentage: 20,
          productType: 'non-customisable',
          tags: ['wedding', 'bundle', 'gift set', 'album'],
          images: [
            {
              url: '/gift.svg',
              alt: 'Wedding Bundle'
            }
          ]
        },
        {
          _id: 'dummy-5',
          productName: 'Chocolate Birthday Bundle',
          productCategory: 'bundle',
          description: 'Birthday special bundle with cake, chocolates, and greeting card',
          productMRP: 1800,
          offerPrice: 1499,
          offerPercentage: 17,
          productType: 'customisable',
          tags: ['birthday', 'chocolate', 'bundle', 'cake'],
          images: [
            {
              url: '/chocolate.png',
              alt: 'Chocolate Bundle'
            }
          ]
        },
        {
          _id: 'dummy-6',
          productName: 'Anniversary Special Cake',
          productCategory: 'cake',
          description: 'Romantic heart-shaped cake perfect for anniversaries',
          productMRP: 1500,
          offerPrice: 1299,
          offerPercentage: 13,
          productType: 'customisable',
          tags: ['anniversary', 'heart', 'romantic', 'special'],
          images: [
            {
              url: '/love.svg',
              alt: 'Anniversary Cake'
            }
          ]
        },
        {
          _id: 'dummy-7',
          productName: 'Personalized Mug',
          productCategory: 'gift',
          description: 'Ceramic mug with custom photo and text printing',
          productMRP: 399,
          offerPrice: 299,
          offerPercentage: 25,
          productType: 'customisable',
          tags: ['mug', 'personalized', 'ceramic', 'photo'],
          images: [
            {
              url: '/gift.png',
              alt: 'Personalized Mug'
            }
          ]
        },
        {
          _id: 'dummy-8',
          productName: 'Corporate Gift Set',
          productCategory: 'bundle',
          description: 'Professional gift set with branded items for corporate events',
          productMRP: 3000,
          offerPrice: 2499,
          offerPercentage: 17,
          productType: 'customisable',
          tags: ['corporate', 'professional', 'branded', 'business'],
          images: [
            {
              url: '/coperatefront.png',
              alt: 'Corporate Gift'
            }
          ]
        }
      ];
      
      // Combine API products with dummy products
      setProducts([...allProducts, ...dummyProducts]);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      // If API fails, show only dummy products
      const dummyProducts = [
        {
          _id: 'dummy-1',
          productName: 'Customized Birthday Cake',
          productCategory: 'cake',
          description: 'Delicious chocolate birthday cake with custom message and design',
          productMRP: 1200,
          offerPrice: 999,
          offerPercentage: 17,
          productType: 'customisable',
          tags: ['birthday', 'chocolate', 'custom'],
          images: [
            {
              url: '/cake.png',
              alt: 'Birthday Cake'
            }
          ]
        },
        {
          _id: 'dummy-2',
          productName: 'Personalized Photo Frame',
          productCategory: 'gift',
          description: 'Beautiful wooden photo frame with custom engraving',
          productMRP: 800,
          offerPrice: 650,
          offerPercentage: 19,
          productType: 'customisable',
          tags: ['photo', 'frame', 'personalized', 'wood'],
          images: [
            {
              url: '/gift.png',
              alt: 'Photo Frame'
            }
          ]
        },
        {
          _id: 'dummy-3',
          productName: 'Custom T-Shirt Design',
          productCategory: 'gift',
          description: 'High-quality cotton t-shirt with your custom design or text',
          productMRP: 599,
          offerPrice: 449,
          offerPercentage: 25,
          productType: 'customisable',
          tags: ['t-shirt', 'custom', 'clothing', 'cotton'],
          images: [
            {
              url: '/t-shirt.png',
              alt: 'Custom T-Shirt'
            }
          ]
        },
        {
          _id: 'dummy-4',
          productName: 'Wedding Gift Bundle',
          productCategory: 'bundle',
          description: 'Complete wedding gift set with photo album, frame, and chocolates',
          productMRP: 2500,
          offerPrice: 1999,
          offerPercentage: 20,
          productType: 'non-customisable',
          tags: ['wedding', 'bundle', 'gift set', 'album'],
          images: [
            {
              url: '/gift.svg',
              alt: 'Wedding Bundle'
            }
          ]
        },
        {
          _id: 'dummy-5',
          productName: 'Chocolate Birthday Bundle',
          productCategory: 'bundle',
          description: 'Birthday special bundle with cake, chocolates, and greeting card',
          productMRP: 1800,
          offerPrice: 1499,
          offerPercentage: 17,
          productType: 'customisable',
          tags: ['birthday', 'chocolate', 'bundle', 'cake'],
          images: [
            {
              url: '/chocolate.png',
              alt: 'Chocolate Bundle'
            }
          ]
        },
        {
          _id: 'dummy-6',
          productName: 'Anniversary Special Cake',
          productCategory: 'cake',
          description: 'Romantic heart-shaped cake perfect for anniversaries',
          productMRP: 1500,
          offerPrice: 1299,
          offerPercentage: 13,
          productType: 'customisable',
          tags: ['anniversary', 'heart', 'romantic', 'special'],
          images: [
            {
              url: '/love.svg',
              alt: 'Anniversary Cake'
            }
          ]
        },
        {
          _id: 'dummy-7',
          productName: 'Personalized Mug',
          productCategory: 'gift',
          description: 'Ceramic mug with custom photo and text printing',
          productMRP: 399,
          offerPrice: 299,
          offerPercentage: 25,
          productType: 'customisable',
          tags: ['mug', 'personalized', 'ceramic', 'photo'],
          images: [
            {
              url: '/gift.png',
              alt: 'Personalized Mug'
            }
          ]
        },
        {
          _id: 'dummy-8',
          productName: 'Corporate Gift Set',
          productCategory: 'bundle',
          description: 'Professional gift set with branded items for corporate events',
          productMRP: 3000,
          offerPrice: 2499,
          offerPercentage: 17,
          productType: 'customisable',
          tags: ['corporate', 'professional', 'branded', 'business'],
          images: [
            {
              url: '/coperatefront.png',
              alt: 'Corporate Gift'
            }
          ]
        }
      ];
      setProducts(dummyProducts);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.tags && product.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.productCategory === selectedCategory);
    }

    // Price filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = product.offerPrice || product.productMRP;
        switch (priceRange) {
          case 'under500':
            return price < 500;
          case '500to1000':
            return price >= 500 && price <= 1000;
          case '1000to2000':
            return price >= 1000 && price <= 2000;
          case 'above2000':
            return price > 2000;
          default:
            return true;
        }
      });
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange('all');
    setShowCategoryFilter(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Wrapper className="pt-32 pb-12 px-10 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8300FF]"></div>
          </div>
        </Wrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Wrapper className="pt-32 pb-12 px-10 lg:px-8">
        <div className="space-y-8">
          {/* Breadcrumb, Search and Filter Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <Breadcrumb
              links={[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
              ]}
            />
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 lg:flex-1 lg:max-w-xl lg:ml-8">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent text-gray-700 placeholder-gray-400 text-sm"
                />
              </div>

              {/* Combined Filter Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowCategoryFilter(!showCategoryFilter);
                    setShowPriceFilter(false);
                  }}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200",
                    (selectedCategory !== 'all' || priceRange !== 'all')
                      ? "bg-[#8300FF] text-white border-[#8300FF]" 
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#8300FF]"
                  )}
                >
                  <Filter className="w-4 h-4" />
                </button>
                
                {showCategoryFilter && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[280px]">
                    <div className="p-4">
                      {/* Category Section */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <button
                              key={category.value}
                              onClick={() => setSelectedCategory(category.value)}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-md transition-colors text-sm",
                                selectedCategory === category.value
                                  ? "bg-[#8300FF] text-white"
                                  : "hover:bg-gray-100 text-gray-700"
                              )}
                            >
                              {category.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price Range Section */}
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h3>
                        <div className="space-y-2">
                          {priceRanges.map((range) => (
                            <button
                              key={range.value}
                              onClick={() => setPriceRange(range.value)}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-md transition-colors text-sm",
                                priceRange === range.value
                                  ? "bg-[#8300FF] text-white"
                                  : "hover:bg-gray-100 text-gray-700"
                              )}
                            >
                              {range.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Clear Filters Button */}
                      {(selectedCategory !== 'all' || priceRange !== 'all') && (
                        <div className="pt-3 border-t border-gray-200">
                          <button
                            onClick={() => {
                              clearFilters();
                              setShowCategoryFilter(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
                          >
                            <X className="w-4 h-4" />
                            <span>Clear All Filters</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center text-gray-600">
            <span className="font-medium">{filteredProducts.length}</span> products found
          </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <FeaturedGiftCard
              key={product._id}
              id={product._id}
              name={product.productName}
              price={`Rs ${product.offerPrice || product.productMRP}`}
              discountedPrice={product.offerPercentage > 0 ? `Rs ${product.productMRP}` : null}
              desc={product.description}
              image={product.images && product.images.length > 0 ? 
                product.images[0].url : 
                null}
              imageAlt={product.images && product.images.length > 0 ? product.images[0].alt || product.productName : product.productName}
              isCustom={product.productType !== 'non-customisable'}
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">No products found</div>
            <div className="text-gray-400">Try adjusting your search or filters</div>
          </div>
        )}
        </div>
      </Wrapper>
    </div>
  );
};

const categories = [
  { name: "All Categories", value: "all" },
  { name: "Gifts", value: "gift" },
  { name: "Bundles", value: "bundle" },
  { name: "Cakes", value: "cake" },
];

const priceRanges = [
  { name: "All Prices", value: "all" },
  { name: "Under Rs 500", value: "under500" },
  { name: "Rs 500 - Rs 1,000", value: "500to1000" },
  { name: "Rs 1,000 - Rs 2,000", value: "1000to2000" },
  { name: "Above Rs 2,000", value: "above2000" },
];

export default ProductListPage;
