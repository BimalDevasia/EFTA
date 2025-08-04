"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CorporateTestPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchCorporateProducts() {
      try {
        console.log('Corporate Test Page: Fetching corporate products...');
        const response = await fetch('/api/products?giftType=corporateGift');
        const data = await response.json();
        
        console.log('Corporate Test Page: Response status:', response.status);
        console.log('Corporate Test Page: Data received:', data);
        
        if (response.ok) {
          setProducts(data.products || []);
        } else {
          setError(`API error: ${data.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error('Corporate Test Page: Error fetching products:', err);
        setError(`Network error: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCorporateProducts();
  }, []);
  
  return (
    <div className="pt-40 pb-10 px-6">
      <h1 className="text-2xl font-bold mb-6">Corporate Gifts Test Page</h1>
      
      {loading ? (
        <p>Loading corporate gifts...</p>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <p>No corporate gift products found.</p>
      ) : (
        <div>
          <p className="mb-4">Found {products.length} corporate gift products:</p>
          <ul className="space-y-4">
            {products.map(product => (
              <li key={product._id} className="p-4 border rounded-md">
                <h2 className="font-bold">{product.productName}</h2>
                <p>Gift Type: {product.giftType}</p>
                <p>Category: {product.productCategory}</p>
                <p>Visible: {product.isVisible ? 'Yes' : 'No'}</p>
                <p>Featured: {product.isFeatured ? 'Yes' : 'No'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
