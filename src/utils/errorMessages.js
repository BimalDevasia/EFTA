// User-friendly error messages and validation utilities for Event Categories
export const ERROR_MESSAGES = {
  // Form validation errors
  TITLE_REQUIRED: "Please enter a category name",
  TAG_REQUIRED: "Please enter a category tag",
  TAG_INVALID: "Category tag can only contain lowercase letters, numbers, and hyphens (e.g., birthday-gifts)",
  COLOR_REQUIRED: "Please select a color for this category",
  
  // Network and server errors
  NETWORK_ERROR: "Unable to connect to the server. Please check your internet connection and try again.",
  SERVER_ERROR: "Something went wrong on our end. Please try again in a few moments.",
  PERMISSION_ERROR: "You don't have permission to perform this action.",
  
  // Category-specific errors
  CATEGORY_EXISTS: "A category with this name already exists. Please choose a different name.",
  CATEGORY_NOT_FOUND: "The category you're trying to edit no longer exists.",
  CATEGORY_IN_USE: "This category cannot be deleted because it's being used by existing products.",
  
  // Generic success messages
  CATEGORY_SAVED: "Category saved successfully!",
  CATEGORY_CREATED: "New category created successfully!",
  CATEGORY_UPDATED: "Category updated successfully!",
  CATEGORY_DELETED: "Category deleted successfully!",
  
  // Loading states
  SAVING: "Saving category...",
  LOADING: "Loading categories...",
  DELETING: "Deleting category...",
};

export const SUCCESS_MESSAGES = {
  CATEGORY_CREATED: "🎉 Great! Your new category has been created and is ready to use.",
  CATEGORY_UPDATED: "✅ Perfect! Your category changes have been saved.",
  CATEGORY_DELETED: "🗑️ Category has been removed successfully.",
};

// Convert technical error messages to user-friendly ones
export const formatErrorMessage = (error, context = 'general') => {
  if (!error) return ERROR_MESSAGES.SERVER_ERROR;
  
  const errorString = typeof error === 'string' ? error.toLowerCase() : error.message?.toLowerCase() || '';
  
  // Network-related errors
  if (errorString.includes('fetch') || errorString.includes('network') || errorString.includes('connection')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  // Validation errors
  if (errorString.includes('validation') || errorString.includes('invalid')) {
    if (context === 'title') return ERROR_MESSAGES.TITLE_REQUIRED;
    if (context === 'tag') return ERROR_MESSAGES.TAG_INVALID;
    return "Please check your input and try again.";
  }
  
  // Duplicate errors
  if (errorString.includes('duplicate') || errorString.includes('exists') || errorString.includes('unique')) {
    return ERROR_MESSAGES.CATEGORY_EXISTS;
  }
  
  // Permission errors
  if (errorString.includes('unauthorized') || errorString.includes('forbidden') || errorString.includes('permission')) {
    return ERROR_MESSAGES.PERMISSION_ERROR;
  }
  
  // Not found errors
  if (errorString.includes('not found') || errorString.includes('404')) {
    return ERROR_MESSAGES.CATEGORY_NOT_FOUND;
  }
  
  // Conflict errors (category in use)
  if (errorString.includes('conflict') || errorString.includes('in use') || errorString.includes('referenced')) {
    return ERROR_MESSAGES.CATEGORY_IN_USE;
  }
  
  // Default fallback
  return ERROR_MESSAGES.SERVER_ERROR;
};

// Toast notification system (you can replace this with your preferred notification library)
export const showNotification = (message, type = 'info') => {
  // For now, using alert, but this can be replaced with a proper toast system
  if (type === 'error') {
    alert(`❌ ${message}`);
  } else if (type === 'success') {
    alert(`✅ ${message}`);
  } else if (type === 'warning') {
    alert(`⚠️ ${message}`);
  } else {
    alert(`ℹ️ ${message}`);
  }
};
