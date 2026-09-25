/**
 * AI Pharma Developments — Payment Cloud Run worker
 * Creates Stripe Checkout Sessions + verifies webhooks.
 * Secrets via Secret Manager or env (names only in code).
 * Never commit live keys.
 */
const express = require('express');
const Stripe = require('stripe');

const app = express();
const PORT = process.env.PORT || 8080;

// Secret names (values injected at runtime)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY; // sk_test_... or sk_live_...
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET; // whsec_...
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://aipharmadevelopments.com,https://windsorroyalapps.github.io').split(',');

if (!STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY missing — sessions will fail until set');
}

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' }) : null;

// CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Stripe-Signature');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Health
app.get('/healthz', (_req, res) => res.json({ ok: true, service: 'apd-payment-worker' }));

// Create Checkout Session
app.post('/create-checkout-session', express.json(), async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe not configured' });

  const {
    amount_cents = 10000,
    currency = 'aud',
    description = 'AI Pharma Developments services',
    customer_email,
    success_url,
    cancel_url,
  } = req.body || {};

  if (!Number.isInteger(amount_cents) || amount_cents < 100) {
    return res.status(400).json({ error: 'amount_cents must be integer >= 100' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency,
          product_data: { name: description },
          unit_amount: amount_cents,
        },
        quantity: 1,
      }],
      customer_email: customer_email || undefined,
      success_url: success_url || 'https://aipharmadevelopments.com/pay.html?success=1',
      cancel_url: cancel_url || 'https://aipharmadevelopments.com/pay.html?canceled=1',
      metadata: {
        source: 'apd-website',
        description,
      },
    });

    // Optional: append-only ledger write here (Firestore / JSONL / BigQuery)
    console.log(JSON.stringify({
      event: 'session_created',
      id: session.id,
      amount_cents,
      currency,
      email: customer_email,
      ts: new Date().toISOString(),
    }));

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Webhook (raw body required)
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    return res.status(503).send('Webhook not configured');
  }

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Fulfillment / ledger / notify
    console.log(JSON.stringify({
      event: 'payment_completed',
      session_id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_email || session.customer_details?.email,
      payment_status: session.payment_status,
      ts: new Date().toISOString(),
    }));
    // TODO: write durable ledger, trigger Pub/Sub or Cloud Scheduler job, send receipt
  }

  res.json({ received: true });
});

app.listen(PORT, () => {
  console.log(`apd-payment-worker listening on ${PORT}`);
});
