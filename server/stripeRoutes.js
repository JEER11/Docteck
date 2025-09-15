const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');
const { STRIPE_SECRET_KEY } = require('./stripeConfig');
const stripe = Stripe(STRIPE_SECRET_KEY);

// Simple JSON store for mapping userId -> Stripe customerId (dev-only persistence)
const storePath = path.join(__dirname, 'uploads', 'stripe-customers.json');
function ensureStore() {
  const dir = path.dirname(storePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(storePath)) fs.writeFileSync(storePath, JSON.stringify({}, null, 2));
}
function readStore() {
  try { ensureStore(); return JSON.parse(fs.readFileSync(storePath, 'utf-8')); } catch { return {}; }
}
function writeStore(obj) { try { ensureStore(); fs.writeFileSync(storePath, JSON.stringify(obj, null, 2)); } catch(_) {} }

// Save card/payment method for a user
router.post('/save-card', async (req, res) => {
  const { paymentMethodId, userId } = req.body;
  if (!paymentMethodId || !userId) return res.status(400).json({ error: 'Missing paymentMethodId or userId' });
  try {
    // 1. Create or fetch Stripe customer for this user
    const store = readStore();
    let customerId = store[userId];
    if (!customerId) {
      const customer = await stripe.customers.create({ metadata: { userId } });
      customerId = customer.id;
      store[userId] = customerId;
      writeStore(store);
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

// Detach a payment method from Stripe customer (and optionally unset default)
router.post('/delete-card', async (req, res) => {
  const { paymentMethodId } = req.body;
  if (!paymentMethodId) return res.status(400).json({ error: 'Missing paymentMethodId' });
  try {
    await stripe.paymentMethods.detach(paymentMethodId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
