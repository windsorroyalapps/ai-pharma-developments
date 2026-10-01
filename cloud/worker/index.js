/**
 * AI Pharma Developments — Payment Cloud Run worker
 * Creates Stripe Checkout Sessions + verifies webhooks.
 * Agent outbound orders require confirm=true.
 * Secrets via Secret Manager or env (names only in code).
 */
const express = require('express');
const Stripe = require('stripe');

const app = express();
const PORT = process.env.PORT || 8080;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://aipharmadevelopments.com,https://windsorroyalapps.github.io').split(',');

if (!STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY missing — sessions will fail until set');
}

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' }) : null;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Stripe-Signature');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/healthz', (_req, res) => res.json({
  ok: true,
  service: 'apd-payment-worker',
  stripe_configured: Boolean(STRIPE_SECRET_KEY),
  webhook_configured: Boolean(STRIPE_WEBHOOK_SECRET),
  intake: true,
}));

function ledger(event, payload) {
  console.log(JSON.stringify({ event, ts: new Date().toISOString(), ...payload }));
}

app.post('/create-checkout-session', express.json(), async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe not configured' });

  const {
    amount_cents = 10000,
    currency = 'aud',
    description = 'AI Pharma Developments services',
    customer_email,
    success_url,
    cancel_url,
    source = 'website',
    confirm,
  } = req.body || {};

  if (source === 'agent' && confirm !== true) {
    return res.status(403).json({ error: 'agent orders require confirm=true' });
  }

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
      metadata: { source, description },
    });

    ledger('session_created', {
      id: session.id,
      amount_cents,
      currency,
      email: customer_email,
      source,
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/intake', express.json({ limit: '32kb' }), (req, res) => {
  const { name, email, org, when, need } = req.body || {};
  if (!name || !email || !need) {
    return res.status(400).json({ error: 'name, email, and need are required' });
  }
  if (String(need).length > 4000) {
    return res.status(400).json({ error: 'need too long' });
  }
  ledger('consult_intake', {
    name: String(name).slice(0, 120),
    email: String(email).slice(0, 200),
    org: String(org || '').slice(0, 200),
    when: String(when || '').slice(0, 200),
    need: String(need).slice(0, 4000),
  });
  res.json({ ok: true, queued: true });
});

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
    const email = session.customer_email || session.customer_details?.email;
    let customerId = session.customer || null;
    try {
      if (!customerId && email) {
        const existing = await stripe.customers.list({ email, limit: 1 });
        customerId = existing.data[0]?.id || (await stripe.customers.create({
          email,
          metadata: { source: session.metadata?.source || 'website' },
        })).id;
      }
    } catch (err) {
      console.error('customer upsert failed', err.message);
    }
    ledger('payment_completed', {
      session_id: session.id,
      customer_id: customerId,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: email,
      payment_status: session.payment_status,
    });
  }

  res.json({ received: true });
});

app.listen(PORT, () => {
  console.log(`apd-payment-worker listening on ${PORT}`);
});
