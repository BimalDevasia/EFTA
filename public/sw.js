// Service Worker for handling chunk loading errors
const CACHE_NAME = 'efta-cache-v1';
const CHUNK_CACHE_NAME = 'efta-chunks-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== CHUNK_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event with chunk error handling
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle JS chunks specifically
  if (url.pathname.includes('/_next/static/chunks/') || 
      url.pathname.includes('/_next/static/css/') ||
      url.pathname.includes('.js') || 
      url.pathname.includes('.css')) {
    
    event.respondWith(
      caches.open(CHUNK_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Serving from cache:', url.pathname);
            return cachedResponse;
          }
          
          return fetch(event.request).then((response) => {
            // Only cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              cache.put(event.request, responseClone);
              console.log('Cached chunk:', url.pathname);
            }
            return response;
          }).catch((error) => {
            console.error('Chunk fetch failed:', url.pathname, error);
            
            // Try to serve stale cache as fallback
            return cache.match(event.request).then((staleResponse) => {
              if (staleResponse) {
                console.log('Serving stale cache for failed chunk:', url.pathname);
                return staleResponse;
              }
              
              // If no cache available, let the error propagate
              throw error;
            });
          });
        });
      })
    );
    return;
  }
  
  // Handle other requests normally
  event.respondWith(
    fetch(event.request).catch((error) => {
      console.log('Request failed:', event.request.url, error);
      throw error;
    })
  );
});

// Handle chunk load errors from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHUNK_LOAD_ERROR') {
    console.log('Received chunk load error message:', event.data.chunk);
    
    // Clear the failed chunk from cache
    caches.open(CHUNK_CACHE_NAME).then((cache) => {
      const chunkUrl = event.data.chunk;
      cache.delete(chunkUrl).then(() => {
        console.log('Cleared failed chunk from cache:', chunkUrl);
      });
    });
    
    // Notify client to retry
    event.ports[0].postMessage({
      type: 'CHUNK_CACHE_CLEARED',
      success: true
    });
  }
});