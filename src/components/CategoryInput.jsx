"use client";
import React, { useState, useEffect, useRef } from 'react';

const CategoryInput = ({ 
  value, 
  onChange, 
  error, 
  placeholder = "Enter or select a category",
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Fetch existing categories
  useEffect(() => {
    const fetchCategories = async () => {
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
          console.log('CategoryInput: Fetched categories:', data.categories);
          setSuggestions(data.categories || []);
        } else {
          console.error('Failed to fetch categories:', data.error);
          // Set some default categories if API fails
          const defaultCategories = ['Lamp', 'Bulb', 'Bundle', 'Cake', 'Mug', 'Frame', 'Wallet', 'Keychain', 'T-Shirt', 'Cushion'];
          setSuggestions(defaultCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Set some default categories if network fails
        const defaultCategories = ['Lamp', 'Bulb', 'Bundle', 'Cake', 'Mug', 'Frame', 'Wallet', 'Keychain', 'T-Shirt', 'Cushion'];
        setSuggestions(defaultCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    console.log('CategoryInput: Value changed to:', inputValue);
    onChange(inputValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('CategoryInput: Suggestion clicked:', suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Function to create a new category
  const createNewCategory = async (categoryName) => {
    try {
      const response = await fetch('/api/products/categories', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryName,
          displayName: categoryName
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        console.log('CategoryInput: New category created:', data.category);
        // Refresh categories list
        setSuggestions(prev => [...prev, categoryName].sort());
      } else {
        console.error('Failed to create category:', data.error);
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleNewCategoryAdd = (categoryName) => {
    console.log('CategoryInput: Adding new category:', categoryName);
    // Add to local suggestions immediately for better UX
    setSuggestions(prev => {
      if (!prev.some(cat => cat.toLowerCase() === categoryName.toLowerCase())) {
        return [...prev, categoryName].sort();
      }
      return prev;
    });
    
    // Create in database (fire and forget for better UX)
    createNewCategory(categoryName);
    
    // Set the value and hide suggestions
    onChange(categoryName);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = (e) => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget)) {
        setShowSuggestions(false);
      }
    }, 150);
  };

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

export default CategoryInput;
