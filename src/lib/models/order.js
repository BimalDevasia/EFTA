import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  id: { type: String, required: true }, // MongoDB _id
  productId: { type: String }, // Custom admin-created product ID
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
  image: { type: String },
  customization: { type: mongoose.Schema.Types.Mixed }, // For any custom data
  offerPercentage: { type: Number, default: 0 }
});

const OrderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true
  },
  customerName: { 
    type: String, 
    required: true 
  },
  customerEmail: { 
    type: String 
  },
  customerPhone: { 
    type: String, 
    required: true 
  },
  deliveryAddress: { 
    type: String, 
    required: true 
  },
  pincode: { 
    type: String, 
    required: true 
  },
  items: [OrderItemSchema],
  totalItems: { 
    type: Number, 
    required: true 
  },
  subtotal: { 
    type: Number, 
    required: true 
  },
  deliveryCharge: { 
    type: Number, 
    default: 0 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    enum: ['Order Placed', 'Assigned', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Order Placed'
  },
  paymentStatus: {
    type: String,
    enum: ['Not Paid', 'Paid', 'Refunded'],
    default: 'Not Paid'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Online Payment', 'Bank Transfer', 'UPI'],
    default: 'Cash on Delivery'
  },
  paymentDate: {
    type: Date
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  whatsappSent: { 
    type: Boolean, 
    default: false 
  },
  notes: { 
    type: String 
  }
}, {
  timestamps: true
});

// Add indexes for better performance
OrderSchema.index({ customerPhone: 1 });
OrderSchema.index({ orderDate: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
