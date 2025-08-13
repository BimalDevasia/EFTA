"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import IconComponent from './IconComponent';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, formatErrorMessage } from '../utils/errorMessages';

// Predefined color options
const COLOR_OPTIONS = [
  { value: '#FB7D76', label: 'Coral Pink', preview: '#FB7D76' },
  { value: '#F06995', label: 'Hot Pink', preview: '#F06995' },
  { value: '#DB53AA', label: 'Purple Pink', preview: '#DB53AA' },
  { value: '#9B59B6', label: 'Amethyst', preview: '#9B59B6' },
  { value: '#E74C3C', label: 'Red', preview: '#E74C3C' },
  { value: '#3498DB', label: 'Blue', preview: '#3498DB' },
  { value: '#2ECC71', label: 'Green', preview: '#2ECC71' },
  { value: '#F39C12', label:'Orange', preview: '#F39C12' },
  { value: '#E67E22', label: 'Dark Orange', preview: '#E67E22' },
  { value: '#95A5A6', label: 'Gray', preview: '#95A5A6' }
];

// Available icons - Only icons that exist in IconComponent
const ICON_OPTIONS = [
  // Love & Romance Events
  { value: 'heart-fill', label: 'Heart (Filled)' },
  { value: 'favorite', label: 'Favorite Heart' },
  { value: 'valentine', label: 'Valentine' },
  { value: 'couple', label: 'Couple' },
  
  // Achievement & Celebration Events
  { value: 'star-fill', label: 'Star (Filled)' },
  { value: 'star', label: 'Star (Outline)' },
  { value: 'trophy-fill', label: 'Trophy' },
  
  // Gift & Birthday Events
  { value: 'gift-fill', label: 'Gift' },
  { value: 'cake', label: 'Cake' },
  { value: 'balloons', label: 'Balloons' },
  { value: 'birthday', label: 'Birthday' },
  
  // Music & Entertainment Events
  { value: 'music-note-beamed', label: 'Music Notes' },
  { value: 'music', label: 'Music' },
  
  // Photography & Memory Events
  { value: 'camera-fill', label: 'Camera' },
  { value: 'photo', label: 'Photo' },
  
  // Time & Schedule Events
  { value: 'calendar-fill', label: 'Calendar' },
  { value: 'clock-fill', label: 'Clock' },
  { value: 'schedule', label: 'Schedule' },
  
  // People & Social Events
  { value: 'person-fill', label: 'Person' },
  { value: 'people', label: 'People' },
  { value: 'family', label: 'Family' },
  
  // Location & Venue Events
  { value: 'house-fill', label: 'House' },
  { value: 'geo-alt-fill', label: 'Location' },
  { value: 'building', label: 'Building' },
  { value: 'map', label: 'Map' },
  
  // Communication Events
  { value: 'telephone-fill', label: 'Phone' },
  { value: 'envelope-fill', label: 'Email' },
  { value: 'chat', label: 'Chat' },
  
  // Weather & Outdoor Events
  { value: 'sun-fill', label: 'Sun' },
  { value: 'wb-sunny', label: 'Sunny Weather' },
  { value: 'moon-fill', label: 'Moon' },
  { value: 'cloud-fill', label: 'Cloud' },
  { value: 'snow', label: 'Snow' },
  { value: 'umbrella', label: 'Umbrella' },
  
  // Seasonal & Holiday Events
  { value: 'christmas', label: 'Christmas' },
  { value: 'halloween', label: 'Halloween' },
  { value: 'easter', label: 'Easter' },
  
  // Nature & Adventure Events
  { value: 'tree', label: 'Tree' },
  { value: 'mountain', label: 'Mountain' },
  { value: 'water', label: 'Water' },
  { value: 'fire', label: 'Fire' },
  { value: 'flower', label: 'Flower' },
  { value: 'leaf', label: 'Leaf' },
  
  // Sports & Fitness Events
  { value: 'sports', label: 'Sports' },
  { value: 'run', label: 'Running' },
  { value: 'fitness', label: 'Fitness' },
  
  // Business & Corporate Events
  { value: 'business', label: 'Business' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'presentation', label: 'Presentation' },
  
  // Food & Dining Events
  { value: 'food', label: 'Food' },
  { value: 'dining', label: 'Dining' },
  { value: 'party-food', label: 'Party Food' },
  
  // Utility Icons
  { value: 'bookmark-fill', label: 'Bookmark' },
  { value: 'search', label: 'Search' }
];

export default function AdminEventCategories() {
  const [eventCategories, setEventCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [iconSearch, setIconSearch] = useState('');
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    color: '#FB7D76',
    icon: 'heart-fill',
    products: [],
    isActive: true
  });
  const [errors, setErrors] = useState({});

  const { toasts, showSuccess, showError, showWarning, removeToast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  // Fetch event categories
  const fetchEventCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/event-categories');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched event categories:', data.eventCategories?.length || 0);
        setEventCategories(data.eventCategories || []);
      } else {
        showError('Unable to load categories. Please refresh the page and try again.');
      }
    } catch (error) {
      console.error('Error fetching event categories:', error);
      const errorMessage = formatErrorMessage(error, 'general');
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Fetch products for assignment
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch('/api/products?limit=1000&giftType=personalisedGift&visible=true&adminAccess=true');
      if (response.ok) {
        const data = await response.json();
        const visibleProducts = (data.products || []).filter(product => product.isVisible !== false);
        setProducts(visibleProducts);
      } else {
        console.error('Error fetching products - non-200 response');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchEventCategories();
    fetchProducts();
  }, [fetchEventCategories, fetchProducts]);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      color: '#FB7D76',
      icon: 'heart-fill',
      products: [],
      isActive: true
    });
    setSelectedProducts([]);
    setErrors({});
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a category name';
    }

    if (!formData.color) {
      newErrors.color = 'Please select a color for this category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Form data before validation:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    console.log('Form validation passed');
    setIsSubmitting(true);
    
    try {
      const url = editingCategory ? `/api/event-categories/${editingCategory._id}` : '/api/event-categories';
      const method = editingCategory ? 'PUT' : 'POST';
      
      // Auto-generate tag from title
      const autoGeneratedTag = formData.title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
      
      const submitData = {
        ...formData,
        tag: autoGeneratedTag, // Use auto-generated tag
        products: selectedProducts
      };
      
      console.log('Submitting data:', submitData);
      console.log('Auto-generated tag:', autoGeneratedTag);
      console.log('Method:', method, 'URL:', url);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (response.ok) {
        const successMessage = editingCategory 
          ? SUCCESS_MESSAGES.CATEGORY_UPDATED 
          : SUCCESS_MESSAGES.CATEGORY_CREATED;
        
        console.log('Category saved successfully');
        showSuccess(successMessage);
        
        // Refresh the categories list
        await fetchEventCategories();
        
        // Reset form and close
        setShowAddForm(false);
        setEditingCategory(null);
        resetForm();
      } else {
        console.error('API Error:', data);
        const errorMessage = formatErrorMessage(data.error || data.message, 'general');
        setErrors({ submit: errorMessage });
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Network error:', error);
      const errorMessage = formatErrorMessage(error, 'general');
      setErrors({ submit: errorMessage });
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (category) => {
    console.log('Editing category:', category);
    setEditingCategory(category);
    setFormData({
      title: category.title,
      color: category.color,
      icon: category.icon || category.emoji || 'heart-fill',
      products: category.products || [],
      isActive: category.isActive
    });
    
    // Set selected products - handle both ObjectId strings and populated objects
    const productIds = (category.products || []).map(product => 
      typeof product === 'string' ? product : product._id
    );
    setSelectedProducts(productIds);
    setShowAddForm(true); // Show the form when editing
  };

  // Handle delete
  const handleDelete = async (categoryId) => {
    if (!confirm('⚠️ Are you sure you want to delete this category? This action cannot be undone.')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/event-categories/${categoryId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(SUCCESS_MESSAGES.CATEGORY_DELETED);
        await fetchEventCategories();
      } else {
        const errorMessage = formatErrorMessage(result.error || result.message, 'general');
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      const errorMessage = formatErrorMessage(error, 'general');
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle product selection
  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Filter products based on search
  const filteredProducts = products.filter(product => {
    if (!productSearch) return true;
    return product.productName.toLowerCase().includes(productSearch.toLowerCase()) ||
           product.productId.toLowerCase().includes(productSearch.toLowerCase());
  });

  // Filter icons based on search
  const filteredIcons = ICON_OPTIONS.filter(icon => {
    if (!iconSearch) return true;
    return icon.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
           icon.value.toLowerCase().includes(iconSearch.toLowerCase());
  });

  // Update form data
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Event Categories</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (!showAddForm) {
              setEditingCategory(null);
              resetForm();
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showAddForm ? 'Back to List' : 'Add New Category'}
        </button>
      </div>

      {/* Add/Edit Form - Only show when form is active */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {editingCategory ? 'Edit Event Category' : 'Add New Event Category'}
            </h2>
              <p className="text-sm text-gray-600">
                {editingCategory 
                  ? 'Update the category information below and save your changes.'
                  : 'Create a new event category by filling out the form below.'
                }
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter category name (e.g., Birthday Gifts)"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Color *
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleInputChange('color', color.value)}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        formData.color === color.value 
                          ? 'border-blue-500 ring-2 ring-blue-200 scale-110' 
                          : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.preview }}
                      title={color.label}
                    >
                    </button>
                  ))}
                </div>
                {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Icon
                </label>
                <input
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                  placeholder="Search icons..."
                />
                {/* Fixed height container with proper overflow handling */}
                <div className="h-64 border border-gray-200 rounded-lg overflow-auto">
                  <div className="grid grid-cols-8 gap-2 p-3">
                    {filteredIcons.map((icon) => (
                      <button
                        key={icon.value}
                        type="button"
                        onClick={() => handleInputChange('icon', icon.value)}
                        className={`p-2 rounded-lg border transition-all ${
                          formData.icon === icon.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        title={icon.label}
                      >
                        <IconComponent 
                          icon={icon.value} 
                          className="w-8 h-8 mx-auto" 
                          color="#374151"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Selected: {ICON_OPTIONS.find(i => i.value === formData.icon)?.label || formData.icon}
                </p>
              </div>

              {/* Products */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Products ({selectedProducts.length} selected)
                </label>
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                  placeholder="Search products..."
                />
                {/* Fixed height container with proper overflow handling */}
                <div className="h-80 border border-gray-200 rounded-lg overflow-auto">
                  <div className="grid grid-cols-2 gap-3 p-3">
                    {isLoadingProducts ? (
                      <div className="col-span-2 text-center py-4">
                        <p className="text-gray-500">Loading products...</p>
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="col-span-2 text-center py-4">
                        <p className="text-gray-500">No products found</p>
                      </div>
                    ) : (
                      filteredProducts.map((product) => (
                        <label
                          key={product._id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedProducts.includes(product._id) 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => handleProductSelect(product._id)}
                            className="sr-only"
                          />
                          <div className="flex items-start space-x-3">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={product.images?.[0]?.url || '/product-image.png'}
                                alt={product.productName}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  e.target.src = '/product-image.png';
                                }}
                              />
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate mb-1">
                                {product.productName}
                              </div>
                              <div className="text-xs text-blue-600 font-medium mb-1">
                                ID: {product.productId}
                              </div>
                              {product.customizations && product.customizations.length > 0 && (
                                <div className="text-xs text-gray-500">
                                  {product.customizations.length} customization{product.customizations.length > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                            
                            {/* Selection Indicator */}
                            {selectedProducts.includes(product._id) && (
                              <div className="flex-shrink-0">
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Category is active and visible to customers
                </label>
              </div>

              {/* Category Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Preview
                </label>
                  <div 
                    className="flex justify-between lg:px-6 px-4 lg:h-16 h-12 lg:min-w-[280px] w-full items-center rounded-2xl lg:text-lg text-sm text-white font-poppins font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: formData.color }}
                  >
                    <div className="flex-1 truncate">
                      {formData.title || 'Category Name'}
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <IconComponent 
                        icon={formData.icon} 
                        className="w-8 h-8 text-white" 
                      />
                    </div>
                  </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List - Only show when form is not active */}
        {!showAddForm && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Existing Categories</h2>
            </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Loading event categories...</p>
            </div>
          ) : eventCategories.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No event categories found. Create your first category!</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="w-full overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preview
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tag
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {eventCategories.map((category) => (
                      <tr key={category._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div 
                            className="flex justify-between lg:px-6 px-4 lg:h-16 h-12 lg:min-w-[280px] w-full items-center rounded-2xl lg:text-lg text-sm text-white font-poppins font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: category.color }}
                          >
                            <div className="flex-1 truncate">
                              {category.title}
                            </div>
                            <div className="flex-shrink-0 ml-3">
                              <IconComponent 
                                icon={category.icon || category.emoji || 'heart-fill'} 
                                className="w-8 h-8 text-white" 
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{category.tag}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {category.products?.length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            category.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(category)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </div>
        )}
    </div>
  );
}