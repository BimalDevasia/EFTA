"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    eventName: '',
    eventCategory: 'normal', // normal event or corporate event
    eventDescription: '',
    images: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { user } = useAuth();
  const router = useRouter();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      const data = await response.json();
      
      if (response.ok) {
        setEvents(data.events || []);
      } else {
        console.error('Failed to fetch events:', data.error);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    // No longer needed since we use simple normal/corporate categories
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const resetForm = () => {
    setFormData({
      eventName: '',
      eventCategory: 'normal',
      eventDescription: '',
      images: []
    });
    setErrors({});
    setEditingEvent(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required';
    if (!formData.eventDescription.trim()) newErrors.eventDescription = 'Event description is required';
    if (formData.images.length < 3) newErrors.images = 'At least 3 images are required';
    if (formData.images.length > 6) newErrors.images = 'Maximum 6 images allowed';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    // Check if adding these images would exceed the limit
    if (formData.images.length + files.length > 6) {
      alert('Maximum 6 images allowed per event');
      return;
    }

    setUploadingImages(true);
    const uploadFormData = new FormData();
    
    files.forEach(file => {
      uploadFormData.append('images', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const result = await response.json();
        const newImages = result.images.map(img => ({
          url: img.url,
          public_id: img.public_id,
          alt: `${formData.eventName} image`
        }));
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }));
      } else {
        const errorData = await response.json();
        alert(`Failed to upload images: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = async (index) => {
    const imageToRemove = formData.images[index];
    
    if (imageToRemove.public_id) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_id: imageToRemove.public_id }),
        });
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const url = editingEvent ? `/api/events/${editingEvent._id}` : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchEvents();
        resetForm();
        setShowAddForm(false);
        alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to ${editingEvent ? 'update' : 'create'} event: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      eventName: event.eventName || '',
      eventCategory: event.eventCategory || 'normal',
      eventDescription: event.eventDescription || '',
      images: event.images || []
    });
    setShowAddForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchEvents();
        alert('Event deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete event: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    }
  };

  const handleCancel = () => {
    resetForm();
    setShowAddForm(false);
  };

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.eventDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || 
                           event.eventCategory === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8300FF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[36px] text-[#8300FF] font-bold">Event Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#8300FF] text-white px-6 py-3 rounded-lg hover:bg-[#6b00cc] transition-colors"
        >
          Add New Event
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h2>
            <p className="text-sm text-gray-600">
              {editingEvent 
                ? 'Update the event information below and save your changes.'
                : 'Fill out the form below to create a new event.'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                  placeholder="Enter event name"
                />
                {errors.eventName && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
                )}
              </div>

              {/* Event Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Category *
                </label>
                <select
                  value={formData.eventCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventCategory: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                >
                  <option value="normal">Normal Event</option>
                  <option value="corporate">Corporate Event</option>
                </select>
              </div>
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Description *
              </label>
              <textarea
                value={formData.eventDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, eventDescription: e.target.value }))}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                placeholder="Enter detailed event description"
              />
              {errors.eventDescription && (
                <p className="text-red-500 text-sm mt-1">{errors.eventDescription}</p>
              )}
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Images * (3-6 images required)
              </label>
              
              {formData.images.length < 6 && (
                <div className="mb-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                  />
                  {uploadingImages && (
                    <p className="text-blue-500 text-sm mt-1">Uploading images...</p>
                  )}
                </div>
              )}

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image.url}
                        alt={image.alt || `Event image ${index + 1}`}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-500">
                {formData.images.length} of 6 images uploaded (minimum 3 required)
              </p>
              {errors.images && (
                <p className="text-red-500 text-sm mt-1">{errors.images}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#8300FF] text-white px-6 py-3 rounded-lg hover:bg-[#6b00cc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="normal">Normal Events</option>
              <option value="corporate">Corporate Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Events ({filteredEvents.length})
          </h3>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">No events found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first event to get started'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Event</th>
                  <th className="text-left p-4 font-medium text-gray-700">Category</th>
                  <th className="text-left p-4 font-medium text-gray-700">Images</th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {event.eventName}
                        </h4>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {event.eventDescription.length > 100 
                            ? `${event.eventDescription.substring(0, 100)}...`
                            : event.eventDescription
                          }
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                        event.eventCategory === 'corporate' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {event.eventCategory === 'corporate' ? 'Corporate Event' : 'Normal Event'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {event.images?.length || 0} images
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
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
  );
};

export default AdminEvents;
