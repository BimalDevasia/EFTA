# Banner Management System

## Overview
The banner management system allows administrators to create, edit, and manage dynamic banners for different pages of the EFTA website. Each page (Gifts, Events, Courses, Corporate) can have its own customized banner with unique content and styling.

## Features

### Admin Features
- **Create Banners**: Upload images and set titles, subtitles, descriptions, and button configurations
- **Edit Banners**: Modify existing banner content and images
- **Delete Banners**: Remove banners and their associated images from Cloudinary
- **Preview**: Real-time preview of banner changes
- **Page-Specific**: Each page type can have only one banner (unique constraint)

### Dynamic Banner System
- **Fallback Support**: If no custom banner exists, the system falls back to default images and text
- **Responsive Design**: Banners adapt to different screen sizes
- **Image Optimization**: Integration with Cloudinary for optimized image delivery
- **Loading States**: Smooth loading experience with spinners

## Pages with Banner Support
1. **Gifts Page** (`/gifts`) - pageType: 'gifts'
2. **Events Page** (`/eventpg`) - pageType: 'events' 
3. **Courses Page** (`/courses`) - pageType: 'courses'
4. **Corporate Page** (`/corporates`) - pageType: 'corporate'

## Admin Interface

### Accessing Banner Management
1. Login to admin panel
2. Navigate to "Banners" section in the sidebar
3. Access at `/admin/banners`

### Creating a Banner
1. Select the page type from dropdown
2. Enter banner title (required)
3. Enter subtitle (optional)
4. Add description (optional) 
5. Set button text and link
6. Upload banner image (required)
7. Click "Save"

### Editing a Banner
1. Find the banner in the right panel
2. Click "Edit" button
3. Form will populate with existing data
4. Modify as needed
5. Click "Save" to update

### Deleting a Banner
1. Find the banner in the right panel
2. Click "Delete" button
3. Confirm deletion
4. Banner and associated image will be removed

## Technical Implementation

### Database Schema
```javascript
{
  title: String (required),
  subtitle: String (optional),
  description: String (optional),
  pageType: String (required, enum: ['gifts', 'courses', 'events', 'corporate']),
  buttonText: String (required, default: 'Shop Now'),
  buttonLink: String (required, default: '/gifts'),
  image: {
    url: String (required),
    public_id: String (required),
    alt: String (optional)
  },
  isActive: Boolean (default: true)
}
```

### API Endpoints
- `GET /api/banner` - Fetch all banners or specific by pageType
- `POST /api/banner` - Create or update banner
- `DELETE /api/banner/[bannerId]` - Delete specific banner

### Components
- `AdminBanner.jsx` - Admin interface for banner management
- `DynamicBanner.jsx` - Frontend banner display component

## Image Requirements
- **Recommended Size**: 1920x800px
- **Formats**: JPG, PNG, GIF
- **Optimization**: Automatic via Cloudinary integration
- **Storage**: Cloudinary with automatic cleanup on deletion

## Usage in Pages

### Implementation Example
```jsx
import DynamicBanner from '@/components/DynamicBanner';

// In your page component
<DynamicBanner 
  pageType="gifts"
  onClick={scrollFunction}
  defaultImage="./giftmain.png"
  defaultTitle="Valentine" 
  defaultSubtitle="Surprise your"
/>
```

### Props
- `pageType`: String - The page identifier for fetching the right banner
- `onClick`: Function - Scroll or navigation function for the "Scroll down" button
- `defaultImage`: String - Fallback image if no custom banner exists
- `defaultTitle`: String - Fallback title text
- `defaultSubtitle`: String - Fallback subtitle text

## Fallback Behavior
If no custom banner is found for a page type, the system will:
1. Use the provided default image
2. Display default title and subtitle
3. Show standard "Shop Now" button
4. Maintain all styling and functionality

## Best Practices
1. **Image Quality**: Use high-resolution images (1920x800px) for best results
2. **Text Contrast**: Ensure text is readable against the banner image
3. **Content Length**: Keep titles concise for better mobile display
4. **Button Links**: Use absolute paths for button links
5. **Alt Text**: Provide meaningful alt text for accessibility

## Troubleshooting

### Banner Not Displaying
1. Check if banner exists for the page type
2. Verify image URL is accessible
3. Check browser console for errors
4. Ensure API endpoints are working

### Upload Issues
1. Verify Cloudinary configuration
2. Check file size limits
3. Ensure supported file formats
4. Check network connectivity

### Deletion Issues
1. Verify banner ID is valid
2. Check Cloudinary credentials
3. Ensure proper permissions
4. Check for database connection issues

## Future Enhancements
- Multiple banners per page with scheduling
- A/B testing capabilities  
- Animation and transition effects
- Video banner support
- Mobile-specific banner variations
