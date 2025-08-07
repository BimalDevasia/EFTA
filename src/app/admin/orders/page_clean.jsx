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
import { FilterIcon, SearchIcon, EyeIcon, ClockIcon, TruckIcon, CheckIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
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

  return (
    <div className="h-screen min-h-screen grid grid-cols-[auto_400px]">
      <div className="pt-40 pb-4 px-6 space-y-10 flex flex-col overflow-hidden h-full border-r border-gray-200">
        <div className="flex items-center justify-between shrink-0">
          <h1 className="text-[36px] text-[#8300FF] font-bold">Orders</h1>
          <div className="flex items-center gap-4">
            <div className="border border-slate-800 rounded-[100vmin] flex items-center">
              <div className="px-2">
                <SearchIcon className="w-4 h-4" />
              </div>
              <input
                className="rounded-[100vmin] py-2 pl-2 pr-4"
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <FilterIcon className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="Order Placed">Order Placed</SelectItem>
                <SelectItem value="Assigned">Assigned</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <OrderData 
          orders={orders} 
          loading={loading} 
          onOrderSelect={setSelectedOrder}
          selectedOrder={selectedOrder}
          onStatusUpdate={updateOrderStatus}
        />
      </div>
      <div className="pt-40 space-y-6 h-full overflow-auto px-6">
        <OrderDetails 
          order={selectedOrder} 
          onStatusUpdate={updateOrderStatus}
        />
      </div>
    </div>
  );
};

function OrderData({ orders, loading, onOrderSelect, selectedOrder, onStatusUpdate }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No orders found</div>
      </div>
    );
  }

  return (
    <Table className="flex-1">
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow 
            key={order._id}
            className={`cursor-pointer hover:bg-gray-50 ${
              selectedOrder?._id === order._id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onOrderSelect(order)}
          >
            <TableCell className="font-medium">{order.orderNumber}</TableCell>
            <TableCell>
              {new Date(order.orderDate).toLocaleDateString('en-IN')}
            </TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'Order Placed' ? 'text-orange-600 bg-orange-50' :
                  order.status === 'Assigned' ? 'text-blue-600 bg-blue-50' :
                  order.status === 'Shipped' ? 'text-purple-600 bg-purple-50' :
                  order.status === 'Delivered' ? 'text-green-600 bg-green-50' :
                  order.status === 'Cancelled' ? 'text-red-600 bg-red-50' :
                  'text-gray-600 bg-gray-50'
                }`}>
                  {order.status}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Select 
                value={order.status} 
                onValueChange={(newStatus) => onStatusUpdate(order._id, newStatus)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Order Placed">Order Placed</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function OrderDetails({ order, onStatusUpdate }) {
  if (!order) {
    return (
      <div className="space-y-4">
        <h3 className="text-[#10011F] text-[22px] font-medium">
          Order Details
        </h3>
        <div className="text-gray-500 text-center py-8">
          Select an order to view details
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-[#10011F] text-[22px] font-medium">
          Customer Details
        </h3>
        <div className="space-y-2 text-sm">
          <p><strong>Name:</strong> {order.customerName}</p>
          <p><strong>Email:</strong> {order.customerEmail || 'Not provided'}</p>
          <p><strong>Phone:</strong> {order.customerPhone}</p>
          <p><strong>Address:</strong> {order.deliveryAddress}</p>
          <p><strong>Pincode:</strong> {order.pincode}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[#10011F] text-[22px] font-medium">
          Order Information
        </h3>
        <div className="space-y-2 text-sm">
          <p><strong>Order ID:</strong> {order.orderNumber}</p>
          <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString('en-IN')}</p>
          <p><strong>Status:</strong> 
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
              order.status === 'Order Placed' ? 'text-orange-600 bg-orange-50' :
              order.status === 'Assigned' ? 'text-blue-600 bg-blue-50' :
              order.status === 'Shipped' ? 'text-purple-600 bg-purple-50' :
              order.status === 'Delivered' ? 'text-green-600 bg-green-50' :
              order.status === 'Cancelled' ? 'text-red-600 bg-red-50' :
              'text-gray-600 bg-gray-50'
            }`}>
              {order.status}
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[#10011F] text-[22px] font-medium">
          Items Ordered
        </h3>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-gray-600 text-xs mt-1">{item.description}</p>
                  {item.customization && (
                    <p className="text-blue-600 text-xs mt-1">
                      Custom: {JSON.stringify(item.customization)}
                    </p>
                  )}
                </div>
                <div className="text-right text-sm">
                  <p>Qty: {item.quantity}</p>
                  <p>₹{item.price} each</p>
                  <p className="font-medium">₹{item.total}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[#10011F] text-[22px] font-medium">
          Order Summary
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal ({order.totalItems} items):</span>
            <span>₹{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charges:</span>
            <span>₹{order.deliveryCharge.toFixed(2)}</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold">
            <span>Total Amount:</span>
            <span>₹{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[#10011F] text-[22px] font-medium">
          Update Status
        </h3>
        <Select 
          value={order.status} 
          onValueChange={(newStatus) => onStatusUpdate(order._id, newStatus)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="Order Placed">Order Placed</SelectItem>
            <SelectItem value="Assigned">Assigned</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default OrderPage;
