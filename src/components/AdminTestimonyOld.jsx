"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

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
        resetForm();
        setShowAddForm(false);
        setEditingTestimony(null);
      } else {
        setErrors({ submit: data.error || 'Failed to save testimony' });
      }
    } catch (error) {
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

      if (response.ok) {
        await fetchTestimonies();
      } else {
        const data = await response.json();
        alert('Failed to delete testimony: ' + data.error);
      }
    } catch (error) {
      alert('Network error occurred');
    }
  };

  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/testimonies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        await fetchTestimonies();
      } else {
        const data = await response.json();
        alert('Failed to update testimony status: ' + data.error);
      }
    } catch (error) {
      alert('Network error occurred');
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary_color"></div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full overflow-auto">
      {/* Form Section */}
      <div className="w-1/2 px-5 border-r border-gray-200">
        <div className="flex flex-col gap-6 pt-5">
          <div className="flex justify-between items-center">
            <h2 className="text-nav_blue text-4xl font-poppins font-bold">
              {editingTestimony ? 'Edit Testimony' : 'Testimony Management'}
            </h2>
            <div className="flex gap-3">
              {showAddForm && (
                <button 
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTestimony(null);
                    resetForm();
                  }}
                  className="w-32 h-10 px-3 border-[#8300FF] border-2 font-poppins font-bold text-[#8300FF]"
                >
                  Cancel
                </button>
              )}
              {!showAddForm ? (
                <button
                  onClick={() => {
                    setShowAddForm(true);
                    setEditingTestimony(null);
                    resetForm();
                  }}
                  className="w-40 h-10 px-3 bg-[#8300FF] text-white font-poppins font-bold hover:bg-[#6b00cc] transition-colors"
                >
                  Add New Testimony
                </button>
              ) : (
                <button
                  form="testimony-form"
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-32 h-10 px-3 font-poppins font-bold transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-[#8300FF] text-white hover:bg-[#6b00cc]'
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <form id="testimony-form" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8300FF] focus:border-transparent font-poppins"
                  placeholder="Enter customer name"
                  required
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Image
                </label>
                <input
                  type="file"
                  name="customerImage"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8300FF] focus:border-transparent font-poppins"
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

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary_color focus:ring-primary_color border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Active (Display on website)
                  </label>
                </div>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_color focus:border-transparent"
                  placeholder="Enter the customer's testimony..."
                  required
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              {errors.submit && (
                <div className="text-red-500 text-sm">{errors.submit}</div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary_color text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
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
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Testimonies List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">All Testimonies ({testimonies.length})</h2>
          </div>
          
          {testimonies.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No testimonies found. Add your first testimony to get started.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {testimonies.map((testimony) => (
                <div key={testimony._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        {testimony.customerImage ? (
                          <img
                            src={testimony.customerImage}
                            alt={testimony.customerName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{testimony.customerName}</h3>
                        </div>
                      </div>
                      
                      <p className="text-gray-800 leading-relaxed mb-3">"{testimony.message}"</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          Status: 
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                            testimony.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {testimony.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </span>
                        <span>Created: {new Date(testimony.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => toggleActiveStatus(testimony._id, testimony.isActive)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          testimony.isActive
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        } transition-colors`}
                      >
                        {testimony.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      
                      <button
                        onClick={() => handleEdit(testimony)}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDelete(testimony._id)}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-medium hover:bg-red-200 transition-colors"
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
