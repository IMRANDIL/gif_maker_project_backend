// Start Generation Here
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    receipt: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'created', // created, pending, failed, completed
        enum: ['created', 'pending', 'failed', 'completed']
    },
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
