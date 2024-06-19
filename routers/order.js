const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createOrder, verifyPayment, getAllOrders, getOrderById } = require('../controllers/order');

router.post('/create', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verifyPayment);

// Get all orders for the logged-in user
router.get('/', authMiddleware, getAllOrders);

// Get a single order by ID for the logged-in user
router.get('/:orderId', authMiddleware, getOrderById);

module.exports = router;
