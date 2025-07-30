"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Cache for categories to avoid repeated API calls
let categoriesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Default categories for immediate display
const DEFAULT_CATEGORIES = [
  'Lamp', 'Bulb', 'Bundle', 'Cake', 'Mug', 'Frame', 
  'Wallet', 'Keychain', 'T-Shirt', 'Cushion'
];

const CategoryInput = ({ 
  value, 
  onChange, 
  error, 
  placeholder = "Enter or select a category",
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState(DEFAULT_CATEGORIES);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Check if cache is still valid
  const isCacheValid = useCallback(() => {
    return categoriesCache && 
           cacheTimestamp && 
           (Date.now() - cacheTimestamp) < CACHE_DURATION;
  }, []);

  // Fetch existing categories with caching
  const fetchCategories = useCallback(async () => {
    // Return cached data if valid
    if (isCacheValid()) {
      setSuggestions(categoriesCache);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/products/categories', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        const categories = data.categories || DEFAULT_CATEGORIES;
        
        // Update cache
        categoriesCache = categories;
        cacheTimestamp = Date.now();
        
        setSuggestions(categories);
        console.log('CategoryInput: Fetched and cached categories:', categories.length);
      } else {
        console.error('Failed to fetch categories:', data.error);
        setSuggestions(DEFAULT_CATEGORIES);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSuggestions(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, [isCacheValid]);

  // Fetch categories on mount, but only if cache is invalid
  useEffect(() => {
    if (isCacheValid()) {
      setSuggestions(categoriesCache);
    } else {
      fetchCategories();
    }
  }, [fetchCategories, isCacheValid]);

  // Filter suggestions based on input
  useEffect(() => {
    if (value && suggestions.length > 0) {
      const filtered = suggestions.filter(category =>
        category.toLowerCase().includes(value.toLowerCase()) && 
        category.toLowerCase() !== value.toLowerCase()
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions);
    }
  }, [value, suggestions]);

  const handleInputChange = useCallback((e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setShowSuggestions(true);
  }, [onChange]);

  const handleSuggestionClick = useCallback((suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, [onChange]);

  // Function to create a new category (optimized)
  const createNewCategory = useCallback(async (categoryName) => {
    try {
      const response = await fetch('/api/products/categories', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryName.toLowerCase().trim(),
          displayName: categoryName.trim()
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        console.log('CategoryInput: New category created:', data.category);
        
        // Update cache immediately
        const newCategory = categoryName.trim();
        const updatedCategories = [...(categoriesCache || suggestions), newCategory].sort();
        categoriesCache = updatedCategories;
        cacheTimestamp = Date.now();
        setSuggestions(updatedCategories);
        
        return true;
      } else {
        console.error('Failed to create category:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error creating category:', error);
      return false;
    }
  }, [suggestions]);

  const handleNewCategoryAdd = useCallback((categoryName) => {
    console.log('CategoryInput: Adding new category:', categoryName);
    const trimmedName = categoryName.trim();
    
    // Add to local suggestions immediately for better UX
    setSuggestions(prev => {
      const exists = prev.some(cat => cat.toLowerCase() === trimmedName.toLowerCase());
      if (!exists) {
        const updated = [...prev, trimmedName].sort();
        // Update cache too
        categoriesCache = updated;
        cacheTimestamp = Date.now();
        return updated;
      }
      return prev;
    });
    
    // Create in database (fire and forget for better UX)
    createNewCategory(trimmedName);
    
    // Set the value and hide suggestions
    onChange(trimmedName);
    setShowSuggestions(false);
  }, [onChange, createNewCategory]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }, []);

  const handleFocus = useCallback(() => {
    setShowSuggestions(true);
  }, []);

  const handleBlur = useCallback((e) => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget)) {
        setShowSuggestions(false);
      }
    }, 150);
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent ${
          error ? 'border-red-300 bg-red-50' : ''
        } ${className}`}
        placeholder={placeholder}
        autoComplete="off"
      />
      
      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {loading ? (
            <div className="px-3 py-2 text-gray-500 text-sm">Loading categories...</div>
          ) : (
            <>
              {filteredSuggestions.map((category, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(category)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm capitalize"
                >
                  {category}
                </button>
              ))}
              
              {/* Show "Add new category" option if input doesn't match existing */}
              {value && !suggestions.some(cat => cat.toLowerCase() === value.toLowerCase()) && (
                <div className="border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleNewCategoryAdd(value)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none text-sm text-blue-600 font-medium"
                  >
                    + Add new category: "{value}"
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default React.memo(CategoryInput);
