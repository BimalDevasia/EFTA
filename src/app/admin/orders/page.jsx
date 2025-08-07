"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilterIcon, SearchIcon, EyeIcon, ClockIcon, TruckIcon, CheckIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter, paymentStatusFilter]);

  // Auto-refresh orders every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, searchTerm, statusFilter, paymentStatusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (paymentStatusFilter !== 'all') params.append('paymentStatus', paymentStatusFilter);
      
      const response = await fetch(`/api/orders?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Order status updated successfully");
        fetchOrders(); // Refresh the orders list
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(data.order);
        }
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const updatePaymentStatus = async (orderId, newPaymentStatus, paymentMethod = null) => {
    try {
      const requestBody = {
        orderId,
        paymentStatus: newPaymentStatus
      };
      
      if (paymentMethod) {
        requestBody.paymentMethod = paymentMethod;
      }

      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Payment status updated successfully");
        fetchOrders(); // Refresh the orders list
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(data.order);
        }
      } else {
        toast.error("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Order deleted successfully");
        fetchOrders(); // Refresh the orders list
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(null); // Clear selection if deleted order was selected
          setShowOrderModal(false); // Close modal if deleted order was selected
        }
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-40 pb-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center px-6">
            <h1 className="text-[36px] text-[#8300FF] font-bold">
              Order Management
            </h1>
          </div>

          {/* Orders Management Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    Orders Management
                  </h2>
                  <p className="text-sm text-gray-600">
                    Manage and track all customer orders • {orders.length} order{orders.length !== 1 ? 's' : ''} total
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Auto-refresh Toggle */}
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${
                      autoRefresh 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={autoRefresh ? 'Auto-refresh enabled (every 30s)' : 'Auto-refresh disabled'}
                  >
                    <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span>Auto-refresh</span>
                  </button>
                  
                  {/* Refresh Button */}
                  <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#8300FF] text-white rounded-md hover:bg-[#7300e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refresh orders"
                  >
                    <svg 
                      className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-sm">{loading ? 'Loading...' : 'Refresh'}</span>
                  </button>
                  
                  {/* Search Bar */}
                  <div className="relative w-80">
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                    />
                    <svg 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title="Clear search"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Filters Section */}
              <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Filters:</span>
                    
                    {/* Status Filter */}
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-600 mb-1">Order Status</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#8300FF] focus:border-transparent bg-white min-w-[140px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 rounded-md shadow-lg">
                          <SelectItem value="all">All Orders</SelectItem>
                          <SelectItem value="Order Placed">Order Placed</SelectItem>
                          <SelectItem value="Assigned">Assigned</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Payment Status Filter */}
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-600 mb-1">Payment Status</label>
                      <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                        <SelectTrigger className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#8300FF] focus:border-transparent bg-white min-w-[120px]">
                          <SelectValue placeholder="Filter by payment" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 rounded-md shadow-lg">
                          <SelectItem value="all">All Payments</SelectItem>
                          <SelectItem value="Not Paid">Not Paid</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex items-center gap-2">
                    {/* Clear Filters Button */}
                    {(statusFilter !== 'all' || paymentStatusFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setStatusFilter('all');
                          setPaymentStatusFilter('all');
                        }}
                        className="text-xs text-gray-600 hover:text-gray-800 underline"
                      >
                        Clear Filters
                      </button>
                    )}
                    
                    {/* Reset Filters Button */}
                    {(statusFilter !== 'all' || searchTerm) && (
                      <button
                        onClick={() => {
                          setStatusFilter('all');
                          setSearchTerm('');
                        }}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-white transition-colors flex items-center gap-1"
                        title="Clear all filters and search"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reset All
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <OrderData 
                orders={orders} 
                loading={loading} 
                onOrderSelect={handleOrderSelect}
                selectedOrder={selectedOrder}
                onStatusUpdate={updateOrderStatus}
                onPaymentStatusUpdate={updatePaymentStatus}
                onDeleteOrder={deleteOrder}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={closeOrderModal}
          onStatusUpdate={updateOrderStatus}
          onPaymentStatusUpdate={updatePaymentStatus}
        />
      )}
    </div>
  );
};

function OrderData({ orders, loading, onOrderSelect, selectedOrder, onStatusUpdate, onPaymentStatusUpdate, onDeleteOrder }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8300FF] mx-auto mb-4"></div>
          <div className="text-[#666] font-medium">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-[#666] font-medium">No orders found</div>
          <div className="text-[#999] text-sm mt-1">Orders will appear here when customers place them</div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full border-collapse min-w-[900px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-4 px-3 font-semibold text-gray-800 text-sm uppercase tracking-wider min-w-[120px]">
              Order ID
            </th>
            <th className="text-left py-4 px-3 font-semibold text-gray-800 text-sm uppercase tracking-wider min-w-[100px]">
              Date
            </th>
            <th className="text-left py-4 px-3 font-semibold text-gray-800 text-sm uppercase tracking-wider min-w-[150px]">
              Customer
            </th>
            <th className="text-left py-4 px-3 font-semibold text-gray-800 text-sm uppercase tracking-wider min-w-[100px]">
              Amount
            </th>
            <th className="text-left py-4 px-3 font-semibold text-gray-800 text-sm uppercase tracking-wider min-w-[130px]">
              Order Status
            </th>
            <th className="text-left py-4 px-3 font-semibold text-gray-800 text-sm uppercase tracking-wider min-w-[130px]">
              Payment Status
            </th>
            <th className="text-left py-4 px-3 font-semibold text-gray-800 text-sm uppercase tracking-wider min-w-[80px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-600">No orders found</p>
                  <p className="text-sm text-gray-400 mt-1">Orders will appear here when customers place them</p>
                </div>
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr 
                key={order._id}
                className="border-b border-gray-100 transition-colors duration-150 hover:bg-gray-50 cursor-pointer"
                onClick={() => onOrderSelect(order)}
                title="Click to view order details"
              >
                <td className="py-4 px-3">
                  <div className="font-medium text-[#8300FF] break-all">{order.orderNumber}</div>
                </td>
                <td className="py-4 px-3">
                  <div className="text-gray-600 text-sm">
                    {new Date(order.orderDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </td>
                <td className="py-4 px-3">
                  <div className="font-medium text-gray-900 truncate max-w-[150px]" title={order.customerName}>
                    {order.customerName}
                  </div>
                </td>
                <td className="py-4 px-3">
                  <div className="font-semibold text-green-600 text-base">₹{order.totalAmount.toFixed(0)}</div>
                </td>
                <td className="py-4 px-3">
                  <div onClick={(e) => e.stopPropagation()}>
                    <Select 
                      value={order.status} 
                      onValueChange={(newStatus) => onStatusUpdate(order._id, newStatus)}
                    >
                      <SelectTrigger 
                        className="w-[120px] h-8 text-xs border-gray-300 bg-white rounded-md hover:border-[#8300FF] focus:border-[#8300FF] focus:ring-1 focus:ring-[#8300FF]"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 rounded-md shadow-lg">
                        <SelectItem value="Order Placed">Order Placed</SelectItem>
                        <SelectItem value="Assigned">Assigned</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </td>
                <td className="py-4 px-3">
                  <div onClick={(e) => e.stopPropagation()}>
                    <Select 
                      value={order.paymentStatus || 'Not Paid'} 
                      onValueChange={(newPaymentStatus) => onPaymentStatusUpdate(order._id, newPaymentStatus)}
                    >
                      <SelectTrigger 
                        className="w-[110px] h-8 text-xs border-gray-300 bg-white rounded-md hover:border-[#8300FF] focus:border-[#8300FF] focus:ring-1 focus:ring-[#8300FF]"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 rounded-md shadow-lg">
                        <SelectItem value="Not Paid">Not Paid</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </td>
                <td className="py-4 px-3">
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOrderSelect(order);
                      }}
                      className="text-[#8300FF] hover:text-[#6b00cc] p-1.5 rounded-md border border-gray-300 hover:border-[#8300FF] transition-colors bg-white"
                      title="View Details"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteOrder(order._id);
                      }}
                      className="text-red-600 hover:text-red-800 p-1.5 rounded-md border border-gray-300 hover:border-red-600 transition-colors bg-white"
                      title="Delete Order"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// New Modal Component for Order Details
function OrderDetailsModal({ order, onClose, onStatusUpdate, onPaymentStatusUpdate }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Order Details
              </h2>
              <p className="text-sm text-gray-600">
                Order #{order.orderNumber} • {new Date(order.orderDate).toLocaleDateString('en-IN')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Share Button */}
              <button
                onClick={() => {
                  const orderDetailsText = `Order Details\n\nOrder ID: ${order.orderNumber}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nAmount: ₹${order.totalAmount.toFixed(0)}\nStatus: ${order.status}\nPayment: ${order.paymentStatus || 'Not Paid'}\nDate: ${new Date(order.orderDate).toLocaleDateString('en-IN')}\n\nView full details: ${window.location.origin}/order-details/${encodeURIComponent(order.orderNumber)}`;
                  
                  // Create a public shareable link that anyone can access
                  const publicOrderLink = `${window.location.origin}/order-details/${encodeURIComponent(order.orderNumber)}`;
                  
                  // Show options popup
                  const action = confirm("Choose sharing option:\n\nOK - Share order details text\nCancel - Copy public order link");
                  
                  if (action) {
                    // Share order details text
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
                  } else {
                    // Copy public order link
                    navigator.clipboard.writeText(publicOrderLink).then(() => {
                      alert('Public order link copied to clipboard!\n\nAnyone with this link can view the order details.');
                    }).catch(() => {
                      alert('Failed to copy link. Please try again.');
                    });
                  }
                }}
                className="text-[#8300FF] hover:text-[#6b00cc] transition-colors p-2 rounded-md border border-gray-300 hover:border-[#8300FF] bg-white"
                title="Share Order Details or Copy Public Link (accessible by anyone)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Customer Details */}
              <div className="border-b border-gray-100 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Name:</span>
                    <span className="text-gray-900">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="text-gray-900">{order.customerEmail || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Phone:</span>
                    <span className="text-gray-900">{order.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Address:</span>
                    <span className="text-gray-900 text-right max-w-[200px]">{order.deliveryAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Pincode:</span>
                    <span className="text-gray-900">{order.pincode}</span>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="border-b border-gray-100 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Order Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Order ID:</span>
                    <span className="text-[#8300FF] font-semibold">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Date:</span>
                    <span className="text-gray-900">{new Date(order.orderDate).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Order Placed' ? 'text-orange-700 bg-orange-100' :
                      order.status === 'Assigned' ? 'text-blue-700 bg-blue-100' :
                      order.status === 'Shipped' ? 'text-purple-700 bg-purple-100' :
                      order.status === 'Delivered' ? 'text-green-700 bg-green-100' :
                      order.status === 'Cancelled' ? 'text-red-700 bg-red-100' :
                      'text-gray-700 bg-gray-100'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Payment Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (order.paymentStatus || 'Not Paid') === 'Paid' ? 'text-green-700 bg-green-100' :
                      (order.paymentStatus || 'Not Paid') === 'Refunded' ? 'text-yellow-700 bg-yellow-100' :
                      'text-red-700 bg-red-100'
                    }`}>
                      {order.paymentStatus || 'Not Paid'}
                    </span>
                  </div>
                  {order.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Payment Method:</span>
                      <span className="text-gray-900">{order.paymentMethod}</span>
                    </div>
                  )}
                  {order.paymentDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Payment Date:</span>
                      <span className="text-gray-900">{new Date(order.paymentDate).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Update Status */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Update Order Status
                  </h3>
                  <Select 
                    value={order.status} 
                    onValueChange={(newStatus) => onStatusUpdate(order._id, newStatus)}
                  >
                    <SelectTrigger className="w-full border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 rounded-md shadow-lg">
                      <SelectItem value="Order Placed">Order Placed</SelectItem>
                      <SelectItem value="Assigned">Assigned</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Update Payment Status
                  </h3>
                  <Select 
                    value={order.paymentStatus || 'Not Paid'} 
                    onValueChange={(newPaymentStatus) => onPaymentStatusUpdate(order._id, newPaymentStatus)}
                  >
                    <SelectTrigger className="w-full border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 rounded-md shadow-lg">
                      <SelectItem value="Not Paid">Not Paid</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Items Ordered */}
              <div className="border-b border-gray-100 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
                  </svg>
                  Items Ordered
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {order.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-xs text-[#8300FF] font-medium mb-1">
                            ID: {item.productId || item.id || 'No ID'}
                          </p>
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.name}</h4>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>Qty: {item.quantity || 1}</p>
                            <p>Unit Price: ₹{parseFloat(item.price || 0).toFixed(0)}</p>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <p className="line-through text-gray-500">
                                Original: ₹{parseFloat(item.originalPrice).toFixed(0)}
                              </p>
                            )}
                            {item.customization && (
                              <p className="text-blue-600">
                                Custom: {JSON.stringify(item.customization)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
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
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#8300FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Order Summary
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal ({order.totalItems} items):</span>
                    <span className="font-medium text-gray-900">₹{order.subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Charges:</span>
                    <span className="font-medium text-gray-900">
                      {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge.toFixed(0)}`}
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 text-lg">Total Amount:</span>
                    <span className="font-bold text-[#8300FF] text-lg">₹{order.totalAmount.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
