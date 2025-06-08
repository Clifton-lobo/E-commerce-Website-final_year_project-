const Order = require('../../models/Order');
const { razorpayInstance } = require('../../utils/Razorpay');
require('dotenv').config();
const crypto = require("crypto");

const createOrder = async (req, res) => {
    try {
      const { totalAmount, cartItems, addressInfo, userId } = req.body;
  
      // Validate required fields
      if (!totalAmount || isNaN(totalAmount)) {
        return res.status(400).json({
          success: false,
          message: "Invalid amount"
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required"
        });
      }
  
      // Create Razorpay order
      const order = await razorpayInstance.orders.create({
        amount: totalAmount * 100, // Convert to paise
        currency: "INR",
        receipt: `order_${Date.now()}`,
      });
  
      // Create database record with all necessary fields
      const newOrder = new Order({
        userId,
        cartItems: cartItems || [],
        addressInfo: addressInfo || {},
        totalAmount,
        orderStatus: "pending",
        paymentMethod: "razorpay",
        paymentStatus: "pending",
        razorpayOrderId: order.id,
        orderDate: new Date(),
        createdAt: new Date()
      });
  
      const savedOrder = await newOrder.save();
      
      console.log("Order created successfully:", {
        orderId: savedOrder._id,
        razorpayOrderId: order.id,
        userId: userId,
        amount: totalAmount
      });
  
      res.status(200).json({
        success: true,
        razorpayOrderId: order.id,
        orderAmount: order.amount,
        currency: order.currency,
        internalOrderId: savedOrder._id
      });
  
    } catch (err) {
      console.error("Order creation error:", err);
      res.status(500).json({
        success: false,
        message: err.error?.description || "Order creation failed",
        error: err.message
      });
    }
};

const verifyPayment = async (req, res) => {
    try {
      const { paymentId, orderId, signature, userId } = req.body;
  
      // Validate required fields
      if (!paymentId || !orderId || !signature || !userId) {
        return res.status(400).json({
          success: false,
          message: "Missing required verification data"
        });
      }
  
      // Generate expected signature
      const secret = process.env.RAZORPAY_SECRET;
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
  
      // Verify signature
      if (generatedSignature !== signature) {
        console.error('Signature mismatch:', {
          received: signature,
          generated: generatedSignature,
          orderId,
          paymentId
        });
        return res.status(400).json({
          success: false,
          message: "Invalid signature"
        });
      }
  
      console.log("Payment verification successful for order:", orderId);
  
      // Update order status
      const updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId: orderId, userId },
        {
          paymentStatus: "paid",
          orderStatus: "processing", // Change to processing after payment
          paymentId,
          signature,
          paymentDate: new Date(),
          updatedAt: new Date()
        },
        { new: true }
      );
  
      if (!updatedOrder) {
        console.error("Order not found for verification:", { orderId, userId });
        return res.status(404).json({
          success: false,
          message: "Order not found for this user"
        });
      }

      console.log("Order updated successfully after payment:", {
        orderId: updatedOrder._id,
        paymentStatus: updatedOrder.paymentStatus,
        orderStatus: updatedOrder.orderStatus,
        userId: updatedOrder.userId
      });
  
      return res.json({
        success: true,
        order: updatedOrder
      });
  
    } catch (err) {
      console.error("Payment verification error:", err);
      return res.status(500).json({
        success: false,
        message: "Payment verification failed"
      });
    }
};

const getAllOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const orders = await Order.find({ userId })
          .sort({ orderDate: -1, createdAt: -1 })
          .lean();

        console.log(`Found ${orders.length} orders for user ${userId}`);

        res.status(200).json({
            success: true,
            orders: orders,
        });
    } catch (error) {
        console.error("Error in getAllOrdersByUser:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const orderDetails = await Order.findById(id).lean();
        if (!orderDetails) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            data: orderDetails,
        });
    } catch (error) {
        console.error("Error in getOrderDetails:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch order details",
        });
    }
};

module.exports = { 
    verifyPayment, 
    createOrder,
    getAllOrdersByUser,
    getOrderDetails 
};