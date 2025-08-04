"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CategoryInput from './CategoryInput';

const AdminProducts = ({ categoryId, hideHeading = false }) => {
  // Use categoryId from dynamic route if provided
  const effectiveCategory = categoryId || 'gift';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    description: '',
    productDetails: '',
    specifications: [],
    whatsInside: [],
    productCategory: '',
    productMRP: '',
    offerType: 'none',
    offerPercentage: '',
    offerPrice: '',
    productType: 'non-customisable',
    images: [],
    tags: [],
    tagsInput: '',
    isVisible: true,
    isFeatured: false,
    colors: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [checkingProductId, setCheckingProductId] = useState(false);
  const [productIdStatus, setProductIdStatus] = useState({ available: null, message: '' });
  const [togglingVisibility, setTogglingVisibility] = useState(null); // Track which product is being toggled
  const [searchTerm, setSearchTerm] = useState(''); // Search functionality
  const [selectedProducts, setSelectedProducts] = useState([]); // Selected products for batch operations
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('all'); // Category filter
  const [featuredFilter, setFeaturedFilter] = useState('all'); // Featured filter (all, featured, unfeatured)
  const [visibilityFilter, setVisibilityFilter] = useState('all'); // Visibility filter (all, visible, hidden)

  const { user } = useAuth();
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    if (!effectiveCategory) return; // Do not fetch if category is not set

    try {
      setLoading(true);
      // Map category to correct API param
      let apiCategory = effectiveCategory;
      if (effectiveCategory === 'corporate') {
        apiCategory = 'corporateGift';
      }
      if (effectiveCategory === 'gift') {
        apiCategory = 'personalisedGift';
      }
      
      const response = await fetch(`/api/products?giftType=${apiCategory}`);
      const data = await response.json();
      console.log('API response status:', response.status);
      console.log('API response data:', data);
      
      if (response.ok) {
        console.log(`Fetched ${data.products?.length || 0} products for ${apiCategory}`);
        setProducts(data.products || []);
      } else {
        console.error('Failed to fetch products:', data.error);
        setProducts([]); // Clear products on error
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Clear products on error
    } finally {
      setLoading(false);
    }
  }, [effectiveCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Re-fetch when category changes

  // Clear selections when filters change
  useEffect(() => {
    setSelectedProducts([]);
  }, [categoryFilter, featuredFilter, visibilityFilter, searchTerm]);

  const resetForm = () => {
    setFormData({
      productId: '',
      productName: '',
      description: '',
      productDetails: '',
      specifications: [],
      whatsInside: [],
      productCategory: '',
      productMRP: '',
      offerType: 'none',
      offerPercentage: '',
      offerPrice: '',
      productType: 'non-customisable',
      images: [],
      tags: [],
      tagsInput: '',
      colors: [],
      isVisible: true,
      isFeatured: false
    });
    setErrors({});
    setProductIdStatus({ available: null, message: '' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = value;
    
    // Special handling for productId - convert to lowercase and remove spaces
    if (name === 'productId') {
      processedValue = value.toLowerCase().replace(/\s+/g, '-');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Check product ID availability in real-time
    if (name === 'productId' && processedValue.trim() && !editingProduct) {
      checkProductIdAvailability(processedValue);
    } else if (name === 'productId' && !processedValue.trim()) {
      setProductIdStatus({ available: null, message: '' });
    }
  };

  const checkProductIdAvailability = async (productId) => {
    if (!productId.trim()) return;
    
    setCheckingProductId(true);
    try {
      const response = await fetch(`/api/products/check-id?productId=${encodeURIComponent(productId)}`);
      const data = await response.json();
      
      if (response.ok) {
        setProductIdStatus({
          available: data.available,
          message: data.available ? 'Product ID is available' : 'Product ID is already taken'
        });
      } else {
        setProductIdStatus({
          available: false,
          message: 'Error checking product ID'
        });
      }
    } catch (error) {
      console.error('Error checking product ID:', error);
      setProductIdStatus({
        available: false,
        message: 'Error checking product ID'
      });
    } finally {
      setCheckingProductId(false);
    }
  };

  const handleTagsChange = (e) => {
    const value = e.target.value.toLowerCase(); // Convert to lowercase
    
    // Split by comma and clean up tags
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    setFormData(prev => ({
      ...prev,
      tagsInput: value, // Store the raw input
      tags: tags // Store the processed tags array
    }));
    
    // Clear error when user starts typing
    if (errors.tags) {
      setErrors(prev => ({ ...prev, tags: '' }));
    }
  };

  // Specifications management
  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { heading: '', details: [{ key: '', value: '' }] }]
    }));
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const updateSpecificationHeading = (index, heading) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, heading } : spec
      )
    }));
  };

  const addSpecificationDetail = (specIndex) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === specIndex 
          ? { ...spec, details: [...spec.details, { key: '', value: '' }] }
          : spec
      )
    }));
  };

  const removeSpecificationDetail = (specIndex, detailIndex) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === specIndex 
          ? { ...spec, details: spec.details.filter((_, j) => j !== detailIndex) }
          : spec
      )
    }));
  };

  const updateSpecificationDetail = (specIndex, detailIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === specIndex 
          ? { 
              ...spec, 
              details: spec.details.map((detail, j) => 
                j === detailIndex ? { ...detail, [field]: value } : detail
              )
            }
          : spec
      )
    }));
  };

  // What's Inside management
  const addWhatsInsideItem = () => {
    setFormData(prev => ({
      ...prev,
      whatsInside: [...prev.whatsInside, '']
    }));
  };

  const removeWhatsInsideItem = (index) => {
    setFormData(prev => ({
      ...prev,
      whatsInside: prev.whatsInside.filter((_, i) => i !== index)
    }));
  };

  const updateWhatsInsideItem = (index, value) => {
    setFormData(prev => ({
      ...prev,
      whatsInside: prev.whatsInside.map((item, i) => i === index ? value : item)
    }));
  };

  // Color management functions
  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: '', hex: '#000000' }]
    }));
  };

  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const updateColor = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...result.images.map(img => ({
          url: img.url,
          public_id: img.public_id,
          alt: ''
        }))]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      // Show detailed image upload error
      const uploadErrorMessage = error.message 
        ? `Failed to upload images: ${error.message}` 
        : 'Failed to upload images - please try again';
      setErrors(prev => ({ ...prev, images: uploadErrorMessage }));
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productId.trim()) newErrors.productId = 'Product ID is required';
    if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.productDetails.trim()) newErrors.productDetails = 'Product details are required';
    if (!formData.productCategory.trim()) newErrors.productCategory = 'Product category is required';
    if (!formData.productMRP || formData.productMRP <= 0) newErrors.productMRP = 'Valid MRP is required';
    
    // Check if product ID is available (only for new products)
    if (!editingProduct && !productIdStatus.available && formData.productId.trim()) {
      newErrors.productId = 'Product ID is not available or not checked yet';
    }
    
    // Validate offers based on offer type
    if (formData.offerType === 'percentage') {
      if (!formData.offerPercentage || formData.offerPercentage <= 0) {
        newErrors.offerPercentage = 'Offer percentage is required when offer type is percentage';
      } else if (formData.offerPercentage > 100) {
        newErrors.offerPercentage = 'Offer percentage cannot exceed 100%';
      }
    }
    
    if (formData.offerType === 'price') {
      if (!formData.offerPrice || formData.offerPrice <= 0) {
        newErrors.offerPrice = 'Offer price is required when offer type is price';
      } else if (parseFloat(formData.offerPrice) >= parseFloat(formData.productMRP)) {
        newErrors.offerPrice = 'Offer price must be less than MRP';
      }
    }
    
    if (formData.images.length === 0) newErrors.images = 'At least one product image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      // Log the effective category before submitting
      console.log(`AdminProducts: Submit - effectiveCategory: ${effectiveCategory}`);
      
      const submitData = {
        ...formData,
        giftType: effectiveCategory === 'corporate' ? 'corporateGift' : 'personalisedGift', // Set giftType based on category
        productMRP: parseFloat(formData.productMRP),
        offerPercentage: formData.offerType === 'percentage' ? parseFloat(formData.offerPercentage) : 0,
        offerPrice: formData.offerType === 'price' ? parseFloat(formData.offerPrice) : null,
        colors: formData.colors.filter(color => color.name.trim() !== '')
      };
      
      console.log('Submitting data:', submitData);
      console.log('Product category in submit data:', submitData.productCategory);
      
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
        console.log('Product saved successfully');
        await fetchProducts();
        setShowAddForm(false);
        setEditingProduct(null);
        resetForm();
      } else {
        console.error('API Error:', data);
        // Show detailed error information for debugging
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}` 
          : data.error || `Failed to ${editingProduct ? 'update' : 'create'} product`;
        setErrors({ submit: errorMessage });
      }
    } catch (error) {
      console.error('Network error:', error);
      // Show detailed network error information
      const networkErrorMessage = error.message 
        ? `Network error: ${error.message}` 
        : `Network error occurred while ${editingProduct ? 'updating' : 'creating'} product`;
      setErrors({ submit: networkErrorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    console.log('AdminProducts: handleEdit - product:', product);
    console.log('AdminProducts: handleEdit - giftType:', product.giftType);
    setEditingProduct(product);
    setFormData({
      productId: product.productId || '',
      productName: product.productName,
      description: product.description,
      productDetails: product.productDetails,
      specifications: product.specifications || [],
      whatsInside: product.whatsInside || [],
      productCategory: product.productCategory || '',
      productMRP: product.productMRP.toString(),
      offerType: product.offerType || 'none',
      offerPercentage: product.offerPercentage ? product.offerPercentage.toString() : '',
      offerPrice: product.offerPrice ? product.offerPrice.toString() : '',
      productType: product.productType,
      images: product.images || [],
      tags: product.tags || [],
      tagsInput: (product.tags || []).join(', '),
      colors: product.colors || [],
      isVisible: product.isVisible !== undefined ? product.isVisible : true,
      isFeatured: product.isFeatured !== undefined ? product.isFeatured : false
    });
    setProductIdStatus({ available: null, message: '' });
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        const data = await response.json();
        // Show detailed delete error with additional context
        const deleteErrorMessage = data.details 
          ? `Failed to delete product: ${data.error} - ${data.details}` 
          : `Failed to delete product: ${data.error || 'Unknown error'}`;
        alert(deleteErrorMessage);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      // Show detailed delete network error
      const deleteNetworkError = error.message 
        ? `Network error while deleting product: ${error.message}` 
        : 'Network error occurred while deleting product';
      alert(deleteNetworkError);
    }
  };

  // Toggle product visibility
  const toggleProductVisibility = async (productId, currentVisibility) => {
    // Prevent multiple toggles on the same product
    if (togglingVisibility === productId) return;
    
    try {
      setTogglingVisibility(productId); // Set loading state for this specific product
      
      console.log('=== Visibility Toggle Debug ===');
      console.log('Product ID:', productId);
      console.log('Current visibility:', currentVisibility);
      console.log('New visibility will be:', !currentVisibility);
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVisible: !currentVisibility // Simply toggle the current state
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        console.log('✅ Visibility updated successfully');
        
        // Update only the specific product in the state instead of refetching all products
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === productId 
              ? { ...product, isVisible: !currentVisibility }
              : product
          )
        );
        
      } else {
        console.error('❌ Failed to update visibility:', data);
        // Show detailed visibility update error
        const visibilityErrorMessage = data.details 
          ? `Failed to update product visibility: ${data.error} - ${data.details}` 
          : `Failed to update product visibility: ${data.error || 'Unknown error'}`;
        alert(visibilityErrorMessage);
      }
    } catch (error) {
      console.error('❌ Error updating product visibility:', error);
      // Show detailed visibility network error
      const visibilityNetworkError = error.message 
        ? `Network error while updating visibility: ${error.message}` 
        : 'Network error occurred while updating visibility';
      alert(visibilityNetworkError);
    } finally {
      setTogglingVisibility(null); // Clear loading state
    }
  };

  // Toggle product featured status
  const toggleProductFeatured = async (productId, currentFeatured) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFeatured: !currentFeatured
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update only the specific product in the state
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === productId 
              ? { ...product, isFeatured: !currentFeatured }
              : product
          )
        );
      } else {
        console.error('Failed to update featured status:', data);
        // Show detailed featured status update error
        const featuredErrorMessage = data.details 
          ? `Failed to update product featured status: ${data.error} - ${data.details}` 
          : `Failed to update product featured status: ${data.error || 'Unknown error'}`;
        alert(featuredErrorMessage);
      }
    } catch (error) {
      console.error('Error updating product featured status:', error);
      // Show detailed featured status network error
      const featuredNetworkError = error.message 
        ? `Network error while updating featured status: ${error.message}` 
        : 'Network error occurred while updating featured status';
      alert(featuredNetworkError);
    }
  };

  const formatCurrency = (amount) => {
    return `Rs ${amount}`;
  };

  const calculateFinalPrice = (product) => {
    if (product.offerType === 'percentage') {
      return product.productMRP - (product.productMRP * product.offerPercentage / 100);
    } else if (product.offerType === 'price') {
      return product.offerPrice;
    } else {
      return product.productMRP;
    }
  };

  const calculateOfferPrice = (mrp, offerPercentage) => {
    return mrp - (mrp * offerPercentage / 100);
  };

  // Get unique categories from products
  const getUniqueCategories = () => {
    const categories = products.map(product => product.productCategory).filter(Boolean);
    return [...new Set(categories)].sort();
  };

  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        product.productName?.toLowerCase().includes(searchLower) ||
        product.productId?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.productCategory?.toLowerCase().includes(searchLower) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
      if (!matchesSearch) return false;
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      if (product.productCategory?.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }
    }
    
    // Featured filter
    if (featuredFilter !== 'all') {
      if (featuredFilter === 'featured' && !product.isFeatured) {
        return false;
      }
      if (featuredFilter === 'unfeatured' && product.isFeatured) {
        return false;
      }
    }
    
    // Visibility filter
    if (visibilityFilter !== 'all') {
      if (visibilityFilter === 'visible' && !product.isVisible) {
        return false;
      }
      if (visibilityFilter === 'hidden' && product.isVisible) {
        return false;
      }
    }
    
    return true;
  });

  // Calculate if all filtered products are selected
  const isAllFilteredSelected = filteredProducts.length > 0 && 
    filteredProducts.every(product => selectedProducts.includes(product._id));

  // Batch operations functions
  const handleSelectAll = () => {
    if (isAllFilteredSelected) {
      // Deselect all filtered products
      const filteredProductIds = filteredProducts.map(p => p._id);
      setSelectedProducts(prev => prev.filter(id => !filteredProductIds.includes(id)));
    } else {
      // Select all filtered products (add to existing selection)
      const filteredProductIds = filteredProducts.map(p => p._id);
      setSelectedProducts(prev => {
        const newSelected = [...new Set([...prev, ...filteredProductIds])];
        return newSelected;
      });
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      const newSelected = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      return newSelected;
    });
  };

  const handleBatchDelete = async () => {
    if (selectedProducts.length === 0) return;
    
    const confirmMessage = `Are you sure you want to delete ${selectedProducts.length} selected product${selectedProducts.length > 1 ? 's' : ''}?`;
    if (!confirm(confirmMessage)) return;

    try {
      // Delete products one by one (you could also create a batch delete API endpoint)
      const deletePromises = selectedProducts.map(productId =>
        fetch(`/api/products/${productId}`, { method: 'DELETE' })
      );
      
      await Promise.all(deletePromises);
      
      // Refresh products list
      await fetchProducts();
      
      // Clear selection
      setSelectedProducts([]);
      
      alert(`Successfully deleted ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('Error occurred while deleting products');
    }
  };

  const handleBatchVisibilityToggle = async (makeVisible) => {
    if (selectedProducts.length === 0) return;
    
    const action = makeVisible ? 'show' : 'hide';
    const confirmMessage = `Are you sure you want to ${action} ${selectedProducts.length} selected product${selectedProducts.length > 1 ? 's' : ''}?`;
    if (!confirm(confirmMessage)) return;

    try {
      // Update visibility for selected products
      const updatePromises = selectedProducts.map(productId =>
        fetch(`/api/products/${productId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isVisible: makeVisible })
        })
      );
      
      await Promise.all(updatePromises);
      
      // Update products state without refetching
      setProducts(prevProducts =>
        prevProducts.map(product =>
          selectedProducts.includes(product._id)
            ? { ...product, isVisible: makeVisible }
            : product
        )
      );
      
      // Clear selection
      setSelectedProducts([]);
      
      alert(`Successfully ${action === 'show' ? 'made visible' : 'hidden'} ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error updating product visibility:', error);
      alert('Error occurred while updating product visibility');
    }
  };

  const handleBatchFeaturedToggle = async (makeFeatured) => {
    if (selectedProducts.length === 0) return;
    
    const action = makeFeatured ? 'feature' : 'unfeature';
    const confirmMessage = `Are you sure you want to ${action} ${selectedProducts.length} selected product${selectedProducts.length > 1 ? 's' : ''}?`;
    if (!confirm(confirmMessage)) return;

    try {
      // Update featured status for selected products
      const updatePromises = selectedProducts.map(productId =>
        fetch(`/api/products/${productId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isFeatured: makeFeatured })
        })
      );
      
      await Promise.all(updatePromises);
      
      // Update products state without refetching
      setProducts(prevProducts =>
        prevProducts.map(product =>
          selectedProducts.includes(product._id)
            ? { ...product, isFeatured: makeFeatured }
            : product
        )
      );
      
      // Clear selection
      setSelectedProducts([]);
      
      alert(`Successfully ${action}d ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error updating product featured status:', error);
      alert('Error occurred while updating product featured status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8300FF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {!hideHeading && (
          <h1 className="text-[36px] text-[#8300FF] font-bold">
            {effectiveCategory === 'gift' ? 'Personalized Gifts' : 
             effectiveCategory === 'corporate' ? 'Corporate Products' : 
             effectiveCategory.charAt(0).toUpperCase() + effectiveCategory.slice(1)} Management
          </h1>
        )}
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (!showAddForm) {
              setEditingProduct(null);
              resetForm();
            }
          }}
          className="bg-[#8300FF] text-white px-4 py-2 rounded-md hover:bg-[#6b00cc] transition-colors"
        >
          {showAddForm ? 'Cancel' : (editingProduct ? 'Cancel Edit' : 'Add Product')}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-sm text-gray-600">
              {editingProduct 
                ? 'Update the product information below and save your changes.'
                : `Create a new ${effectiveCategory === 'gift' ? 'personalized gift' : effectiveCategory === 'corporate' ? 'corporate gift' : effectiveCategory} product by filling out the form below.`
              }
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Basic Information
              </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product ID * {!editingProduct && <span className="text-xs text-gray-500">(unique identifier)</span>}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  disabled={editingProduct} // Disable editing for existing products
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent ${
                    editingProduct ? 'bg-gray-100 cursor-not-allowed' : 
                    productIdStatus.available === true ? 'border-green-300 bg-green-50' :
                    productIdStatus.available === false ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., custom-wallet-001"
                  required
                />
                {checkingProductId && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#8300FF]"></div>
                  </div>
                )}
              </div>
              
              {productIdStatus.message && !editingProduct && (
                <p className={`text-sm mt-1 ${
                  productIdStatus.available ? 'text-green-600' : 'text-red-500'
                }`}>
                  {productIdStatus.message}
                </p>
              )}
              
              {editingProduct && (
                <p className="text-xs text-gray-500 mt-1">
                  Product ID cannot be changed after creation
                </p>
              )}
              
              {errors.productId && (
                <p className="text-red-500 text-sm mt-1">{errors.productId}</p>
              )}
              
              <p className="text-xs text-gray-500 mt-1">
                Use lowercase letters, numbers, and hyphens only. Spaces will be converted to hyphens.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
                {errors.productName && (
                  <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent resize-none"
                placeholder="Enter product description"
                required
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Details *
              </label>
              <textarea
                name="productDetails"
                value={formData.productDetails}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent resize-none"
                placeholder="Enter detailed product information"
                required
              />
              {errors.productDetails && (
                <p className="text-red-500 text-sm mt-1">{errors.productDetails}</p>
              )}
            </div>

            {/* Product Category Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Category *
              </label>
              <CategoryInput
                value={formData.productCategory}
                onChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    productCategory: value
                  }));
                  // Clear error when user starts typing
                  if (errors.productCategory) {
                    setErrors(prev => ({ ...prev, productCategory: '' }));
                  }
                }}
                error={errors.productCategory}
                placeholder="Type or select a category (e.g., lamp, mug, frame)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Start typing to see suggestions, or type a new category to add it to the list.
              </p>
            </div>
            </div>

            {/* Product Specifications Section */}
            <div className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Product Specifications
              </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Product Specifications
                </label>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="bg-[#8300FF] text-white px-3 py-1 rounded-md text-sm hover:bg-[#6a00d4] transition-colors"
                >
                  + Add Specification
                </button>
              </div>
              
              {formData.specifications.map((spec, specIndex) => (
                <div key={specIndex} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <input
                      type="text"
                      value={spec.heading}
                      onChange={(e) => updateSpecificationHeading(specIndex, e.target.value)}
                      placeholder="Specification Heading (e.g., Material, Product Finish)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(specIndex)}
                      className="ml-2 text-red-500 hover:text-red-700 px-2 py-1"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {spec.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={detail.key}
                          onChange={(e) => updateSpecificationDetail(specIndex, detailIndex, 'key', e.target.value)}
                          placeholder="Key (e.g., Wallet Size, Pen Type)"
                          className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={detail.value}
                          onChange={(e) => updateSpecificationDetail(specIndex, detailIndex, 'value', e.target.value)}
                          placeholder="Value (e.g., 11 x 9 Cm, Ball Point)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecificationDetail(specIndex, detailIndex)}
                          className="text-red-500 hover:text-red-700 px-2 py-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addSpecificationDetail(specIndex)}
                      className="text-[#8300FF] hover:text-[#6a00d4] text-sm"
                    >
                      + Add Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* What's Inside Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  What's Inside
                </label>
                <button
                  type="button"
                  onClick={addWhatsInsideItem}
                  className="bg-[#8300FF] text-white px-3 py-1 rounded-md text-sm hover:bg-[#6a00d4] transition-colors"
                >
                  + Add Item
                </button>
              </div>
              
              {formData.whatsInside.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateWhatsInsideItem(index, e.target.value)}
                    placeholder="e.g., 1x High-Quality Faux Leather Wallet (customized with name)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeWhatsInsideItem(index)}
                    className="text-red-500 hover:text-red-700 px-2 py-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Colors Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Available Colors
                </label>
                <button
                  type="button"
                  onClick={addColor}
                  className="bg-[#8300FF] text-white px-3 py-1 rounded-md text-sm hover:bg-[#6a00d4] transition-colors"
                >
                  + Add Color
                </button>
              </div>
              
              {formData.colors.map((color, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => updateColor(index, 'name', e.target.value)}
                    placeholder="Color name (e.g., Royal Blue)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                  />
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(index, 'hex', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="text-red-500 hover:text-red-700 px-2 py-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            </div>

            {/* Pricing & Offers Section */}
            <div className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Pricing & Offers
              </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MRP (Rs) *
                </label>
                <input
                  type="number"
                  name="productMRP"
                  value={formData.productMRP}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                  placeholder="0.00"
                  required
                />
                {errors.productMRP && (
                  <p className="text-red-500 text-sm mt-1">{errors.productMRP}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Type *
                </label>
                <select
                  name="offerType"
                  value={formData.offerType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                  required
                >
                  <option value="none">No Offer</option>
                  <option value="percentage">Percentage Discount</option>
                  <option value="price">Fixed Offer Price</option>
                </select>
              </div>

              {formData.offerType === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Percentage (%) *
                  </label>
                  <input
                    type="number"
                    name="offerPercentage"
                    value={formData.offerPercentage}
                    onChange={handleInputChange}
                    min="1"
                    max="99"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                    placeholder="e.g., 20"
                    required
                  />
                  {errors.offerPercentage && (
                    <p className="text-red-500 text-sm mt-1">{errors.offerPercentage}</p>
                  )}
                  {formData.offerPercentage && formData.productMRP && (
                    <p className="text-sm text-green-600 mt-1">
                      Final Price: Rs {(formData.productMRP * (1 - formData.offerPercentage / 100)).toFixed(2)}
                    </p>
                  )}
                </div>
              )}

              {formData.offerType === 'price' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Price (Rs) *
                  </label>
                  <input
                    type="number"
                    name="offerPrice"
                    value={formData.offerPrice}
                    onChange={handleInputChange}
                    min="1"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                    placeholder="e.g., 199.00"
                    required
                  />
                  {errors.offerPrice && (
                    <p className="text-red-500 text-sm mt-1">{errors.offerPrice}</p>
                  )}
                  {formData.offerPrice && formData.productMRP && (
                    <p className="text-sm text-green-600 mt-1">
                      You Save: Rs {(formData.productMRP - formData.offerPrice).toFixed(2)} ({((formData.productMRP - formData.offerPrice) / formData.productMRP * 100).toFixed(1)}% off)
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Type *
                </label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                >
                  <option value="non-customisable">Non-Customizable</option>
                  <option value="customisable">Customizable</option>
                  <option value="heavyCustomisable">Heavy Customizable</option>
                </select>
              </div>
            </div>
            </div>

            {/* Product Categorization Section */}
            <div className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Product Tags & Categorization  
              </h3>

            {/* Tags Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Tags
              </label>
              <input
                type="text"
                value={formData.tagsInput || formData.tags.join(', ')}
                onChange={handleTagsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                placeholder="seasonal, trending, valentine, birthday, anniversary (separate with commas)"
                style={{ textTransform: 'lowercase' }}
              />
              <p className="text-sm text-gray-500 mt-1">
                Add tags to help categorize and find similar products. Separate multiple tags with commas. Tags will be converted to lowercase.
              </p>
              
              {/* Common tag suggestions */}
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-2">Quick add common tags:</p>
                <div className="flex flex-wrap gap-2">
                  {['seasonal', 'trending', 'valentine', 'birthday', 'anniversary', 'wedding', 'christmas', 'mothers-day', 'fathers-day', 'graduation', 'baby-shower', 'new-year'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!formData.tags.includes(tag)) {
                          const newTags = [...formData.tags, tag];
                          setFormData(prev => ({
                            ...prev,
                            tags: newTags,
                            tagsInput: newTags.join(', ')
                          }));
                        }
                      }}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <p className="text-xs text-gray-600 w-full mb-1">Current tags:</p>
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8300FF] text-white group"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = formData.tags.filter((_, i) => i !== index);
                          setFormData(prev => ({
                            ...prev,
                            tags: newTags,
                            tagsInput: newTags.join(', ')
                          }));
                        }}
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-white hover:bg-white hover:text-[#8300FF] rounded-full transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {errors.tags && (
                <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
              )}
            </div>
            </div>

            {/* Media & Visibility Section */}
            <div className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Product Images & Settings
              </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images *
              </label>
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                disabled={uploadingImages}
              />
              <p className="text-sm text-gray-500 mt-1">
                {uploadingImages ? 'Uploading...' : 'Select multiple images (JPG, PNG, GIF)'}
              </p>
              {errors.images && (
                <p className="text-red-500 text-sm mt-1">{errors.images}</p>
              )}
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image.url}
                        alt={`Product image ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Visibility Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Visibility
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    formData.isVisible ? 'bg-[#8300FF]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      formData.isVisible ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700">
                  {formData.isVisible ? 'Visible on frontend' : 'Hidden from frontend'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Toggle to control whether this product appears on the website
              </p>
            </div>

            {/* Product Featured Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Product
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    formData.isFeatured ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      formData.isFeatured ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {formData.isFeatured ? 'Featured product' : 'Regular product'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Featured products will be highlighted and promoted on the website
              </p>
            </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting || uploadingImages}
                className="bg-[#8300FF] text-white px-6 py-2 rounded-md hover:bg-[#6b00cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>

            {errors.submit && (
              <div className="text-red-500 text-sm">{errors.submit}</div>
            )}
          </form>
        </div>
      )}

      {/* Products Management Section */}
      {!showAddForm && (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {effectiveCategory === 'gift' ? 'Personalized Gift Products' : 
                 effectiveCategory === 'corporate' ? 'Corporate Gift Products' : 
                 `${effectiveCategory.charAt(0).toUpperCase() + effectiveCategory.slice(1)} Products`}
              </h2>
              <p className="text-sm text-gray-600">
                Manage your product inventory • {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} 
                {searchTerm || categoryFilter !== 'all' || featuredFilter !== 'all' || visibilityFilter !== 'all' ? ' (filtered)' : ' total'}
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search by name, ID, category, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Filters Section - Clean and Separate */}
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Filters:</span>
                
                {/* Category Filter */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#8300FF] focus:border-transparent bg-white min-w-[120px]"
                  >
                    <option value="all">All Categories</option>
                    {getUniqueCategories().map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Featured Filter */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">Featured</label>
                  <select
                    value={featuredFilter}
                    onChange={(e) => setFeaturedFilter(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#8300FF] focus:border-transparent bg-white min-w-[120px]"
                  >
                    <option value="all">All Products</option>
                    <option value="featured">Featured Only</option>
                    <option value="unfeatured">Not Featured</option>
                  </select>
                </div>

                {/* Visibility Filter */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">Visibility</label>
                  <select
                    value={visibilityFilter}
                    onChange={(e) => setVisibilityFilter(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#8300FF] focus:border-transparent bg-white min-w-[120px]"
                  >
                    <option value="all">All Products</option>
                    <option value="visible">Visible Only</option>
                    <option value="hidden">Hidden Only</option>
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center gap-2">
                {/* Active Filter Indicator */}
                {(categoryFilter !== 'all' || featuredFilter !== 'all' || visibilityFilter !== 'all') && (
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Filters Active
                  </span>
                )}
                
                {/* Reset Filters Button */}
                {(categoryFilter !== 'all' || featuredFilter !== 'all' || visibilityFilter !== 'all' || searchTerm) && (
                  <button
                    onClick={() => {
                      setCategoryFilter('all');
                      setFeaturedFilter('all');
                      setVisibilityFilter('all');
                      setSearchTerm('');
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-white transition-colors flex items-center gap-1"
                    title="Clear all filters and search"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reset All
                  </button>
                )}
              </div>
            </div>
            
            {/* Filter Results Summary */}
            {(searchTerm || categoryFilter !== 'all' || featuredFilter !== 'all' || visibilityFilter !== 'all') && (
              <div className="mt-2 text-sm text-gray-600">
                {filteredProducts.length === 0 
                  ? 'No products match the current filters' 
                  : `Showing ${filteredProducts.length} of ${products.length} product${filteredProducts.length === 1 ? '' : 's'}`
                }
              </div>
            )}
          </div>
          
          {/* Batch Operations */}
          {selectedProducts.length > 0 && (
            <div className="flex items-center justify-between gap-3 mt-3 p-4 bg-[#8300FF]/10 border border-[#8300FF]/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#8300FF] rounded-full"></div>
                  <span className="text-sm font-semibold text-[#8300FF]">
                    {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  Choose an action to apply to all selected products
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleBatchVisibilityToggle(true)}
                  className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                  title="Make selected products visible"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Show
                </button>
                <button
                  onClick={() => handleBatchVisibilityToggle(false)}
                  className="bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-yellow-700 transition-colors flex items-center gap-1"
                  title="Hide selected products"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                  Hide
                </button>
                <button
                  onClick={() => handleBatchFeaturedToggle(true)}
                  className="bg-yellow-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-yellow-600 transition-colors flex items-center gap-1"
                  title="Feature selected products"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Feature
                </button>
                <button
                  onClick={() => handleBatchFeaturedToggle(false)}
                  className="bg-gray-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-600 transition-colors flex items-center gap-1"
                  title="Unfeature selected products"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Unfeature
                </button>
                <button
                  onClick={handleBatchDelete}
                  className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                  title="Delete selected products"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
                <button
                  onClick={() => {
                    setSelectedProducts([]);
                  }}
                  className="bg-gray-400 text-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-500 transition-colors flex items-center gap-1"
                  title="Clear selection"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-3 font-semibold text-gray-700 w-12">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isAllFilteredSelected}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-[#8300FF] border-gray-300 rounded focus:ring-[#8300FF]"
                        title={isAllFilteredSelected ? "Deselect all filtered products" : "Select all filtered products"}
                      />
                      <span className="text-xs text-gray-500">
                        {selectedProducts.length > 0 && `(${selectedProducts.length})`}
                      </span>
                    </div>
                  </th>
                  <th className="text-left py-4 px-3 font-semibold text-gray-700">Image</th>
                  <th className="text-left py-4 px-3 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-4 px-3 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-4 px-3 font-semibold text-gray-700">Final Price</th>
                  <th className="text-left py-4 px-3 font-semibold text-gray-700">Featured</th>
                  <th className="text-left py-4 px-3 font-semibold text-gray-700">Visibility</th>
                  <th className="text-left py-4 px-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-500">
                      {products.length === 0 
                        ? 'No products found. Add your first product!' 
                        : (searchTerm || categoryFilter !== 'all' || featuredFilter !== 'all' || visibilityFilter !== 'all')
                        ? 'No products match the current filters'
                        : 'No products found'
                      }
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className={`border-b border-gray-100 transition-colors duration-150 ${
                      selectedProducts.includes(product._id) 
                        ? 'bg-[#8300FF]/5 border-[#8300FF]/20' 
                        : 'hover:bg-gray-50'
                    }`}>
                      <td className="py-4 px-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => handleSelectProduct(product._id)}
                            className="w-4 h-4 text-[#8300FF] border-gray-300 rounded focus:ring-[#8300FF] cursor-pointer"
                            title={selectedProducts.includes(product._id) ? "Deselect this product" : "Select this product"}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.productName}
                            width={50}
                            height={50}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        <div>
                          <div className="font-medium text-gray-900">{product.productName}</div>
                          <div className="text-sm text-gray-500 font-mono">{product.productId}</div>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className="capitalize px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.productCategory || 'Not set'}
                        </span>
                      </td>
                      
                      {/* Final Price Column */}
                      <td className="py-4 px-3">
                        <div>
                          <div className="font-medium text-green-600 text-lg">
                            {formatCurrency(calculateFinalPrice(product))}
                          </div>
                          <div className="text-xs text-gray-500">
                            MRP: {formatCurrency(product.productMRP)}
                          </div>
                          {product.offerType === 'percentage' && product.offerPercentage > 0 && (
                            <div className="text-xs text-orange-600 font-medium">
                              {product.offerPercentage}% OFF
                            </div>
                          )}
                          {product.offerType === 'price' && product.offerPrice && (
                            <div className="text-xs text-orange-600 font-medium">
                              {(((product.productMRP - product.offerPrice) / product.productMRP) * 100).toFixed(1)}% OFF
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Featured Column */}
                      <td className="py-4 px-3">
                        <button
                          onClick={() => toggleProductFeatured(product._id, product.isFeatured)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 hover:scale-105 ${
                            product.isFeatured ? 'bg-yellow-500' : 'bg-gray-300'
                          }`}
                          title={product.isFeatured ? 'Click to unfeature' : 'Click to feature'}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                              product.isFeatured ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      
                      {/* Visibility Column */}
                      <td className="py-4 px-3">
                        <button
                          onClick={() => toggleProductVisibility(product._id, product.isVisible)}
                          disabled={togglingVisibility === product._id}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                            togglingVisibility === product._id 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'hover:scale-105'
                          } ${
                            product.isVisible === true ? 'bg-[#8300FF]' : 'bg-gray-300'
                          }`}
                          title={
                            togglingVisibility === product._id 
                              ? 'Updating...' 
                              : product.isVisible === true 
                                ? 'Click to hide from frontend' 
                                : 'Click to show on frontend'
                          }
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                              product.isVisible === true ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                          {togglingVisibility === product._id && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </button>
                      </td>
                      
                      <td className="py-4 px-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              handleEdit(product);
                              setShowAddForm(true);
                            }}
                            className="text-[#8300FF] hover:text-[#6b00cc] p-1 rounded transition-colors"
                            title="Edit product"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                            title="Delete product"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default AdminProducts;
