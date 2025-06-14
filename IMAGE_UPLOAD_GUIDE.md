# Image Upload with Cloudinary Integration

This implementation adds complete image upload functionality to the AdminGift component with Cloudinary storage and MongoDB URL persistence.

## Setup Instructions

### 1. Cloudinary Account Setup
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard and note down:
   - Cloud Name
   - API Key  
   - API Secret

### 2. Environment Variables
Update your `.env.local` file with your Cloudinary credentials:

```bash
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### 3. Dependencies Installed
The following packages have been installed:
- `cloudinary` - Official Cloudinary SDK
- `multer` - File upload handling
- `next-cloudinary` - Next.js Cloudinary integration

## Implementation Overview

### 1. File Structure
```
src/
├── lib/
│   ├── cloudinary.js          # Cloudinary configuration & upload functions
│   └── models/gift/gift.js    # Updated Gift model with images array
├── app/api/
│   ├── upload/route.js        # Image upload API endpoint
│   └── gift/route.js          # Updated gift creation API
└── components/
    └── AdminGift.jsx          # Updated component with image upload UI
```

### 2. Key Features Implemented

#### Image Upload Component
- Drag & drop file selection
- Multiple image upload support
- Real-time upload progress
- Image preview with thumbnails
- Delete functionality for uploaded images
- Form validation for required images

#### Cloudinary Integration
- Automatic image optimization (800x800 max size)
- Auto-quality and format selection
- Organized folder structure (`gifts/`)
- Secure upload with transformation presets

#### Database Schema
- Images stored as array of objects with:
  - `url`: Cloudinary secure URL
  - `public_id`: Cloudinary public ID for deletion
  - `alt`: Optional alt text for accessibility

#### API Endpoints
- `POST /api/upload` - Handles image uploads to Cloudinary
- `DELETE /api/upload` - Handles image deletion from Cloudinary
- `POST /api/gift` - Creates gift with image URLs in MongoDB

### 3. Form Validation
Updated Zod schema includes:
- Required images array (minimum 1 image)
- URL validation for each image
- Public ID validation for Cloudinary references

### 4. User Experience Features
- Loading states during upload/processing
- Error handling with user-friendly messages
- Form reset functionality clears uploaded images
- Disabled submit button until images are uploaded
- Visual feedback for upload progress

## Usage Flow

1. **Select Images**: User clicks "Choose Images" to select multiple files
2. **Upload Process**: Images are uploaded to Cloudinary via `/api/upload`
3. **Preview**: Uploaded images display as thumbnails with delete buttons
4. **Form Submission**: When form is submitted, Cloudinary URLs are saved to MongoDB
5. **Cleanup**: If images are removed, they're deleted from Cloudinary

## Security Considerations

- File type validation (only images allowed)
- File size limits enforced by Cloudinary
- Secure API endpoints with error handling
- Environment variables for sensitive credentials
- Automatic image optimization reduces storage costs

## Error Handling

- Network errors during upload
- Cloudinary API errors
- File validation errors
- Database save errors
- User-friendly error messages

## Next Steps (Optional Enhancements)

1. **Image Reordering**: Add drag-and-drop to reorder images
2. **Alt Text Editor**: Allow users to add alt text for accessibility
3. **Image Cropping**: Add image cropping functionality
4. **Bulk Operations**: Add bulk delete/upload features
5. **Image Variants**: Generate multiple sizes for different use cases

## Testing

To test the implementation:

1. Ensure your Cloudinary credentials are set in `.env.local`
2. Start your development server: `npm run dev`
3. Navigate to the admin gift page
4. Try uploading images and submitting the form
5. Check your Cloudinary dashboard for uploaded images
6. Verify the gift record in MongoDB contains image URLs

## Troubleshooting

### Common Issues:
1. **Upload fails**: Check Cloudinary credentials and network connection
2. **Images not displaying**: Verify Cloudinary URLs are accessible
3. **Form validation errors**: Ensure at least one image is uploaded
4. **API errors**: Check server logs for detailed error messages

### Debug Steps:
1. Check browser console for JavaScript errors
2. Verify API responses in Network tab
3. Check server logs for API endpoint errors
4. Validate environment variables are loaded correctly
