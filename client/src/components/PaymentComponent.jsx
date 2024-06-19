import React, { useEffect, useState } from 'react';

const PaymentComponent = () => {
  const token= localStorage.getItem('token');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('Razorpay SDK loaded');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    const data = { amount: 500 }; // Amount should be in the smallest currency unit (paise)
    try {
      const response = await fetch('http://localhost:3001/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const order = await response.json();

      if (response.ok) {
        const options = {
          key:  'rzp_test_vW0m35RVGr6OZO', // Use environment variable for the key
          amount: order.amount,
          currency: order.currency,
          name: "GiphyMania",
          description: "One time payment to use this application",
          order_id: order.razorpayOrder.id,
          handler: async function (response) {
            console.log(response);
            alert('Payment Successful');
            localStorage.setItem('paymentCompleted', 'true');
            try {
              const verificationResponse = await fetch('http://localhost:3001/api/orders/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });
              if (!verificationResponse.ok) throw new Error('Payment verification failed');
              localStorage.setItem('paymentVerified', 'true');
              window.location.href = '/';
            } catch (error) {
              console.error('Verification Error:', error);
              alert('Payment verification failed');
            }
          },
          prefill: {
            name: order.user.name,
            email: order.user.email,
            contact: order.user.contact
          },
          theme: {
            color: "#F37254"
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Payment failed');
    }
  };
  return (
    <div>
      <button onClick={handlePayment}>Pay with Razorpay</button>
    </div>
  );
};

export default PaymentComponent;



