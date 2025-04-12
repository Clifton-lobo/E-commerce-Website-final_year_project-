const express = require('express');
const { createOrder } = require('../../controllers/User/OrdersController');

const router =express.Router();

router.post('/create',createOrder)

module.exports = router; 