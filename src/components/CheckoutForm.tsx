// components/CheckoutForm.tsx
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
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cardElement = elements?.getElement(CardElement);

    try {
      if (!stripe || !cardElement || !firstName || !lastName || !address || !email) return;

      setIsProcessing(true);

      const { data } = await axios.post("/api/create-payment-intent", {
        data: {
          amount: amount.amount,
          firstName,
          lastName,
          email,
          address,
          city,
          postalCode,
          country
        },
      });
      const clientSecret = data;

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { 
          card: cardElement,
          billing_details: {
            name: `${firstName} ${lastName}`,
            email: email,
            address: {
              line1: address,
              city: city,
              postal_code: postalCode,
              country: country,
            }
          }
        },
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

  const isFormComplete = firstName && lastName && email && address && city && postalCode && country && 
                        (paymentMethod !== 'creditCard' || cardComplete);

  return (
    <div className={styles.payment_wrapper}>
      <div className={styles.payment_container}>
        <div className={styles.payment_header}>
          <div className={styles.logo}>
            <span className={styles.logo_icon}>💳</span>
            <span className={styles.logo_text}>Secure Payment</span>
          </div>
          <div className={styles.amount_display}>
            <span className={styles.amount_label}>Total Amount</span>
            <span className={styles.amount}>₹{amount.amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className={styles.payment_form}>
          <div className={styles.section}>
            <h3 className={styles.section_title}>Contact Information</h3>
            <div className={styles.form_grid}>
              <div className={styles.input_group}>
                <label className={styles.input_label}>First Name</label>
                <input
                  type="text"
                  className={styles.input_field}
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.input_group}>
                <label className={styles.input_label}>Last Name</label>
                <input
                  type="text"
                  className={styles.input_field}
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.input_group_full}>
                <label className={styles.input_label}>Email Address</label>
                <input
                  type="email"
                  className={styles.input_field}
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.section_title}>Billing Address</h3>
            <div className={styles.form_grid}>
              <div className={styles.input_group_full}>
                <label className={styles.input_label}>Street Address</label>
                <input
                  type="text"
                  className={styles.input_field}
                  placeholder="123 Main St"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className={styles.input_group}>
                <label className={styles.input_label}>City</label>
                <input
                  type="text"
                  className={styles.input_field}
                  placeholder="New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className={styles.input_group}>
                <label className={styles.input_label}>Postal Code</label>
                <input
                  type="text"
                  className={styles.input_field}
                  placeholder="10001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
              <div className={styles.input_group}>
                <label className={styles.input_label}>Country</label>
                <select
                  className={styles.select_field}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                >
                  <option value="United States">United States</option>
                  <option value="India">India</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.section_title}>Payment Method</h3>
            <div className={styles.payment_methods}>
              <div className={styles.method_tabs}>
                <button
                  type="button"
                  className={`${styles.method_tab} ${paymentMethod === 'creditCard' ? styles.active : ''}`}
                  onClick={() => setPaymentMethod('creditCard')}
                >
                  <span className={styles.tab_icon}>💳</span>
                  Credit Card
                </button>
                <button
                  type="button"
                  className={`${styles.method_tab} ${paymentMethod === 'paypal' ? styles.active : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <span className={styles.tab_icon}>🔵</span>
                  PayPal
                </button>
              </div>

              {paymentMethod === 'creditCard' && (
                <div className={styles.card_section}>
                  <div className={styles.input_group_full}>
                    <label className={styles.input_label}>Card Details</label>
                    <div className={styles.card_element_container}>
                      <CardElement 
                        className={styles.cardElement}
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#32325d',
                              '::placeholder': {
                                color: '#a0aec0',
                              },
                            },
                          },
                        }}
                        onChange={handleCardChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className={styles.paypal_section}>
                  <div className={styles.paypal_info}>
                    <p>You will be redirected to PayPal to complete your payment.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button 
            className={styles.pay_button} 
            type="submit" 
            disabled={isProcessing || !isFormComplete}
          >
            {isProcessing ? (
              <div className={styles.spinner}></div>
            ) : (
              `Pay ₹${amount.amount.toLocaleString('en-IN')}`
            )}
          </button>
        </form>

        <div className={styles.security_notice}>
          <div className={styles.lock_icon}>🔒</div>
          <span>Your payment details are securely encrypted</span>
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm;