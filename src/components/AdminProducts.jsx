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
    productName: '',
    description: '',
    productDetails: '',
    productCategory: category,
    productMRP: '',
    offerPercentage: '',
    productType: 'non-customisable',
    customTextHeading: '',
    numberOfCustomImages: 0,
    images: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

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
      productName: '',
      description: '',
      productDetails: '',
      productCategory: category,
      productMRP: '',
      offerPercentage: '',
      productType: 'non-customisable',
      customTextHeading: '',
      numberOfCustomImages: 0,
      images: []
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
    
    if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.productDetails.trim()) newErrors.productDetails = 'Product details are required';
    if (!formData.productMRP || formData.productMRP <= 0) newErrors.productMRP = 'Valid MRP is required';
    if (formData.offerPercentage < 0 || formData.offerPercentage > 100) {
      newErrors.offerPercentage = 'Offer percentage must be between 0-100';
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
          offerPercentage: parseFloat(formData.offerPercentage),
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
      productName: product.productName,
      description: product.description,
      productDetails: product.productDetails,
      productCategory: product.productCategory,
      productMRP: product.productMRP.toString(),
      offerPercentage: product.offerPercentage.toString(),
      productType: product.productType,
      customTextHeading: product.customTextHeading || '',
      numberOfCustomImages: product.numberOfCustomImages || 0,
      images: product.images || []
    });
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
                  Offer Percentage (%)
                </label>
                <input
                  type="number"
                  name="offerPercentage"
                  value={formData.offerPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                  placeholder="0"
                />
                {errors.offerPercentage && (
                  <p className="text-red-500 text-sm mt-1">{errors.offerPercentage}</p>
                )}
              </div>

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
                      <td className="py-3 px-2 font-medium">
                        {formatCurrency(product.productMRP)}
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium text-green-600">
                            {formatCurrency(calculateOfferPrice(product.productMRP, product.offerPercentage))}
                          </div>
                          {product.offerPercentage > 0 && (
                            <div className="text-xs text-gray-500">
                              {product.offerPercentage}% off
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
