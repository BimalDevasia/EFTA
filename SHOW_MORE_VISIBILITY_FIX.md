# ProductDetails Show More/Show Less Visibility Fix

## 🐛 Issue Identified:
The "Show more" and "Show less" text in the product details page was not visible enough due to subtle gray styling.

## ✅ Solution Applied:

### Original Styling:
```jsx
className="mt-3 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors flex items-center gap-1"
```

### Updated Styling:
```jsx
className="mt-3 text-black hover:text-gray-700 text-sm font-semibold transition-colors flex items-center gap-1 underline hover:bg-gray-50 px-2 py-1 rounded"
```

## 🔧 Changes Made:

### 1. **Text Color Improvement**:
- **Before**: `text-gray-600` (subtle gray)
- **After**: `text-black` (high contrast black)

### 2. **Font Weight Enhancement**:
- **Before**: `font-medium` 
- **After**: `font-semibold` (bolder text)

### 3. **Visual Enhancements**:
- **Added**: `underline` - Makes it clear it's clickable
- **Added**: `hover:bg-gray-50` - Subtle background on hover
- **Added**: `px-2 py-1 rounded` - Padding and rounded corners for better button appearance

### 4. **Icon Visibility**:
- **Before**: Default icon color (inherited gray)
- **After**: `text-black` explicitly set on ChevronUp/ChevronDown icons

## 📱 Expected Results:

✅ **High Contrast**: Black text on white background for maximum visibility
✅ **Clear Affordance**: Underline indicates clickable element  
✅ **Interactive Feedback**: Hover background provides visual feedback
✅ **Bold Typography**: Semibold weight makes text more prominent
✅ **Icon Visibility**: Black chevron icons are clearly visible

## 🧪 Testing:
- Text should now be easily readable in light mode
- Icons (chevron up/down) should be clearly visible
- Hover effect provides good user feedback
- Button appears more professional and clickable

## 📍 File Updated:
- `src/components/ProductDetails.jsx` (lines ~290-305)

The show more/show less functionality should now be clearly visible and provide a better user experience! 🎉
