// Stripe configuration for frontend
// Require env; do not embed real keys in the repo or build
export const STRIPE_PUBLISHABLE_KEY = (process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '').trim();
export const hasStripeKey = Boolean(STRIPE_PUBLISHABLE_KEY);
