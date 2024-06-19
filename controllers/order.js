const Razorpay = require('../config/razorpay');
const Order = require('../models/order');
const User = require('../models/user');
const crypto = require('crypto');


exports.createOrder = async (req, res) => {
  const { amount } = req.body;
  const receipt = `receipt_${new Date().getTime()}`;

  const options = {
    amount: amount * 100, // Razorpay expects the amount in the smallest currency unit (paise)
    currency: "INR",
    receipt
  };

  try {
    const razorpayOrder = await Razorpay.orders.create(options);
    const order = new Order({
      user: req.user._id, // Assuming req.user is populated from the auth middleware
      amount,
      currency: "INR", // Added currency to match the Order model's schema
      receipt,
      status: 'created', // Default status as per the Order model's schema
      razorpay: {
        orderId: razorpayOrder.id
      }
    });

    await order.save();

    // Fetch user details from the database
    const user = await User.findById(req.user._id).select('-password'); // Assuming User model is imported

    res.status(201).json({ success: true, order, razorpayOrder, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};




exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  // Retrieve the order using the Razorpay order ID
  const order = await Order.findOne({ "razorpay.orderId": razorpay_order_id });

  // Check if the order exists
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Generate the signature to verify from the order ID and payment ID
  const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                                    .digest('hex');

  // Compare the generated signature with the provided signature
  if (generatedSignature === razorpay_signature) {
    // Update the order with the payment ID and signature
    order.razorpay.paymentId = razorpay_payment_id;
    order.razorpay.signature = razorpay_signature;
    order.status = 'completed'; // Mark the order as completed
    await order.save();

    // Respond with success message
    res.json({ message: "Payment verified successfully", order });
  } else {
    // Respond with error if signatures do not match
    res.status(400).json({ message: "Invalid signature sent" });
  }
};

// exports.createOrder = async (req, res) => {
//     const { amount, currency, receipt } = req.body;
//     try {
//         const newOrder = new Order({
//             user: req.user._id, // User ID from auth middleware
//             amount,
//             currency,
//             receipt,
//             status: 'created' // Default status
//         });
//         await newOrder.save();
//         res.status(201).json(newOrder);
//     } catch (error) {
//         res.status(400).json({ message: 'Error creating order', error: error.message });
//     }
// };

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
