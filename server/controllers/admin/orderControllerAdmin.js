const Order = require("../../models/Order");

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Populate user details if you have user reference
    const ordersDetail = await Order.findById(id)
      .populate('userId', 'name email') // Adjust fields as per your User model
      .lean(); // Use lean() for better performance
      
    if (!ordersDetail) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: ordersDetail,
    });
  } catch (error) {
    console.error("Error in getOrderDetailsForAdmin:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
    });
  }
};

const getAllOrdersOfAllUser = async (req, res) => {
  try {
    // Add pagination and sorting for better performance
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Get orders with pagination and populate user details
    const orders = await Order.find({})
      .populate('userId', 'name email') // Adjust fields as per your User model
      .sort({ orderDate: -1, createdAt: -1 }) // Sort by most recent first
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const totalOrders = await Order.countDocuments({});
    
    console.log(`Found ${orders.length} orders out of ${totalOrders} total orders`);
    
    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders found",
        orders: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalOrders: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }
    
    res.status(200).json({
      success: true,
      orders: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders: totalOrders,
        hasNextPage: page * limit < totalOrders,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error in getAllOrdersOfAllUser:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'rejected'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { 
        orderStatus,
        updatedAt: new Date() // Add timestamp for when status was updated
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    console.log(`Order ${id} status updated to: ${orderStatus}`);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status"
    });
  }
};

// Add a debug function to check all orders
const debugAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find({}).lean();
    const paidOrders = await Order.find({ paymentStatus: "paid" }).lean();
    const processingOrders = await Order.find({ orderStatus: "processing" }).lean();
    
    console.log("=== ORDER DEBUG INFO ===");
    console.log(`Total orders in DB: ${allOrders.length}`);
    console.log(`Paid orders: ${paidOrders.length}`);
    console.log(`Processing orders: ${processingOrders.length}`);
    
    // Log recent orders
    const recentOrders = allOrders.slice(0, 5);
    console.log("Recent orders:", recentOrders.map(order => ({
      id: order._id,
      status: order.orderStatus,
      paymentStatus: order.paymentStatus,
      userId: order.userId,
      createdAt: order.createdAt || order.orderDate
    })));
    
    res.status(200).json({
      success: true,
      debug: {
        totalOrders: allOrders.length,
        paidOrders: paidOrders.length,
        processingOrders: processingOrders.length,
        recentOrders: recentOrders
      }
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({
      success: false,
      message: "Debug failed"
    });
  }
};

module.exports = {
  getAllOrdersOfAllUser,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  debugAllOrders, // Add this for debugging
};