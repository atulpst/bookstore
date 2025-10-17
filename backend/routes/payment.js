// backend/routes/payment.js

const express = require('express');
const Razorpay = require('razorpay');
const crypto =require('crypto');
const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Route 1: Create a payment order
router.post('/order', async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100, // amount in the smallest currency unit (paise for INR)
        currency: 'INR',
        receipt: `receipt_order_${new Date().getTime()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        if (!order) return res.status(500).send('Error creating order');
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route 2: Verify the payment
router.post('/verify', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const secret = process.env.RAZORPAY_KEY_SECRET;

    // HMAC-SHA256 signature generation
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
        console.log('Payment is legitimate');
        // Here you would typically save the payment details to your database
        res.json({
            status: 'success',
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
        });
    } else {
        res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
    }
});

module.exports = router;