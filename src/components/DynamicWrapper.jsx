'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Loading fallback component
const LoadingFallback = ({ className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Error fallback component for dynamic imports
const ErrorFallback = ({ error, retry, className = "" }) => (
  <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
    <div className="text-red-600 mb-2">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <p className="text-sm text-gray-600 mb-3 text-center">
      Failed to load component
    </p>
    <button
      onClick={retry}
      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
    >
      Retry
    </button>
  </div>
);

// Dynamic wrapper with retry logic
const DynamicWrapper = ({ 
  component, 
  loading = LoadingFallback, 
  error = ErrorFallback,
  ...props 
}) => {
  const [retryKey, setRetryKey] = React.useState(0);
  
  const DynamicComponent = React.useMemo(() => {
    return dynamic(
      () => {
        // Add retry logic by forcing re-import
        const importPromise = component();
        
        return importPromise.catch((err) => {
          console.error('Dynamic import failed:', err);
          
          // Check if it's a chunk loading error
          if (err?.message?.includes('Loading chunk') || 
              err?.message?.includes('ChunkLoadError') ||
              err?.name === 'ChunkLoadError') {
            console.warn('Chunk loading error in dynamic import, will retry...');
          }
          
          throw err;
        });
      },
      {
        loading: () => React.createElement(loading),
        ssr: false // Disable SSR for dynamic components that might have chunk issues
      }
    );
  }, [component, loading, retryKey]);

  const handleRetry = React.useCallback(() => {
    setRetryKey(prev => prev + 1);
  }, []);

  try {
    return (
      <Suspense fallback={React.createElement(loading)}>
        <DynamicComponent {...props} />
      </Suspense>
    );
  } catch (err) {
    return React.createElement(error, { error: err, retry: handleRetry });
  }
};

export default DynamicWrapper;
