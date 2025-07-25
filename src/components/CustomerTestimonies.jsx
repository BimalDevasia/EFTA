"use client";
import React, { useState, useEffect } from 'react';
import { generatePersonIcon } from '@/utils/personIcon';

const CustomerTestimonies = ({ 
  limit = 6, 
  showRating = true, 
  showImages = true,
  randomize = false,
  className = "" 
}) => {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonies();
  }, [limit, randomize]);

  const fetchTestimonies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        limit: limit.toString(),
        random: randomize.toString()
      });
      
      const response = await fetch(`/api/public/testimonies?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setTestimonies(data.testimonies || []);
      } else {
        setError(data.error || 'Failed to fetch testimonies');
      }
    } catch (error) {
      console.error('Error fetching testimonies:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_color"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-red-500">Failed to load testimonies</p>
        <button 
          onClick={fetchTestimonies}
          className="mt-2 text-primary_color hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (testimonies.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">No testimonies available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonies.map((testimony) => (
          <div 
            key={testimony._id} 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Header with customer info */}
            <div className="flex items-center mb-4">
              {showImages && testimony.customerImage ? (
                <img
                  src={testimony.customerImage}
                  alt={testimony.customerName}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="mr-4">
                  {generatePersonIcon(testimony.customerName, 'w-12 h-12')}
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{testimony.customerName}</h3>
              </div>
            </div>

            {/* Message */}
            <blockquote className="text-gray-700 leading-relaxed mb-4">
              "{testimony.message}"
            </blockquote>

            {/* Date */}
            <div className="text-xs text-gray-500">
              {formatDate(testimony.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTestimonies;
