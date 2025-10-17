// frontend/src/components/Book.js

import React from 'react';
import axios from 'axios';

const Book = ({ book }) => {

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };
    
    const handlePayment = async () => {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            const orderResponse = await axios.post('http://localhost:5001/api/payment/order', {
                amount: book.price,
            });
            const order = orderResponse.data;

            const options = {
                key: "rzp_test_RUSPpyS3EzFCI2", // <<< IMPORTANT: PASTE YOUR KEY ID HERE
                amount: order.amount,
                currency: order.currency,
                name: "Gemini Bookstore",
                description: `Payment for ${book.title}`,
                order_id: order.id,
                handler: async function (response) {
                    const verificationData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    };
                    
                    const verificationResponse = await axios.post('http://localhost:5001/api/payment/verify', verificationData);
                    
                    if(verificationResponse.data.status === 'success') {
                        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                    } else {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: "Test User",
                    email: "test.user@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Payment error:", error);
            alert('An error occurred during payment.');
        }
    };

    return (
        <div className="book-card">
            <h3>{book.title}</h3>
            <p>by {book.author}</p>
            <p className="book-price">₹{book.price}</p>
            <button className="buy-button" onClick={handlePayment}>
                Buy Now (UPI/Cards)
            </button>
        </div>
    );
};

export default Book;