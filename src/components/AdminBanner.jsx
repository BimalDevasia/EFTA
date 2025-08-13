"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const BANNER_SECTIONS = [
  {
    id: 'gifts',
    title: 'Valentine',
    subtitle: 'Surprise your',
    description: 'Create unique and memorable gifts for your loved ones',
    defaultButtonText: 'Shop Gifts',
    defaultButtonColor: '#F46782'  // primary_color
  },
  {
    id: 'courses',
    title: 'Creativity',
    subtitle: 'Unlock',
    description: 'Learn new skills with our comprehensive course offerings',
    defaultButtonText: 'Browse Courses',
    defaultButtonColor: '#1F76BD'  // gift_blue
  },
  {
    id: 'events',
    title: 'Style',
    subtitle: 'Celebrate In',
    description: 'Discover and join exciting events in your area',
    defaultButtonText: 'View Events',
    defaultButtonColor: '#1F76BD'  // gift_blue
  },
  {
    id: 'corporate',
    title: 'Company',
    subtitle: 'Brand your',
    description: 'Professional solutions for your business needs',
    defaultButtonText: 'Learn More',
    defaultButtonColor: '#1F76BD'  // gift_blue
  }
];

const BUTTON_COLORS = [
  { name: 'Primary Pink', value: '#F46782' },     // primary_color (for gifts)
  { name: 'Gift Blue', value: '#1F76BD' },       // gift_blue (for courses, events, corporate)
  { name: 'Nav Purple', value: '#8300FF' },      // nav_blue (admin color)
  { name: 'Course Blue', value: '#297CC0' },     // course_blue (alternative blue)
  { name: 'Green', value: '#22C55E' },
  { name: 'Orange', value: '#F97316' }
];

const AdminBanner = () => {
  const [banners, setBanners] = useState({});
  const [activeBannerSection, setActiveBannerSection] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageRemoved, setImageRemoved] = useState(false);
  const [formData, setFormData] = useState({
    subtitle: '',
    title: '',
    description: '',
    buttonText: '',
    buttonColor: '#8300FF',
    image: null
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banner");
      const data = await response.json();
      
      if (response.ok) {
        const bannersObj = {};
        data.banners.forEach(banner => {
          bannersObj[banner.pageType] = banner;
        });
        setBanners(bannersObj);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subtitle.trim()) newErrors.subtitle = 'Heading (small text) is required';
    if (!formData.title.trim()) newErrors.title = 'Main heading is required';
    if (!formData.buttonText.trim()) newErrors.buttonText = 'Button text is required';
    if (!formData.buttonColor.trim()) newErrors.buttonColor = 'Button color is required';
    
    // Image validation - always required, either new image or existing image (unless removed)
    const hasNewImage = formData.image && formData.image.url;
    const hasExistingImage = isEditing && banners[activeBannerSection]?.image?.url && !imageRemoved;
    
    if (!hasNewImage && !hasExistingImage) {
      newErrors.image = 'Banner image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('images', file); // Use 'images' to match API expectation

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        // API returns array of images, take the first one
        const uploadedImageData = result.images[0];
        const imageData = {
          url: uploadedImageData.url,
          public_id: uploadedImageData.public_id,
          alt: `Banner image for ${activeBannerSection}`
        };
        setUploadedImage(imageData);
        setFormData(prev => ({ ...prev, image: imageData }));
        setImageRemoved(false); // Reset the removed flag when new image is uploaded
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        alert(`Failed to upload image: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    // For newly uploaded images, delete from cloud storage
    if (uploadedImage?.public_id) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_id: uploadedImage.public_id }),
        });
      } catch (error) {
        console.error('Error removing image from cloud:', error);
        alert('Error removing image. Please try again.');
        return;
      }
    }

    // Reset image state regardless of whether it was newly uploaded or existing
    setUploadedImage(null);
    setFormData(prev => ({ ...prev, image: null }));
    setImageRemoved(true); // Mark that the image has been removed
  };

  const handleEditBanner = (sectionId) => {
    const section = BANNER_SECTIONS.find(s => s.id === sectionId);
    const existingBanner = banners[sectionId];
    
    setActiveBannerSection(sectionId);
    setIsEditing(!!existingBanner);
    setImageRemoved(false); // Reset image removed flag when starting to edit
    
    if (existingBanner) {
      // Populate form with existing banner data
      console.log('Editing existing banner:', existingBanner);
      setFormData({
        subtitle: existingBanner.subtitle || '',
        title: existingBanner.title || '',
        description: existingBanner.description || '',
        buttonText: existingBanner.buttonText || '',
        buttonColor: existingBanner.buttonColor || section.defaultButtonColor,
        image: existingBanner.image
      });
      setUploadedImage(existingBanner.image);
    } else {
      // Populate with default values for new banner
      console.log('Creating new banner for section:', sectionId);
      setFormData({
        subtitle: section.subtitle,
        title: section.title,
        description: section.description,
        buttonText: section.defaultButtonText,
        buttonColor: section.defaultButtonColor,
        image: null
      });
      setUploadedImage(null);
    }
  };

  const handleCancel = () => {
    console.log('handleCancel called - resetting form and navigation');
    setFormData({
      subtitle: '',
      title: '',
      description: '',
      buttonText: '',
      buttonColor: '#8300FF',
      image: null
    });
    setUploadedImage(null);
    setActiveBannerSection(null);
    setIsEditing(false);
    setImageRemoved(false); // Reset image removed flag
    setErrors({});
    console.log('handleCancel completed - should show preview grid');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('=== onSubmit function called ===');
    console.log('Form data:', formData);
    
    // Validate form like AdminProducts
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }
    
    console.log('Form validation passed');
    setIsSubmitting(true);
    
    if (!activeBannerSection) {
      console.log('No banner section selected');
      alert("No banner section selected.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Determine which image to use: new image, or existing (if not removed)
      const imageToUse = formData.image || (!imageRemoved ? banners[activeBannerSection]?.image : null);
      
      // Additional validation to ensure we have a valid image
      if (!imageToUse || !imageToUse.url || !imageToUse.public_id) {
        alert("Error: No valid image found. Please upload an image before saving.");
        setIsSubmitting(false);
        return;
      }
      
      const submitData = {
        ...formData,
        pageType: activeBannerSection,
        buttonLink: `/${activeBannerSection}`,
        image: imageToUse,
        isActive: true
      };

      console.log('Submitting banner data:', submitData);

      const response = await fetch('/api/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Banner save successful:', result);
        
        // Update banners state first
        await fetchBanners();
        
        // Reset form and navigation state (same as products pattern)
        handleCancel();
        
        // Show success message
        alert(result.message);
      } else {
        const errorData = await response.json();
        console.error('Banner save error:', errorData);
        alert(`Failed to save banner: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Error saving banner. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[36px] text-[#8300FF] font-bold">Banner Management</h1>
      </div>

      {activeBannerSection ? (
        /* Edit Form */
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isEditing ? 'Edit Banner' : 'Create Banner'}
            </h2>
            <p className="text-sm text-gray-600">
              {isEditing 
                ? `Update the ${BANNER_SECTIONS.find(s => s.id === activeBannerSection)?.title} banner information below and save your changes.`
                : `Create a new ${BANNER_SECTIONS.find(s => s.id === activeBannerSection)?.title} banner by filling out the form below.`
              }
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Banner Content
              </h3>

              {/* Live Preview */}
              <div className="bg-gray-100 p-6 rounded-lg mb-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-700">Live Preview</h4>
                <div className="relative h-64 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg overflow-hidden">
                  {uploadedImage ? (
                    <Image
                      src={uploadedImage.url}
                      alt="Banner Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">📄</span>
                        </div>
                        <p className="text-sm opacity-80">Upload an image to see preview</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 flex items-center">
                    <div className="text-white px-8 max-w-lg">
                      {formData.subtitle && (
                        <p className="text-lg mb-3 font-semibold opacity-90">{formData.subtitle}</p>
                      )}
                      <h2 className="text-6xl font-satisfy mb-2">
                        {formData.title || "Enter main heading..."}
                      </h2>
                      {formData.description && (
                        <p className="text-sm mb-4 opacity-80">{formData.description}</p>
                      )}
                      <button 
                        className="text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        style={{ 
                          backgroundColor: formData.buttonColor || "#8300FF",
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        {formData.buttonText || "Enter button text..."}
                      </button>
                    </div>
                  </div>

                  {/* Section Overlay Tag */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
                      {activeBannerSection.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Heading (Small Text) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heading (Small Text) *
                  </label>
                  <input
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="e.g., Surprise your"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                  />
                  {errors.subtitle && (
                    <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Small text that appears above the main heading</p>
                </div>

                {/* Main Heading */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Heading *
                  </label>
                  <input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Valentine"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Large decorative text - the main banner heading</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Additional descriptive text for the banner"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">Optional description text that appears below the heading</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Button Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Text *
                  </label>
                  <input
                    value={formData.buttonText}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                    placeholder="e.g., Shop Now"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                  />
                  {errors.buttonText && (
                    <p className="text-red-500 text-sm mt-1">{errors.buttonText}</p>
                  )}
                </div>

                {/* Button Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Color *
                  </label>
                  <Select 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, buttonColor: value }))} 
                    value={formData.buttonColor}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select button color" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {BUTTON_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.value }}
                            ></div>
                            <span>{color.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.buttonColor && (
                    <p className="text-red-500 text-sm mt-1">{errors.buttonColor}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Banner Image
              </h3>

              {uploadedImage ? (
                <div className="relative inline-block">
                  <Image
                    src={uploadedImage.url}
                    alt="Banner"
                    width={300}
                    height={200}
                    className="rounded-lg object-cover border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-gray-600">Click to upload banner image</span>
                    <span className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                  </label>
                </div>
              )}

              {errors.image && (
                <p className="text-red-500 text-sm mt-2">{errors.image.message}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isSubmitting || isUploading
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-[#8300FF] text-white hover:bg-[#6b00cc]'
                }`}
              >
                {isSubmitting ? 'Saving...' : isUploading ? 'Processing...' : (isEditing ? 'Update Banner' : 'Create Banner')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
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
      ) : (
        /* Banner Preview Grid */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">Banner Management</h2>
                <p className="text-sm text-gray-600">
                  Manage your website banners • 4 sections available
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {BANNER_SECTIONS.map((section) => {
                const existingBanner = banners[section.id];
                return (
                  <div 
                    key={section.id}
                    className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#8300FF] transition-all cursor-pointer group"
                    onClick={() => handleEditBanner(section.id)}
                  >
                    {/* Banner Preview - Frontend Style */}
                    <div className="relative h-48 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center overflow-hidden">
                      {existingBanner?.image ? (
                        <Image
                          src={existingBanner.image.url}
                          alt={existingBanner.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-white text-center">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">📄</span>
                          </div>
                          <p className="text-sm opacity-80">No banner image</p>
                        </div>
                      )}
                      
                      {/* Banner Content Overlay - Frontend Style */}
                      <div className="absolute inset-0 bg-black/40 flex items-center">
                        <div className="text-white px-8 max-w-lg">
                          {existingBanner?.subtitle && (
                            <p className="text-lg mb-3 font-semibold opacity-90">{existingBanner.subtitle}</p>
                          )}
                          <h2 className="text-6xl font-satisfy mb-2">
                            {existingBanner?.title || section.title}
                          </h2>
                          {existingBanner?.description && (
                            <p className="text-sm mb-4 opacity-80">{existingBanner.description}</p>
                          )}
                          <button 
                            className="text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            style={{ 
                              backgroundColor: existingBanner?.buttonColor || section.defaultButtonColor,
                              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            {existingBanner?.buttonText || section.defaultButtonText}
                          </button>
                        </div>
                      </div>
                      
                      {/* Section Overlay Tag */}
                      <div className="absolute top-3 left-3">
                        <div className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
                          {section.id.toUpperCase()}
                        </div>
                      </div>

                      {/* Click to Edit Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 text-gray-800 px-6 py-3 rounded-lg font-semibold shadow-lg transform scale-95 group-hover:scale-100 transition-transform duration-300">
                          {existingBanner ? 'Click to Edit' : 'Click to Create'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanner;
