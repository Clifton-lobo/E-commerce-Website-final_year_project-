// utils/Razorpay.js
const Razorpay = require('razorpay');
require('dotenv').config();

// Debug output
console.log('Razorpay Key:', process.env.RAZORPAY_KEY_ID ? 'Found' : 'Missing');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID.trim(),
  key_secret: process.env.RAZORPAY_SECRET.trim()
});

// Verify initialization
if (!razorpayInstance || !razorpayInstance.orders) {
  console.error('Razorpay failed to initialize!');
} else {
  console.log('Razorpay initialized successfully');
}

module.exports = { razorpayInstance };