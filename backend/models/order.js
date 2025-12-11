const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true }, // Razorpay Order ID
  paymentId: { type: String, required: true }, // Razorpay Payment ID
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  // You can add more fields later like 'customerName' or 'bookTitle'
});

module.exports = mongoose.model('Order', orderSchema);