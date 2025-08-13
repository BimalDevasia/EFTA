"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Wrapper from "@/components/Wrapper";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, Filter, X } from "lucide-react";
import React, { useState, useEffect, Suspense } from "react";
import UniversalProductCard from "@/components/UniversalProductCard";
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductListSkeleton } from "@/components/ui/product-skeleton";

const ProductListPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Wrapper className="pt-32 pb-12 px-10 lg:px-8">
          <ProductListSkeleton count={12} />
        </Wrapper>
      </div>
    }>
      <ProductListContent />
    </Suspense>
  );
};

const ProductListContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [pageTitle, setPageTitle] = useState('Products');
  const [urlParamsProcessed, setUrlParamsProcessed] = useState(false);
  const [skipClientFiltering, setSkipClientFiltering] = useState(false);

  // Hidden filters for URL parameters (not shown in UI)
  const [hiddenFilters, setHiddenFilters] = useState({
    featured: false,
    visible: false,
    giftType: null,
    category: null,
    eventCategory: null
  });

  // UI control flags
  const [hideCategoryFilter, setHideCategoryFilter] = useState(false);

  // Flag to track if we are loading from URL params or doing client-side filtering
  // (already declared above)

  // Initialize filters from URL parameters and fetch products in a single effect
  useEffect(() => {
    const fetchProductsAndSetupPage = async () => {
      try {
        setLoading(true);
        setUrlParamsProcessed(false);
        
        // 1. Extract URL parameters
        const categoryParam = searchParams.get('category');
        const giftTypeParam = searchParams.get('giftType');
        const typeParam = searchParams.get('type');
        const searchParam = searchParams.get('search');
        const priceParam = searchParams.get('price');
        const featuredParam = searchParams.get('featured');
        const visibleParam = searchParams.get('visible');
        const hideCategoryFilterParam = searchParams.get('hideCategoryFilter');
        const titleParam = searchParams.get('title');
        const tagsParam = searchParams.get('tags');
        const eventCategoryParam = searchParams.get('eventCategory');

        console.log('🔍 DEBUG - URL params:', { 
          category: categoryParam, 
          giftType: giftTypeParam,
          featured: featuredParam,
          visible: visibleParam,
          title: titleParam,
          tags: tagsParam,
          eventCategory: eventCategoryParam
        });

        // 2. Set UI state based on URL parameters
        if (typeParam) setSelectedType(typeParam);
        if (searchParam) setSearchTerm(searchParam);
        if (priceParam) setPriceRange(priceParam);

        // 3. Set page title
        if (titleParam) {
          setPageTitle(decodeURIComponent(titleParam));
        } else if (tagsParam) {
          // Handle special tag-based titles
          const tag = tagsParam.toLowerCase();
          if (tag === 'valentine') {
            setPageTitle("Valentine's Day Gifts");
          } else if (tag === 'christmas') {
            setPageTitle('Christmas Gifts');
          } else if (tag === 'halloween') {
            setPageTitle('Halloween Gifts');
          } else {
            setPageTitle(`${tag.charAt(0).toUpperCase() + tag.slice(1)} Gifts`);
          }
        } else if (featuredParam === 'true') {
          setPageTitle('Featured Gifts');
        } else if (giftTypeParam === 'personalisedGift') {
          setPageTitle('Personalised Gifts');
        } else if (giftTypeParam === 'corporateGift') {
          setPageTitle('Corporate Gifts');
        } else if (categoryParam === 'cake') {
          setPageTitle('Cakes');
        } else if (categoryParam === 'hamper') {
          setPageTitle('Hamper');
        } else if (categoryParam === 'decorative') {
          setPageTitle('Decoratives');
        } else if (categoryParam === 'chocolate') {
          setPageTitle('Chocolate');
        } else {
          setPageTitle('Products');
        }

        // Set category filter visibility
        setHideCategoryFilter(hideCategoryFilterParam === 'true');

        // Set category in UI only if not hidden and provided
        if (categoryParam && hideCategoryFilterParam !== 'true') {
          setSelectedCategory(categoryParam);
        }
        
        // 4. Build API query parameters directly from URL parameters
        const apiQueryParams = new URLSearchParams();
        
        // Add all relevant URL parameters to the API query
        if (giftTypeParam) apiQueryParams.set('giftType', giftTypeParam);
        if (categoryParam && hideCategoryFilterParam === 'true') apiQueryParams.set('category', categoryParam);
        if (featuredParam === 'true') apiQueryParams.set('featured', 'true');
        if (visibleParam === 'true') apiQueryParams.set('visible', 'true');
        if (tagsParam) apiQueryParams.set('tags', tagsParam);
        
        // 5. Set hidden filters for UI state
        const newHiddenFilters = {
          featured: featuredParam === 'true',
          visible: visibleParam === 'true',
          giftType: giftTypeParam,
          category: categoryParam && hideCategoryFilterParam === 'true' ? categoryParam : null,
          tags: tagsParam,
          eventCategory: eventCategoryParam
        };
        // If API is filtering for featured, cake, tags, or event category, skip client filtering
        const shouldSkipClientFiltering = (featuredParam === 'true') || (categoryParam === 'cake') || (tagsParam) || (eventCategoryParam);
        setSkipClientFiltering(shouldSkipClientFiltering);
        console.log('🔍 DEBUG - API query params:', apiQueryParams.toString());
        console.log('🔍 DEBUG - Setting hidden filters:', newHiddenFilters, 'skipClientFiltering:', shouldSkipClientFiltering);
        setHiddenFilters(newHiddenFilters);

        // 6. Fetch products with the constructed query
        let queryString, apiUrl;
        
        // Special handling for event categories - fetch associated products
        if (eventCategoryParam) {
          console.log('🔍 DEBUG - Fetching products for event category:', eventCategoryParam);
          apiUrl = `/api/products?eventCategory=${eventCategoryParam}`;
        } else {
          queryString = apiQueryParams.toString();
          apiUrl = `/api/products${queryString ? `?${queryString}` : ''}`;
        }
        
        console.log('🔍 DEBUG - Fetching products from:', apiUrl);
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        console.log('🔍 DEBUG - API Response:', response.status, data);
        
        if (response.ok) {
          console.log(`🔍 DEBUG - Found ${data.products?.length || 0} products`);
          // Set the fetched products
          setProducts(data.products || []);
          
          // Set filtered products directly here rather than waiting for useEffect
          setFilteredProducts(data.products || []);
        } else {
          console.error('Failed to fetch products:', data.error);
          setProducts([]);
          setFilteredProducts([]);
        }
        
        // 7. Fetch categories
        await fetchCategories();
        
        // Mark URL parameters as processed
        setUrlParamsProcessed(true);
        
      } catch (error) {
        console.error('Error in setup and fetch:', error);
        setProducts([]);
        setFilteredProducts([]);
        setUrlParamsProcessed(true);  // Mark as processed even on error
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndSetupPage();
  }, [searchParams]);

  const fetchCategories = async () => {
    // Fetch categories for filtering
    try {
      const response = await fetch('/api/products/categories');
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Convert categories to the format needed by the UI
        const categoryOptions = [
          { name: "All Categories", value: "all" },
          ...(data.categoriesData || []).map(cat => ({
            name: cat.displayName || cat.name,
            value: cat.name
          }))
        ];
        setCategories(categoryOptions);
      } else {
        console.error('Failed to fetch categories:', data.error);
        // Fallback to default categories
        setCategories([
          { name: "All Categories", value: "all" },
          { name: "Lamp", value: "lamp" },
          { name: "Bulb", value: "bulb" },
          { name: "Bundle", value: "bundle" },
          { name: "Cake", value: "cake" },
          { name: "Mug", value: "mug" },
          { name: "Frame", value: "frame" },
          { name: "Wallet", value: "wallet" },
          { name: "Keychain", value: "keychain" },
          { name: "T-Shirt", value: "tshirt" },
          { name: "Cushion", value: "cushion" }
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      setCategories([
        { name: "All Categories", value: "all" },
        { name: "Lamp", value: "lamp" },
        { name: "Bulb", value: "bulb" },
        { name: "Bundle", value: "bundle" },
        { name: "Cake", value: "cake" },
        { name: "Mug", value: "mug" },
        { name: "Frame", value: "frame" },
        { name: "Wallet", value: "wallet" },
        { name: "Keychain", value: "keychain" },
        { name: "T-Shirt", value: "tshirt" },
        { name: "Cushion", value: "cushion" }
      ]);
    }
  };

  const filterProducts = () => {
    console.log('🔍 DEBUG - filterProducts() called with:', {
      products: products.length,
      searchTerm,
      selectedCategory,
      hiddenFilters,
      selectedType,
      priceRange,
      urlParamsProcessed
    });
    
    let filtered = [...products]; // Create a copy to avoid mutation issues
    
    // If we have no products yet or URL params haven't been processed yet, or skipping client filtering, don't do any filtering
    if (filtered.length === 0 || !urlParamsProcessed || skipClientFiltering) {
      console.log('🔍 DEBUG - No products to filter or URL params still processing or skipping client filtering');
      return;
    }

    // Search filter - apply text search if present
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.tags && product.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Apply UI category filter only if not already filtered by URL parameters
    if (selectedCategory !== 'all' && !hiddenFilters.category) {
      filtered = filtered.filter(product => product.productCategory === selectedCategory);
    }

    // Apply product type filter (customization level)
    if (selectedType !== 'all') {
      filtered = filtered.filter(product => product.productType === selectedType);
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

    console.log(`🔍 DEBUG - Filtered products: ${filtered.length} (from ${products.length})`);
    // Only update if we actually have products to show
    if (filtered.length > 0 || products.length === 0) {
      setFilteredProducts(filtered);
    } else {
      console.warn('⚠️ Filter removed all products. Check filter criteria.');
    }
  };

  // This effect only runs for client-side filtering after initial load
  useEffect(() => {
    // Only run client-side filtering if URL params have been processed and not skipping
    if (urlParamsProcessed && !skipClientFiltering) {
      console.log('🔍 DEBUG - Client-side filterProducts triggered');
      filterProducts();
    }
  }, [urlParamsProcessed, skipClientFiltering, searchTerm, selectedCategory, selectedType, priceRange, products]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
    setPriceRange('all');
    setShowCategoryFilter(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Wrapper className="pt-32 pb-12 px-10 lg:px-8">
          <ProductListSkeleton count={12} />
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
                  { name: pageTitle === "Hamper" ? "Hamper" : pageTitle === "Decoratives" ? "Decoratives" : pageTitle === "Chocolate" ? "Chocolate" : pageTitle, href: pageTitle === "Hamper" ? "/products?category=hamper" : pageTitle === "Decoratives" ? "/products?category=decorative" : pageTitle === "Chocolate" ? "/products?category=chocolate" : "/products" },
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
                  }}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-2.5 rounded-full border transition-all duration-200 text-sm",
                    (selectedCategory !== 'all' || priceRange !== 'all' || selectedType !== 'all')
                      ? "bg-[#8300FF] text-white border-[#8300FF]" 
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#8300FF] hover:text-[#8300FF]"
                  )}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter</span>
                  {(selectedCategory !== 'all' || priceRange !== 'all' || selectedType !== 'all') && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                      {[selectedCategory !== 'all', priceRange !== 'all', selectedType !== 'all'].filter(Boolean).length}
                    </span>
                  )}
                </button>
                
                {showCategoryFilter && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-80">
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-800">Filters</h3>
                        <button
                          onClick={() => setShowCategoryFilter(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Category Section */}
                      {!hideCategoryFilter && (
                        <div className="mb-4">
                          <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Category</h4>
                          
                          {/* Category Search */}
                          <div className="relative mb-2">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                            <input
                              type="text"
                              placeholder="Search..."
                              value={categorySearchTerm}
                              onChange={(e) => setCategorySearchTerm(e.target.value)}
                              className="w-full pl-7 pr-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#8300FF] focus:border-[#8300FF]"
                            />
                          </div>
                          
                          {/* Filtered Categories */}
                          <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {categories
                              .filter(category => 
                                category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
                              )
                              .map((category) => (
                              <label
                                key={category.value}
                                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer text-xs"
                              >
                                <input
                                  type="radio"
                                  name="category"
                                  checked={selectedCategory === category.value}
                                  onChange={() => {
                                    setSelectedCategory(category.value);
                                    setCategorySearchTerm('');
                                  }}
                                  className="w-3 h-3 text-[#8300FF] border-gray-300 focus:ring-[#8300FF] focus:ring-1"
                                />
                                <span className="text-gray-700">{category.name}</span>
                              </label>
                            ))}
                          </div>
                          
                          {/* No results message */}
                          {categories.filter(category => 
                            category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
                          ).length === 0 && categorySearchTerm && (
                            <div className="text-center py-2 text-gray-500 text-xs">
                              No categories found
                            </div>
                          )}
                        </div>
                      )}

                      {/* Price Range Section */}
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Price Range</h4>
                        <div className="space-y-1">
                          {priceRanges.map((range) => (
                            <label
                              key={range.value}
                              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer text-xs"
                            >
                              <input
                                type="radio"
                                name="priceRange"
                                checked={priceRange === range.value}
                                onChange={() => setPriceRange(range.value)}
                                className="w-3 h-3 text-[#8300FF] border-gray-300 focus:ring-[#8300FF] focus:ring-1"
                              />
                              <span className="text-gray-700">{range.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Product Type Section */}
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Product Type</h4>
                        <div className="space-y-1">
                          {productTypes.map((type) => (
                            <label
                              key={type.value}
                              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer text-xs"
                            >
                              <input
                                type="radio"
                                name="productType"
                                checked={selectedType === type.value}
                                onChange={() => setSelectedType(type.value)}
                                className="w-3 h-3 text-[#8300FF] border-gray-300 focus:ring-[#8300FF] focus:ring-1"
                              />
                              <span className="text-gray-700">{type.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Clear All Filters Button */}
                      {(selectedCategory !== 'all' || priceRange !== 'all' || selectedType !== 'all') && (
                        <div className="pt-2 border-t border-gray-100">
                          <button
                            onClick={() => {
                              clearFilters();
                              setCategorySearchTerm('');
                            }}
                            className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-xs font-medium"
                          >
                            <X className="w-3 h-3" />
                            <span>Clear Filters</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Chips */}
          {((selectedCategory !== 'all' && !hideCategoryFilter) || priceRange !== 'all' || selectedType !== 'all') && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Filters:</span>
              {selectedCategory !== 'all' && !hideCategoryFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#8300FF]/10 text-[#8300FF] rounded-full text-xs font-medium">
                  {categories.find(cat => cat.value === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="hover:bg-[#8300FF]/20 rounded-full p-0.5 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {priceRange !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {priceRanges.find(range => range.value === priceRange)?.name}
                  <button
                    onClick={() => setPriceRange('all')}
                    className="hover:bg-green-200 rounded-full p-0.5 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  {productTypes.find(type => type.value === selectedType)?.name}
                  <button
                    onClick={() => setSelectedType('all')}
                    className="hover:bg-orange-200 rounded-full p-0.5 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  clearFilters();
                  setCategorySearchTerm('');
                }}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            // Calculate actual price like in other sections
            const actualPrice = product.offerPrice || 
              (product.offerPercentage > 0 ? 
                Math.round(product.productMRP * (100 - product.offerPercentage) / 100) : 
                product.productMRP);

            return (
              <UniversalProductCard
                key={product._id}
                id={product._id}
                name={product.productName}
                desc={product.description}
                price={actualPrice}
                originalPrice={product.offerPercentage > 0 ? product.productMRP : null}
                offerPercentage={product.offerPercentage || 0}
                productType={product.productType}
                image={product.images && product.images.length > 0 ? 
                  product.images[0].url : 
                  null}
                imageAlt={product.images && product.images.length > 0 ? 
                  product.images[0].alt || product.productName : 
                  product.productName}
              />
            );
          })}
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

const priceRanges = [
  { name: "All Prices", value: "all" },
  { name: "Under Rs 500", value: "under500" },
  { name: "Rs 500 - Rs 1,000", value: "500to1000" },
  { name: "Rs 1,000 - Rs 2,000", value: "1000to2000" },
  { name: "Above Rs 2,000", value: "above2000" },
];

const productTypes = [
  { name: "All Types", value: "all" },
  { name: "Customisable", value: "customisable" },
  { name: "Heavy Customisable", value: "heavyCustomisable" },
  { name: "Non-Customisable", value: "non-customisable" },
];

export default ProductListPage;
