// backend/routes/payment.js
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto'); // Fixed typo here
const router = express.Router();

// 1. Setup Razorpay
// We check if the keys exist to help debug "500" errors
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
    console.error("CRITICAL ERROR: Razorpay Keys are MISSING in Render Environment!");
}

const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
});

// Route 1: Create Order
router.post('/order', async (req, res) => {
    try {
        const { amount } = req.body;
        
        // Validation: Ensure amount is valid
        if (!amount) {
            console.error("Payment Error: Amount is missing");
            return res.status(400).json({ message: "Amount is required" });
        }

        const options = {
            amount: amount * 100, // Convert to paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        // Create order
        const order = await razorpay.orders.create(options);
        
        // Success
        console.log("Order Created Successfully:", order.id);
        res.json(order);

    } catch (error) {
        // THIS IS THE IMPORTANT PART: Log the real error to Render
        console.error("RAZORPAY CRASH DETAILS:", error);
        res.status(500).send(error.message);
    }
});

// Route 2: Verify Payment
router.post('/verify', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
        console.log('Payment Verified Successfully');
        res.json({ status: 'success', orderId: razorpay_order_id, paymentId: razorpay_payment_id });
    } else {
        console.log('Payment Verification Failed');
        res.status(400).json({ status: 'failure' });
    }
});

module.exports = router;