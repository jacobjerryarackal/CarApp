"use client";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import CheckoutForm from '@/components/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentPage() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={parseFloat(amount!)} />
    </Elements>
  );
}

export default PaymentPage;
