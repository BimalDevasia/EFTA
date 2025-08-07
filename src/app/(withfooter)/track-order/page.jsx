"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const TrackOrderContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Check if order number is provided in URL params
    const orderParam = searchParams.get('order');
    if (orderParam) {
      setOrderNumber(orderParam);
      // Automatically redirect to the order details page
      const encodedOrderNumber = encodeURIComponent(orderParam);
      router.replace(`/order-details/${encodedOrderNumber}`);
    }
  }, [searchParams, router]);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      alert('Please enter an order number');
      return;
    }

    setIsSearching(true);
    // Encode the order number and redirect to order details page
    const encodedOrderNumber = encodeURIComponent(orderNumber.trim());
    router.push(`/order-details/${encodedOrderNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#8300FF] mb-4">
            Track Your Order
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your order number to view detailed order information
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Order Number
              </label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter your order number (e.g., #ORD1754544530838)"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent text-lg"
                disabled={isSearching}
              />
              <p className="text-sm text-gray-500 mt-2">
                You can find your order number in your order confirmation message
              </p>
            </div>

            <button
              type="submit"
              disabled={isSearching || !orderNumber.trim()}
              className="w-full px-6 py-3 bg-[#8300FF] text-white font-semibold rounded-md hover:bg-[#7300e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Need Help?
            </h3>
            <p className="text-blue-600 mb-4">
              Can't find your order number or having trouble tracking your order?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="px-4 py-2 text-[#8300FF] border border-[#8300FF] rounded-md hover:bg-[#8300FF] hover:text-white transition-colors"
              >
                Back to Home
              </Link>
              <Link 
                href="/contact"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* Order Format Examples */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Order Number Format Examples:
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-mono">#ORD1754544530838</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-mono">ORD1754544530838</span>
            </li>
            <li className="text-sm text-gray-500 mt-2">
              Order numbers usually start with "ORD" followed by numbers
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const TrackOrderPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8300FF] mx-auto mb-4"></div>
          <div className="text-[#666] font-medium">Loading...</div>
        </div>
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
};

export default TrackOrderPage;
