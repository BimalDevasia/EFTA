"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { generatePersonIcon } from '@/utils/personIcon';

const AdminTestimony = () => {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTestimony, setEditingTestimony] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerImage: '',
    message: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchTestimonies();
  }, []);

  const fetchTestimonies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/testimonies');
      const data = await response.json();
      
      if (response.ok) {
        setTestimonies(data.testimonies || []);
      } else {
        console.error('Failed to fetch testimonies:', data.error);
      }
    } catch (error) {
      console.error('Error fetching testimonies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create FormData for file upload
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      // You can implement your image upload logic here
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        customerImage: imageUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Testimony message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const url = editingTestimony 
        ? `/api/testimonies/${editingTestimony._id}`
        : '/api/testimonies';
      
      const method = editingTestimony ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        await fetchTestimonies();
        setShowAddForm(false);
        setEditingTestimony(null);
        resetForm();
      } else {
        setErrors({ submit: data.error || 'Failed to save testimony' });
      }
    } catch (error) {
      console.error('Error saving testimony:', error);
      setErrors({ submit: 'Network error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (testimony) => {
    setEditingTestimony(testimony);
    setFormData({
      customerName: testimony.customerName,
      customerImage: testimony.customerImage || '',
      message: testimony.message,
      isActive: testimony.isActive
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimony?')) return;

    try {
      const response = await fetch(`/api/testimonies/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (response.ok) {
        await fetchTestimonies();
      } else {
        alert('Failed to delete testimony: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting testimony:', error);
      alert('Failed to delete testimony');
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerImage: '',
      message: '',
      isActive: true
    });
    setErrors({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8300FF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[36px] text-[#8300FF] font-bold">Testimony Management</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (!showAddForm) {
              setEditingTestimony(null);
              resetForm();
            }
          }}
          className="bg-[#8300FF] text-white px-4 py-2 rounded-md hover:bg-[#6b00cc] transition-colors"
        >
          {showAddForm ? 'Cancel' : (editingTestimony ? 'Cancel Edit' : 'Add Testimony')}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {editingTestimony ? 'Edit Testimony' : 'Add New Testimony'}
          </h2>
          <form id="testimony-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                placeholder="Enter customer name"
                required
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Image
              </label>
              <input
                type="file"
                name="customerImage"
                onChange={handleImageUpload}
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Optional - Leave empty to use default person icon</p>
              {formData.customerImage && (
                <div className="mt-2">
                  <img 
                    src={formData.customerImage} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Testimony Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent resize-none"
                placeholder="Enter the customer's testimony..."
                required
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#8300FF] focus:ring-[#8300FF] border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Active (Display on website)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#8300FF] text-white px-6 py-2 rounded-md hover:bg-[#6b00cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (editingTestimony ? 'Update Testimony' : 'Add Testimony')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingTestimony(null);
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

      {/* Testimonies List Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold">All Testimonies ({testimonies.length})</h2>
        </div>
        
        <div className="p-6">
          {testimonies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No testimonies found. Add your first testimony!
            </div>
          ) : (
            <div className="space-y-4">
              {testimonies.map((testimony) => (
                <div key={testimony._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {testimony.customerImage ? (
                          <img
                            src={testimony.customerImage}
                            alt={testimony.customerName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          generatePersonIcon(testimony.customerName, 'w-10 h-10')
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">{testimony.customerName}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${testimony.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {testimony.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">"{testimony.message}"</p>
                      
                      <p className="text-xs text-gray-500">
                        {new Date(testimony.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          handleEdit(testimony);
                          setShowAddForm(true);
                        }}
                        className="text-[#8300FF] hover:text-[#6b00cc] text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(testimony._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTestimony;
