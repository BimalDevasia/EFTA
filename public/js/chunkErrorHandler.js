// Client-side chunk error handler - IIFE version for script tag
(function() {
  'use strict';
  
  // Chunk error handler class
  function ChunkErrorHandler() {
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.init();
  }
  
  ChunkErrorHandler.prototype.init = function() {
    var self = this;
    
    // Handle unhandled promise rejections (chunk loading errors)
    window.addEventListener('unhandledrejection', function(event) {
      var error = event.reason;
      
      if (self.isChunkError(error)) {
        console.warn('Chunk loading error detected:', error);
        event.preventDefault();
        self.handleChunkError(error);
      }
    });
    
    // Handle regular errors
    window.addEventListener('error', function(event) {
      var error = event.error;
      
      if (self.isChunkError(error)) {
        console.warn('Chunk loading error detected in error handler:', error);
        event.preventDefault();
        self.handleChunkError(error);
      }
    });
    
    // Register service worker if supported
    if ('serviceWorker' in navigator) {
      this.registerServiceWorker();
    }
  };
  
  ChunkErrorHandler.prototype.isChunkError = function(error) {
    if (!error) return false;
    
    var message = error.message || error.toString();
    var name = error.name || '';
    
    return (
      message.indexOf('Loading chunk') !== -1 ||
      message.indexOf('ChunkLoadError') !== -1 ||
      name === 'ChunkLoadError' ||
      message.indexOf('Loading CSS chunk') !== -1 ||
      message.indexOf('failed to import') !== -1
    );
  };
  
  ChunkErrorHandler.prototype.handleChunkError = function(error) {
    var self = this;
    var chunkId = this.extractChunkId(error);
    var attempts = this.retryAttempts.get(chunkId) || 0;
    
    if (attempts >= this.maxRetries) {
      console.error('Max retry attempts reached for chunk:', chunkId);
      this.showUserError();
      return;
    }
    
    this.retryAttempts.set(chunkId, attempts + 1);
    
    // Clear the failed chunk from service worker cache
    this.clearChunkCache(chunkId).then(function() {
      // Wait before retrying
      return self.delay(self.retryDelay * (attempts + 1));
    }).then(function() {
      // Reload the page as last resort
      if (attempts >= 2) {
        console.log('Reloading page due to persistent chunk errors');
        window.location.reload();
      }
    }).catch(function(err) {
      console.error('Error handling chunk failure:', err);
    });
  };
  
  ChunkErrorHandler.prototype.extractChunkId = function(error) {
    var message = error.message || error.toString();
    var match = message.match(/chunk\s+([^\s]+)/i);
    return match ? match[1] : 'unknown';
  };
  
  ChunkErrorHandler.prototype.clearChunkCache = function(chunkId) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      return new Promise(function(resolve) {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function(event) {
          resolve(event.data);
        };
        
        navigator.serviceWorker.controller.postMessage({
          type: 'CHUNK_LOAD_ERROR',
          chunk: chunkId
        }, [messageChannel.port2]);
      });
    }
    return Promise.resolve();
  };
  
  ChunkErrorHandler.prototype.delay = function(ms) {
    return new Promise(function(resolve) {
      setTimeout(resolve, ms);
    });
  };
  
  ChunkErrorHandler.prototype.showUserError = function() {
    // Create a user-friendly error notification
    var notification = document.createElement('div');
    notification.innerHTML = 
      '<div style="' +
        'position: fixed;' +
        'top: 20px;' +
        'right: 20px;' +
        'background: #fee2e2;' +
        'border: 1px solid #fecaca;' +
        'border-radius: 8px;' +
        'padding: 16px;' +
        'max-width: 300px;' +
        'z-index: 9999;' +
        'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);' +
      '">' +
        '<div style="display: flex; align-items: center; margin-bottom: 8px;">' +
          '<svg style="width: 20px; height: 20px; color: #dc2626; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>' +
          '</svg>' +
          '<strong style="color: #dc2626; font-size: 14px;">Loading Error</strong>' +
        '</div>' +
        '<p style="color: #7f1d1d; font-size: 13px; margin-bottom: 12px;">' +
          'Some resources failed to load. Please refresh the page.' +
        '</p>' +
        '<button onclick="window.location.reload()" style="' +
          'background: #dc2626;' +
          'color: white;' +
          'border: none;' +
          'padding: 6px 12px;' +
          'border-radius: 4px;' +
          'font-size: 12px;' +
          'cursor: pointer;' +
        '">' +
          'Refresh Page' +
        '</button>' +
        '<button onclick="this.parentElement.parentElement.remove()" style="' +
          'background: transparent;' +
          'color: #7f1d1d;' +
          'border: none;' +
          'padding: 6px 12px;' +
          'border-radius: 4px;' +
          'font-size: 12px;' +
          'cursor: pointer;' +
          'margin-left: 8px;' +
        '">' +
          'Dismiss' +
        '</button>' +
      '</div>';
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(function() {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  };
  
  ChunkErrorHandler.prototype.registerServiceWorker = function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('Service Worker registered successfully:', registration.scope);
    }).catch(function(error) {
      console.warn('Service Worker registration failed:', error);
    });
  };
  
  // Initialize the chunk error handler when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      new ChunkErrorHandler();
    });
  } else {
    new ChunkErrorHandler();
  }
})();
