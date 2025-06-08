const express = require("express");
const router = express.Router();

const {
  getAllOrdersOfAllUser,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/orderControllerAdmin");

router.get("/getOrders", getAllOrdersOfAllUser);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
