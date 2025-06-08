const express = require('express');
const router =express.Router();

const { createOrder,verifyPayment,getAllOrdersByUser,getOrderDetails } =
 require('../../controllers/User/OrdersController');

router.post('/create',createOrder)
router.post('/verify',verifyPayment)
router.get('/list/:userId',getAllOrdersByUser)
router.get('/details/:id',getOrderDetails)

module.exports = router; 