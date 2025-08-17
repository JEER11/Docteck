const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { STRIPE_SECRET_KEY } = require('./stripeConfig');
const stripe = Stripe(STRIPE_SECRET_KEY);

// Save card/payment method for a user
router.post('/save-card', async (req, res) => {
  const { paymentMethodId, userId } = req.body;
  if (!paymentMethodId || !userId) return res.status(400).json({ error: 'Missing paymentMethodId or userId' });
  try {
    // 1. Create or fetch Stripe customer for this user (replace with your user DB logic)
    let customerId = null; // TODO: Look up in your DB
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { userId }
      });
      customerId = customer.id;
      // TODO: Save customerId in your DB for this user
    }
    // 2. Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    // 3. Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId }
    });
    res.json({ success: true, customerId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
