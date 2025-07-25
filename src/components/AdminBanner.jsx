"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),          pageType: z.enum(['gifts', 'courses', 'events', 'corporate'], {
    required_error: "Page type is required"
  }),
  buttonText: z.string().min(1, "Button text is required"),
  image: z.object({
    url: z.string().url("Invalid image URL"),
    public_id: z.string().min(1, "Public ID is required"),
    alt: z.string().optional()
  }, { required_error: "Banner image is required" }),
});

function AdminBanner() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      pageType: "gifts",
      buttonText: "Shop Now",
      image: null,
    },
  });

  const selectedPageType = watch('pageType');

  // Fetch existing banners
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banner');
      if (response.ok) {
        const data = await response.json();
        setBanners(Array.isArray(data.banners) ? data.banners : []);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('images', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const imageData = {
          url: data.images[0].url,
          public_id: data.images[0].public_id,
          alt: ''
        };
        
        setUploadedImage(imageData);
        setValue('image', imageData);
      } else {
        const errorData = await response.json();
        alert(`Failed to upload image: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!uploadedImage) return;

    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: uploadedImage.public_id }),
      });

      setUploadedImage(null);
      setValue('image', null);
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Error removing image. Please try again.');
    }
  };

  const onSubmit = async (data) => {
    if (!uploadedImage) {
      alert("Please upload a banner image before saving.");
      return;
    }

    try {
      const submitData = {
        ...data,
        buttonLink: "/gifts", // Always use /gifts as the button link
        image: uploadedImage
      };

      const response = await fetch('/api/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        reset();
        setUploadedImage(null);
        setIsEditing(false);
        setSelectedBanner(null);
        fetchBanners();
      } else {
        const errorData = await response.json();
        alert(`Failed to save banner: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Error saving banner. Please try again.");
    }
  };

  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setIsEditing(true);
    setUploadedImage(banner.image);
    
    // Populate form with banner data
    setValue('title', banner.title);
    setValue('subtitle', banner.subtitle || '');
    setValue('description', banner.description || '');
    setValue('pageType', banner.pageType);
    setValue('buttonText', banner.buttonText);
    setValue('image', banner.image);
  };

  const handleCancel = () => {
    reset();
    setUploadedImage(null);
    setIsEditing(false);
    setSelectedBanner(null);
  };

  const handleDelete = async (bannerId, publicId) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      // Delete image from Cloudinary
      if (publicId) {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_id: publicId }),
        });
      }

      // Delete banner from database
      const response = await fetch(`/api/banner/${bannerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Banner deleted successfully');
        fetchBanners();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete banner: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Error deleting banner');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[36px] text-[#8300FF] font-bold">Banner Management</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (!showAddForm) {
              setIsEditing(false);
              setSelectedBanner(null);
              reset();
              setUploadedImage(null);
            }
          }}
          className="bg-[#8300FF] text-white px-4 py-2 rounded-md hover:bg-[#6b00cc] transition-colors"
        >
          {showAddForm ? 'Cancel' : (isEditing ? 'Cancel Edit' : 'Add Banner')}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Banner' : 'Add New Banner'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">Page Type</p>
            <Controller
              name="pageType"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a page type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="gifts">Gifts Page</SelectItem>
                    <SelectItem value="courses">Courses Page</SelectItem>
                    <SelectItem value="events">Events Page</SelectItem>
                    <SelectItem value="corporate">Corporate Page</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.pageType && (
              <p className="text-red-500">{errors.pageType.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">Banner Title</p>
            <input
              {...register("title")}
              className="border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 focus:outline-none px-5 py-3 text-lg font-medium font-poppins"
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Subtitle */}
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">Banner Subtitle</p>
            <input
              {...register("subtitle")}
              className="border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 focus:outline-none px-5 py-3 text-base font-medium font-poppins"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">Description (Optional)</p>
            <textarea
              {...register("description")}
              rows={3}
              className="border-[#0000004D] border-2 w-full border-solid rounded-[8px] focus:outline-none px-5 py-3 text-base font-medium font-poppins"
            />
          </div>

          {/* Button Text */}
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">Button Text</p>
            <input
              {...register("buttonText")}
              className="border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 focus:outline-none px-5 py-3 text-base font-medium font-poppins"
            />
            {errors.buttonText && (
              <p className="text-red-500">{errors.buttonText.message}</p>
            )}
            <p className="text-sm text-gray-500">Button will always link to /gifts</p>
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">Banner Image</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="banner-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="banner-upload"
                className={`cursor-pointer inline-block px-4 py-2 rounded-md font-poppins text-sm transition-colors ${
                  isUploading 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Choose Banner Image'}
              </label>
              <p className="text-gray-500 font-poppins text-sm mt-2">
                Recommended: 1920x800px (JPG, PNG, GIF)
              </p>
            </div>

            {uploadedImage && (
              <div className="relative group mt-4">
                <Image
                  src={uploadedImage.url}
                  alt="Banner Preview"
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            )}

            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isUploading || !uploadedImage}
              className="bg-[#8300FF] text-white px-6 py-2 rounded-md hover:bg-[#6b00cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Processing...' : (isEditing ? 'Update Banner' : 'Add Banner')}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setIsEditing(false);
                setSelectedBanner(null);
                reset();
                setUploadedImage(null);
              }}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>

          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </form>
        </div>
      )}

      {/* Banners List Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Existing Banners ({banners.length})</h2>
        </div>
        
        <div className="p-6">
          {banners.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No banners created yet</p>
          ) : (
            <div className="space-y-4">
              {banners.map((banner) => (
                <div key={banner._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{banner.title}</h4>
                      <p className="text-sm text-gray-600 capitalize">{banner.pageType} Page</p>
                      {banner.subtitle && (
                        <p className="text-sm text-gray-500">{banner.subtitle}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          handleEdit(banner);
                          setShowAddForm(true);
                        }}
                        className="text-[#8300FF] hover:text-[#6b00cc] text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id, banner.image.public_id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {banner.image && (
                    <Image
                      src={banner.image.url}
                      alt={banner.title}
                      width={300}
                      height={96}
                      className="w-full h-24 object-cover rounded border mb-3"
                    />
                  )}
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Button: {banner.buttonText}</span>
                    <span>Page: {banner.pageType}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminBanner;
