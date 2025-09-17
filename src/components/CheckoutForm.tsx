"use client";

import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useRouter } from 'next/navigation';
import styles from './CheckoutForm.module.css';

function CheckoutForm(amount: any) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [isProcessing, setIsProcessing] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cardElement = elements?.getElement(CardElement);

    try {
      if (!stripe || !cardElement || !firstName || !lastName || !address) return;

      setIsProcessing(true);

      const { data } = await axios.post("/api/create-payment-intent", {
        data: {
          amount: amount.amount,
          firstName,
          lastName,
          address
        },
      });
      const clientSecret = data;

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (paymentResult.error) {
        console.error(paymentResult.error.message);
        alert('Payment failed. Please try again.');
        setIsProcessing(false);
      } else if (paymentResult.paymentIntent?.status === 'succeeded') {
        alert('Payment is successful');
        router.push('/');  // Redirect to home page
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('An error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.payment_container}>
      <h2 className={styles.heading}>Complete Your Payment</h2>
      <form onSubmit={onSubmit}>
        <div className={styles.form_group}>
          <input
            type="text"
            className={styles.input_field}
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            className={styles.input_field}
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="text"
            className={styles.input_field}
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <h3 className={styles.payment_heading}>Choose Payment Method</h3>
        <div className={styles.payment_options}>
          <label className={styles.payment_option}>
            <input
              type="radio"
              name="paymentMethod"
              value="creditCard"
              checked={paymentMethod === 'creditCard'}
              onChange={() => setPaymentMethod('creditCard')}
            />
            Credit Card
          </label>
          <label className={styles.payment_option}>
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'creditCard'}
              onChange={() => setPaymentMethod('creditCard')}
            />
            PayPal
          </label>
        </div>

        {paymentMethod === 'creditCard' && firstName && lastName && address && (
  <div className={styles.card_details}>
    <CardElement className={styles.cardElement} />
  </div>
)}


        <button className={styles.confirm_button} type="submit" disabled={isProcessing || !firstName || !lastName || !address}>
          {isProcessing ? 'Processing...' : 'Confirm Payment'}
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;
