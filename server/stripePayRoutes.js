const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { STRIPE_SECRET_KEY } = require('./stripeConfig');
const stripe = Stripe(STRIPE_SECRET_KEY);

// POST /api/stripe/pay
// { amount, customerId, paymentMethodId, description }
router.post('/pay', async (req, res) => {
  const { amount, customerId, paymentMethodId, description } = req.body;
  if (!amount || !customerId || !paymentMethodId) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents
      currency: 'usd',
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      description: description || 'Medical Payment',
    });
    res.json({ success: true, paymentIntent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
