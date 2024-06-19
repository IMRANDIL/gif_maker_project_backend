const Order = require('../models/order');

exports.createOrder = async (req, res) => {
    const { amount, currency, receipt } = req.body;
    try {
        const newOrder = new Order({
            user: req.user._id, // User ID from auth middleware
            amount,
            currency,
            receipt,
            status: 'created' // Default status
        });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: 'Error creating order', error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('user', 'name email');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id }).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};
