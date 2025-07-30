'use client';

// Client-side chunk error handler
class ChunkErrorHandler {
  static instance = null;
  
  constructor() {
    if (ChunkErrorHandler.instance) {
      return ChunkErrorHandler.instance;
    }
    
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.retryDelay = 1000;
    
    ChunkErrorHandler.instance = this;
    this.init();
  }
  
  init() {
    // Handle unhandled promise rejections (chunk loading errors)
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      
      if (this.isChunkError(error)) {
        console.warn('Chunk loading error detected:', error);
        event.preventDefault();
        this.handleChunkError(error);
      }
    });
    
    // Handle regular errors
    window.addEventListener('error', (event) => {
      const error = event.error;
      
      if (this.isChunkError(error)) {
        console.warn('Chunk loading error detected in error handler:', error);
        event.preventDefault();
        this.handleChunkError(error);
      }
    });
    
    // Register service worker if supported
    if ('serviceWorker' in navigator) {
      this.registerServiceWorker();
    }
  }
  
  isChunkError(error) {
    if (!error) return false;
    
    const message = error.message || error.toString();
    const name = error.name || '';
    
    return (
      message.includes('Loading chunk') ||
      message.includes('ChunkLoadError') ||
      name === 'ChunkLoadError' ||
      message.includes('Loading CSS chunk') ||
      message.includes('failed to import')
    );
  }
  
  async handleChunkError(error) {
    const chunkId = this.extractChunkId(error);
    const attempts = this.retryAttempts.get(chunkId) || 0;
    
    if (attempts >= this.maxRetries) {
      console.error('Max retry attempts reached for chunk:', chunkId);
      this.showUserError();
      return;
    }
    
    this.retryAttempts.set(chunkId, attempts + 1);
    
    try {
      // Clear the failed chunk from service worker cache
      await this.clearChunkCache(chunkId);
      
      // Wait before retrying
      await this.delay(this.retryDelay * (attempts + 1));
      
      // Reload the page as last resort
      if (attempts >= 2) {
        console.log('Reloading page due to persistent chunk errors');
        window.location.reload();
      }
    } catch (err) {
      console.error('Error handling chunk failure:', err);
    }
  }
  
  extractChunkId(error) {
    const message = error.message || error.toString();
    const match = message.match(/chunk\s+([^\s]+)/i);
    return match ? match[1] : 'unknown';
  }
  
  async clearChunkCache(chunkId) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data);
        };
        
        navigator.serviceWorker.controller.postMessage({
          type: 'CHUNK_LOAD_ERROR',
          chunk: chunkId
        }, [messageChannel.port2]);
      });
    }
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  showUserError() {
    // Create a user-friendly error notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fee2e2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        padding: 16px;
        max-width: 300px;
        z-index: 9999;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      ">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <svg style="width: 20px; height: 20px; color: #dc2626; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <strong style="color: #dc2626; font-size: 14px;">Loading Error</strong>
        </div>
        <p style="color: #7f1d1d; font-size: 13px; margin-bottom: 12px;">
          Some resources failed to load. Please refresh the page.
        </p>
        <button onclick="window.location.reload()" style="
          background: #dc2626;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        ">
          Refresh Page
        </button>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: transparent;
          color: #7f1d1d;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          margin-left: 8px;
        ">
          Dismiss
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }
  
  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration.scope);
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
    }
  }
}

// Initialize the chunk error handler
if (typeof window !== 'undefined') {
  new ChunkErrorHandler();
}

export default ChunkErrorHandler;
