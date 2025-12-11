const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config(); // Ensures .env is loaded for this file

const router = express.Router();

// 1. Setup Razorpay
// We check if the keys exist to help debug "500" errors
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

// Safety check for keys
if (!keyId || !keySecret) {
    console.error("CRITICAL ERROR: Razorpay Keys are MISSING in Environment Variables!");
}

const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
});

// Route 1: Create Order
router.post('/order', async (req, res) => {
    try {
        const { amount } = req.body;
        
        // Validation: Ensure amount is valid and greater than 0
        if (!amount || amount <= 0) {
            console.error("Payment Error: Invalid Amount");
            return res.status(400).json({ message: "Amount is required and must be greater than 0" });
        }

        const options = {
            amount: amount * 100, // Razorpay works in paise (1 INR = 100 paise)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        // Create order
        const order = await razorpay.orders.create(options);
        
        // Success
        console.log("Order Created Successfully:", order.id);
        res.json(order);

    } catch (error) {
        // Log the real error to the console for debugging
        console.error("RAZORPAY CRASH DETAILS:", error);
        res.status(500).send(error.message);
    }
});

// Route 2: Verify Payment
router.post('/verify', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Create HMAC SHA256 signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    // Compare digest with signature
    if (digest === razorpay_signature) {
        console.log('Payment Verified Successfully');
        
        // TODO: Here is where you would usually save the order to your Database (MongoDB)
        // const saveOrder = await Order.create({ ... })

        res.json({ 
            status: 'success', 
            orderId: razorpay_order_id, 
            paymentId: razorpay_payment_id 
        });
    } else {
        console.log('Payment Verification Failed');
        res.status(400).json({ status: 'failure' });
    }
});

module.exports = router;