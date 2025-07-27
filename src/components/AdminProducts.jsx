"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const AdminProducts = ({ category = 'gift' }) => {
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
    productCategory: category,
    productMRP: '',
    offerType: 'none',
    offerPercentage: '',
    offerPrice: '',
    productType: 'non-customisable',
    customTextHeading: '',
    numberOfCustomImages: 0,
    images: [],
    tags: [],
    tagsInput: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [checkingProductId, setCheckingProductId] = useState(false);
  const [productIdStatus, setProductIdStatus] = useState({ available: null, message: '' });

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?category=${category}`);
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products || []);
      } else {
        console.error('Failed to fetch products:', data.error);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      productName: '',
      description: '',
      productDetails: '',
      specifications: [],
      whatsInside: [],
      productCategory: category,
      productMRP: '',
      offerType: 'none',
      offerPercentage: '',
      offerPrice: '',
      productType: 'non-customisable',
      customTextHeading: '',
      numberOfCustomImages: 0,
      images: [],
      tags: [],
      tagsInput: ''
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
      specifications: [...prev.specifications, { heading: '', details: [{ key: '', value: '' }], color: '' }]
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

  const updateSpecificationColor = (index, color) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, color } : spec
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
      setErrors(prev => ({ ...prev, images: 'Failed to upload images' }));
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
    
    if ((formData.productType === 'customisable' || formData.productType === 'heavyCustomisable') && !formData.customTextHeading.trim()) {
      newErrors.customTextHeading = 'Custom text heading is required for customizable products';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          productMRP: parseFloat(formData.productMRP),
          offerPercentage: formData.offerType === 'percentage' ? parseFloat(formData.offerPercentage) : 0,
          offerPrice: formData.offerType === 'price' ? parseFloat(formData.offerPrice) : null,
          numberOfCustomImages: parseInt(formData.numberOfCustomImages) || 0
        })
      });

      const data = await response.json();

      if (response.ok) {
        await fetchProducts();
        setShowAddForm(false);
        setEditingProduct(null);
        resetForm();
      } else {
        setErrors({ submit: data.error || 'Failed to save product' });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({ submit: 'Network error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productId: product.productId || '',
      productName: product.productName,
      description: product.description,
      productDetails: product.productDetails,
      specifications: product.specifications || [],
      whatsInside: product.whatsInside || [],
      productCategory: product.productCategory,
      productMRP: product.productMRP.toString(),
      offerType: product.offerType || 'none',
      offerPercentage: product.offerPercentage ? product.offerPercentage.toString() : '',
      offerPrice: product.offerPrice ? product.offerPrice.toString() : '',
      productType: product.productType,
      customTextHeading: product.customTextHeading || '',
      numberOfCustomImages: product.numberOfCustomImages || 0,
      images: product.images || [],
      tags: product.tags || [],
      tagsInput: (product.tags || []).join(', ')
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
        alert('Failed to delete product: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Network error occurred');
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
        <h1 className="text-[36px] text-[#8300FF] font-bold">
          {category.charAt(0).toUpperCase() + category.slice(1)} Management
        </h1>
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
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product ID Field */}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Category
                </label>
                <select
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                >
                  <option value="gift">Gift</option>
                  <option value="bundle">Bundle</option>
                  <option value="cake">Cake</option>
                </select>
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

            {/* Specifications Section */}
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
                  
                  {/* Color Option */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Color (Optional):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={spec.color || '#ffffff'}
                        onChange={(e) => updateSpecificationColor(specIndex, e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={spec.color || ''}
                        onChange={(e) => updateSpecificationColor(specIndex, e.target.value)}
                        placeholder="Enter color (e.g., #FF5733 or Red)"
                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent text-sm w-48"
                      />
                      {spec.color && (
                        <button
                          type="button"
                          onClick={() => updateSpecificationColor(specIndex, '')}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                        >
                          Clear
                        </button>
                      )}
                    </div>
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

            {(formData.productType === 'customisable' || formData.productType === 'heavyCustomisable') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Text Heading *
                  </label>
                  <input
                    type="text"
                    name="customTextHeading"
                    value={formData.customTextHeading}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                    placeholder="Enter custom text heading"
                  />
                  {errors.customTextHeading && (
                    <p className="text-red-500 text-sm mt-1">{errors.customTextHeading}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Custom Images
                  </label>
                  <input
                    type="number"
                    name="numberOfCustomImages"
                    value={formData.numberOfCustomImages}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            )}

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

      {/* Products List Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold">All Products ({products.length})</h2>
        </div>
        
        <div className="p-6">
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No products found. Add your first product!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Image</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Tags</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">MRP</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Offer Price</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
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
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium text-gray-900">{product.productName}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="capitalize">{product.productCategory}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.productType === 'non-customisable' 
                            ? 'bg-blue-100 text-blue-800' 
                            : product.productType === 'customisable'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {product.productType === 'non-customisable' ? 'Regular' : 
                           product.productType === 'customisable' ? 'Custom' : 'Heavy Custom'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex flex-wrap gap-1">
                          {product.tags && product.tags.length > 0 ? (
                            product.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs">No tags</span>
                          )}
                          {product.tags && product.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{product.tags.length - 3} more</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 font-medium">
                        {formatCurrency(product.productMRP)}
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium text-green-600">
                            {formatCurrency(calculateFinalPrice(product))}
                          </div>
                          {product.offerType === 'percentage' && product.offerPercentage > 0 && (
                            <div className="text-xs text-gray-500">
                              {product.offerPercentage}% off
                            </div>
                          )}
                          {product.offerType === 'price' && product.offerPrice && (
                            <div className="text-xs text-gray-500">
                              {(((product.productMRP - product.offerPrice) / product.productMRP) * 100).toFixed(1)}% off
                            </div>
                          )}
                          {product.offerType === 'none' && (
                            <div className="text-xs text-gray-500">
                              No offer
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              handleEdit(product);
                              setShowAddForm(true);
                            }}
                            className="text-[#8300FF] hover:text-[#6b00cc] text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
