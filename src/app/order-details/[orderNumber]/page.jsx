"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const PublicOrderDetailsPage = () => {
  const params = useParams();
  const orderNumber = params.orderNumber;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails();
    }
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/orders/public/${orderNumber}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.message || "Order not found");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'text-orange-700 bg-orange-100';
      case 'Assigned':
        return 'text-blue-700 bg-blue-100';
      case 'Shipped':
        return 'text-purple-700 bg-purple-100';
      case 'Delivered':
        return 'text-green-700 bg-green-100';
      case 'Cancelled':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'Paid':
        return 'text-green-700 bg-green-100';
      case 'Refunded':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-red-700 bg-red-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8300FF] mx-auto mb-4"></div>
          <div className="text-[#666] font-medium">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-[#8300FF] text-white rounded-md hover:bg-[#7300e6] transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#8300FF] mb-2">
                Order Details
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Order #{order.orderNumber} • Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/"
                className="px-4 py-2 text-[#8300FF] border border-[#8300FF] rounded-md hover:bg-[#8300FF] hover:text-white transition-colors text-sm"
              >
                Back to Home
              </Link>
              <button
                onClick={() => {
                  const orderDetailsText = `EFTA Order Details\n\nOrder ID: ${order.orderNumber}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nAmount: ₹${order.totalAmount.toFixed(0)}\nStatus: ${order.status}\nPayment: ${order.paymentStatus || 'Not Paid'}\nDate: ${new Date(order.orderDate).toLocaleDateString('en-IN')}\n\nView details: ${window.location.href}`;
                  
                  if (navigator.share) {
                    navigator.share({
                      title: `EFTA Order ${order.orderNumber}`,
                      text: orderDetailsText,
                    });
                  } else {
                    navigator.clipboard.writeText(orderDetailsText).then(() => {
                      alert('Order details copied to clipboard!');
                    });
                  }
                }}
                className="px-4 py-2 bg-[#8300FF] text-white rounded-md hover:bg-[#7300e6] transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Order Status Banner */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium">Order Status</p>
                <p>Last updated: {new Date(order.updatedAt || order.orderDate).toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 font-medium">Payment Status</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus || 'Not Paid')}`}>
                  {order.paymentStatus || 'Not Paid'}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-[#8300FF]">₹{order.totalAmount.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer & Order Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Customer Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600 font-medium block">Name</span>
                  <span className="text-gray-900">{order.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium block">Phone</span>
                  <span className="text-gray-900">{order.customerPhone}</span>
                </div>
                {order.customerEmail && (
                  <div>
                    <span className="text-gray-600 font-medium block">Email</span>
                    <span className="text-gray-900">{order.customerEmail}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600 font-medium block">Delivery Address</span>
                  <span className="text-gray-900">{order.deliveryAddress}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium block">Pincode</span>
                  <span className="text-gray-900">{order.pincode}</span>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Order Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600 font-medium block">Order ID</span>
                  <span className="text-[#8300FF] font-semibold">{order.orderNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium block">Order Date</span>
                  <span className="text-gray-900">{new Date(order.orderDate).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium block">Total Items</span>
                  <span className="text-gray-900">{order.totalItems} items</span>
                </div>
                {order.paymentMethod && (
                  <div>
                    <span className="text-gray-600 font-medium block">Payment Method</span>
                    <span className="text-gray-900">{order.paymentMethod}</span>
                  </div>
                )}
                {order.paymentDate && (
                  <div>
                    <span className="text-gray-600 font-medium block">Payment Date</span>
                    <span className="text-gray-900">{new Date(order.paymentDate).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Items & Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items Ordered */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
                </svg>
                Items Ordered
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-[#8300FF] transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {item.productId && (
                          <p className="text-xs text-[#8300FF] font-medium mb-1">
                            Product ID: {item.productId}
                          </p>
                        )}
                        <h4 className="font-semibold text-gray-900 text-base mb-2">{item.name}</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>Quantity: <span className="font-medium">{item.quantity || 1}</span></span>
                          <span>Unit Price: <span className="font-medium">₹{parseFloat(item.price || 0).toFixed(0)}</span></span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="line-through text-gray-500">
                              Original: ₹{parseFloat(item.originalPrice).toFixed(0)}
                            </span>
                          )}
                        </div>
                        {item.customization && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-md">
                            <p className="text-xs text-blue-600 font-medium">Customization:</p>
                            <p className="text-sm text-blue-800">{JSON.stringify(item.customization)}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-lg text-[#8300FF]">
                          ₹{(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(0)}
                        </p>
                        <p className="text-xs text-gray-500">
                          (₹{parseFloat(item.price || 0).toFixed(0)} × {item.quantity || 1})
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Order Summary
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Subtotal ({order.totalItems} items):</span>
                  <span className="font-medium text-gray-900">₹{order.subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Delivery Charges:</span>
                  <span className="font-medium text-gray-900">
                    {order.deliveryCharge === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      `₹${order.deliveryCharge.toFixed(0)}`
                    )}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 text-lg">Total Amount:</span>
                  <span className="font-bold text-[#8300FF] text-2xl">₹{order.totalAmount.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>For any queries regarding this order, please contact EFTA support.</span>
              </div>
              <div className="text-[#8300FF] font-semibold">
                © EFTA - Excellence in Gifts & Events
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicOrderDetailsPage;
