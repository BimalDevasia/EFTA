"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Equal } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z
  .object({
    productName: z.string().min(1, "Product Name is required"),
    description: z.string().min(1, "Description is required"),
    productDetails: z.string().min(1, "Product Details are required"),
    productCategory: z.string().min(1, "Product Category is required"),
    productMRP: z.number().min(0, "MRP must be positive"),
    offerPercentage: z
      .number()
      .min(0)
      .max(100, "Percentage must be between 0 and 100"),
    productType: z.enum([
      "non-customisable",
      "customisable",
      "heavyCustomisable",
    ]),
    customTextHeading: z.string().optional(),
    numberOfCustomImages: z
      .number()
      .int()
      .min(0, "Number of images must be non-negative")
      .optional(),
    images: z.array(z.object({
      url: z.string().url("Invalid image URL"),
      public_id: z.string().min(1, "Public ID is required"),
      alt: z.string().optional()
    })).min(1, "At least one product image is required"),
  })
  .refine(
    (data) => {
      if (
        data.productType === "customisable" ||
        data.productType === "heavyCustomisable"
      ) {
        return (
          data.numberOfCustomImages > 0 &&
          data.customTextHeading &&
          data.customTextHeading.length > 0
        );
      }
      return true;
    },
    {
      message:
        "Customisable products must have a custom text heading and a positive number of custom images",
      path: ["root"],
    }
  );

function AdminGift() {
  const [selectedValue, setSelectedValue] = useState("non-customisable");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleCancel = () => {
    reset();
    setSelectedValue("non-customisable");
    setUploadedImages([]);
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newImages = data.images.map(img => ({
          url: img.url,
          public_id: img.public_id,
          alt: ''
        }));
        
        const updatedImages = [...uploadedImages, ...newImages];
        setUploadedImages(updatedImages);
        // Update form with images
        setValue('images', updatedImages);
      } else {
        const errorData = await response.json();
        alert(`Failed to upload images: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (index, publicId) => {
    try {
      // Delete from Cloudinary
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: publicId }),
      });

      // Remove from local state
      const newImages = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(newImages);
      setValue('images', newImages);
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Error removing image. Please try again.');
    }
  };

  const resize = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      offerPercentage: 0,
      productMRP: 0,
      productType: "non-customisable",
      numberOfCustomImages: 0,
      images: [],
    },
  });

  const onSubmit = async (data) => {
    // Validate images before submission
    if (uploadedImages.length === 0) {
      alert("Please upload at least one product image before saving.");
      return;
    }

    try {
      // Ensure images are included
      const submitData = {
        ...data,
        images: uploadedImages
      };

      const response = await fetch('/api/gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
  
      if (response.ok) {
        console.log("Product added successfully!");
        reset(); // Reset form after successful submission
        setSelectedValue("non-customisable"); // Reset radio button state
        setUploadedImages([]); // Reset uploaded images
        alert("Product added successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to add product:", errorData);
        alert(`Failed to add product: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    }
  };




  const offerPercentage = watch("offerPercentage");
  const productMRP = watch("productMRP");

  const productType = watch("productType");

  const offerPrice =
    typeof offerPercentage === 'number' && typeof productMRP === 'number'
      ? ((100 - offerPercentage) / 100) * productMRP
      : 0;


  return (
    <div className="flex w-full overflow-y-auto h-full">
      <div className="w-40 px-5 flex flex-col gap-5">
        <img
          src="/product-image.png"
          alt=""
          className="w-32 h-32 object-cover bg-no-repeat"
        />
        <p className="font-poppins font-medium ">Coffee Mug</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-5 flex flex-col gap-[26px] pt-5 border-l-2  border-solid">
        <div className="flex justify-between items-center">
          <p className="  text-nav_blue text-4xl font-poppins font-bold ">
            Gifts Details
          </p>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={handleCancel}
              className="w-44 h-12 px-3 border-[#8300FF] border-2 font-poppins font-bold text-[#8300FF] text-xl">
              {" "}
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || uploadedImages.length === 0}
              className={`w-44 h-12 px-3 font-poppins font-bold text-xl transition-colors ${
                isUploading || uploadedImages.length === 0
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-[#8300FF] text-white hover:bg-[#6b00cc]'
              }`}
            >
              {isUploading ? 'Processing...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Display root-level validation errors */}
        {errors.root && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{errors.root.message}</p>
          </div>
        )}

        <div>
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">Product Name</p>
            <input
              {...register("productName")}
              className="resize-none border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-5 py-3 text-xl font-medium font-poppins overflow-hidden"
            />
            {errors.productName && (
              <p className="text-red-500">{errors.productName.message}</p>
            )}
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">Description</p>
            <textarea
              {...register("description")}
              rows={1}
              className="resize-none border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-5 py-3 text-base font-normal font-poppins overflow-hidden"
              onInput={(e) => resize(e.target)}
            ></textarea>
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">Product Details</p>
            <textarea
              {...register("productDetails")}
              rows={1}
              className="resize-none border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-5 py-3 text-base font-medium  font-poppins overflow-hidden"
              onInput={(e) => resize(e.target)}
            ></textarea>
            {errors.productDetails && (
              <p className="text-red-500">{errors.productDetails.message}</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">
              Product Category
            </p>
            <Controller
              name="productCategory"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem className="cursor-pointer" value="gift">
                      Gift
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer"
                      value="corporate-gifts"
                    >
                      Corporate Gifts
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="cakes">
                      Cakes
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.productCategory && (
              <p className="text-red-500">{errors.productCategory.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-7 items-center">
          <div>
            <p className="font-poppins text-base font-light">Product MRP</p>
            <input
              {...register("productMRP", { valueAsNumber: true })}
              type="number"
              min="0"
              step="0.01"
              className="resize-none border-[#0000004D] border-2 w-28 border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-2 py-3 text-base font-medium  font-poppins overflow-hidden"
            />
            {errors.productMRP && (
              <p className="text-red-500">{errors.productMRP.message}</p>
            )}
          </div>
          <div>
            <p className="font-poppins text-base font-light">
              Offer Percentage
            </p>
            <input
              {...register("offerPercentage", { valueAsNumber: true })}
              type="number"
              min="0"
              max="100"
              step="0.01"
              className="resize-none border-[#0000004D] border-2 w-40 border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-2 py-3 text-base font-medium  font-poppins overflow-hidden"
            />
            {errors.offerPercentage && (
              <p className="text-red-500">{errors.offerPercentage.message}</p>
            )}
          </div>

          <div className="text-2xl font-poppins font-light h-fit self-end mb-4">
            <Equal />
          </div>

          <div>
            <p className="font-poppins text-base font-light">Offer Prize</p>
            <input
              disabled
              type="number"
              value={offerPrice.toFixed(2)}
              className="resize-none border-[#0000004D] border-2 w-28 border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-2 py-3 text-base font-medium  font-poppins overflow-hidden bg-gray-50"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">Product Images</p>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer inline-block px-4 py-2 rounded-md font-poppins text-sm transition-colors ${
                  isUploading 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Choose Images'}
              </label>
              <p className="text-gray-500 font-poppins text-sm mt-2">
                Select multiple images (JPG, PNG, GIF)
              </p>
            </div>

            {/* Display uploaded images */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index, image.public_id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Error display */}
            {errors.images && (
              <p className="text-red-500 text-sm">{errors.images.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-poppins text-base font-light">Product Type</p>

          <Controller
            name="productType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                className="flex gap-3"
                onValueChange={(value) => {
                  setSelectedValue(value);
                  field.onChange(value);
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="non-customisable"
                    id="non-customisable"
                  />
                  <Label
                    htmlFor="non-customisable"
                    className={`font-poppins text-base  ${
                      selectedValue === "non-customisable"
                        ? "font-bold"
                        : "font-normal"
                    }`}
                  >
                    Non Customisable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customisable" id="customisable" />
                  <Label
                    htmlFor="customisable"
                    className={`font-poppins text-base  ${
                      selectedValue === "customisable"
                        ? "font-bold"
                        : "font-normal"
                    }`}
                  >
                    Customisable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="heavyCustomisable"
                    id="heavyCustomisable"
                  />
                  <Label
                    htmlFor="heavyCustomisable"
                    className={`font-poppins text-base  ${
                      selectedValue === "heavyCustomisable"
                        ? "font-bold"
                        : "font-normal"
                    }`}
                  >
                    Heavy Customisable
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.productType && (
            <p className="text-red-500">{errors.productType.message}</p>
          )}
        </div>

        {(productType === "customisable" ||
          productType === "heavyCustomisable") && (
          <>
            <div>
              <div className="flex flex-col gap-2">
                <p className="font-poppins text-base font-light">
                  Custom Text Heading
                </p>
                <input
                  {...register("customTextHeading")}
                  className="resize-none border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-5 py-3 text-base font-medium  font-poppins overflow-hidden"
                />
                {errors.customTextHeading && (
                  <p className="text-red-500">
                    {errors.customTextHeading.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-2">
                <p className="font-poppins text-base font-light">
                  Number of Custom Images
                </p>
                <input
                  {...register("numberOfCustomImages", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="1"
                  className="resize-none border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-5 py-3 text-base font-medium  font-poppins overflow-hidden"
                />
                {errors.numberOfCustomImages && (
                  <p className="text-red-500">
                    {errors.numberOfCustomImages.message}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default AdminGift;
