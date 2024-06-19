const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createOrder, getAllOrders, getOrderById } = require('../controllers/order');

// Create a new order
router.post('/', authMiddleware, createOrder);

// Get all orders for the logged-in user
router.get('/', authMiddleware, getAllOrders);

// Get a single order by ID for the logged-in user
router.get('/:orderId', authMiddleware, getOrderById);

module.exports = router;
