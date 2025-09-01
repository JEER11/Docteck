import React, { useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "../lib/stripeConfig";
import { useLocation } from "react-router-dom";

// Only initialize Stripe on pages that actually need it (e.g., /billing)
// This avoids noisy console errors if an ad blocker blocks js.stripe.com on other pages.
export default function StripeProvider({ children }) {
  const { pathname } = useLocation();
  const needsStripe = pathname.startsWith("/billing");

  const stripePromise = useMemo(() => {
    if (!needsStripe) return null;
    try {
      if (!STRIPE_PUBLISHABLE_KEY) return null;
      return loadStripe(STRIPE_PUBLISHABLE_KEY);
    } catch (_) {
      return null;
    }
  }, [needsStripe]);

  if (!needsStripe || !stripePromise) return children;
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
