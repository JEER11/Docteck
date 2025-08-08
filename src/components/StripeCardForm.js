import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function StripeCardForm({ onToken }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setError(null);
      onToken(paymentMethod.id); // Send to backend
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit" disabled={!stripe || loading} style={{ marginTop: 16 }}>
        {loading ? "Processing..." : "Add Card"}
      </button>
    </form>
  );
}
