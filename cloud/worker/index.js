/**
 * AI Pharma Developments — Payment Cloud Run worker
 * Creates Stripe Checkout Sessions + verifies webhooks.
 * Agent outbound orders require confirm=true.
 * Secrets via Secret Manager or env (names only in code).
 * Without STRIPE_SECRET_KEY, DRY_RUN sessions are returned (no charge).
 * subscription mode is a retainer preview until the operator confirms live.
 * Currency allowlist is AUD until multi-currency is explicitly enabled.
 */
const express = require('express');
const Stripe = require('stripe');
const crypto = require('crypto');
const { publishFulfillment } = require('./fulfillment');
const { append: appendLedger, summarizeDir } = require('./ledger');

const app = express();
const PORT = process.env.PORT || 8080;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://aipharmadevelopments.com,https://windsorroyalapps.github.io').split(',');
const FORCE_DRY = process.env.STRIPE_DRY_RUN === '1' || !STRIPE_SECRET_KEY;
const LIVE_OK = process.env.STRIPE_LIVE_OK === '1';
const ALLOWED_CURRENCIES = ['aud'];

if (!STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY missing — dry-run sessions only');
}
if (STRIPE_SECRET_KEY && STRIPE_SECRET_KEY.startsWith('sk_live_') && !LIVE_OK) {
  console.warn('Live secret present but STRIPE_LIVE_OK is not 1 — forcing dry-run');
}

const liveBlocked = Boolean(STRIPE_SECRET_KEY && STRIPE_SECRET_KEY.startsWith('sk_live_') && !LIVE_OK);
const stripe = STRIPE_SECRET_KEY && !FORCE_DRY && !liveBlocked
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
  : null;

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

function readiness() {
  const keyMode = !STRIPE_SECRET_KEY
    ? 'missing'
    : STRIPE_SECRET_KEY.startsWith('sk_test_')
      ? 'test'
      : STRIPE_SECRET_KEY.startsWith('sk_live_')
        ? 'live'
        : 'unknown';
  return {
    ok: true,
    service: 'apd-payment-worker',
    stripe_configured: Boolean(STRIPE_SECRET_KEY),
    stripe_key_mode: keyMode,
    webhook_configured: Boolean(STRIPE_WEBHOOK_SECRET),
    dry_run: !stripe,
    live_charges: false,
    confirm_gate: true,
    currencies: ALLOWED_CURRENCIES,
    intake: true,
    subscription_preview: true,
    fulfillment_topic: process.env.FULFILLMENT_TOPIC || null,
    blockers: [
      !STRIPE_SECRET_KEY ? 'stripe_test_key_missing' : null,
      !STRIPE_WEBHOOK_SECRET ? 'stripe_webhook_secret_missing' : null,
      liveBlocked ? 'live_key_blocked' : null,
    ].filter(Boolean),
  };
}

app.get('/healthz', (_req, res) => res.json(readiness()));
app.get('/ready', (_req, res) => res.json(readiness()));

function ledger(event, payload) {
  return appendLedger(event, payload);
}

app.get('/ledger/summary', (_req, res) => {
  res.json(summarizeDir());
});

app.post('/dry-run/settle', express.json(), (req, res) => {
  if (stripe) return res.status(409).json({ error: 'settle endpoint is dry-run only' });
  const sessionId = String(req.body?.session_id || '').slice(0, 80);
  if (!sessionId) return res.status(400).json({ error: 'session_id required' });
  const row = ledger('dry_run_settled', { session_id: sessionId, note: 'local settle only' });
  res.json({ ok: true, charged: false, row });
});

function rejectEmbeddedSecrets(body) {
  const blob = JSON.stringify(body || {});
  if (/sk_(live|test)_|pk_live_|whsec_/.test(blob)) {
    return { error: 'do not send secrets in the request body', status: 400 };
  }
  return null;
}

function validateOrder(body) {
  const secretErr = rejectEmbeddedSecrets(body);
  if (secretErr) return secretErr;

  const {
    amount_cents = 10000,
    currency = 'aud',
    description = 'AI Pharma Developments services',
    customer_email,
    source = 'website',
    confirm,
    mode = 'payment',
    sku,
  } = body || {};

  if (source === 'agent' && confirm !== true) {
    return { error: 'agent orders require confirm=true', status: 403 };
  }
  if (!Number.isInteger(amount_cents) || amount_cents < 100) {
    return { error: 'amount_cents must be integer >= 100', status: 400 };
  }
  const normalized = String(currency || '').toLowerCase();
  if (!ALLOWED_CURRENCIES.includes(normalized)) {
    return { error: 'currency must be aud until multi-currency is enabled', status: 400 };
  }
  const checkoutMode = mode === 'subscription' || mode === 'subscription_preview' ? 'subscription' : 'payment';
  return { amount_cents, currency: normalized, description, customer_email, source, confirm, mode: checkoutMode, sku };
}

app.post('/create-checkout-session', express.json(), async (req, res) => {
  const order = validateOrder(req.body);
  if (order.error) return res.status(order.status).json({ error: order.error });

  const success_url = req.body?.success_url || 'https://aipharmadevelopments.com/pay.html?success=1';
  const cancel_url = req.body?.cancel_url || 'https://aipharmadevelopments.com/pay.html?canceled=1';

  if (!stripe) {
    const id = 'cs_dry_' + crypto.randomBytes(8).toString('hex');
    ledger('dry_run_session', {
      id,
      amount_cents: order.amount_cents,
      currency: order.currency,
      email: order.customer_email,
      source: order.source,
      mode: order.mode,
      sku: order.sku || null,
    });
    return res.json({
      id,
      url: success_url + (success_url.includes('?') ? '&' : '?') + 'dry_run=1&session=' + id,
      dry_run: true,
      mode: order.mode,
    });
  }

  try {
    const price_data = {
      currency: order.currency,
      product_data: { name: order.description },
      unit_amount: order.amount_cents,
    };
    if (order.mode === 'subscription') {
      price_data.recurring = { interval: 'month' };
    }
    const session = await stripe.checkout.sessions.create({
      mode: order.mode,
      payment_method_types: ['card'],
      line_items: [{ price_data, quantity: 1 }],
      customer_email: order.customer_email || undefined,
      success_url,
      cancel_url,
      metadata: { source: order.source, description: order.description, sku: order.sku || '', mode: order.mode },
    });

    ledger('session_created', {
      id: session.id,
      amount_cents: order.amount_cents,
      currency: order.currency,
      email: order.customer_email,
      source: order.source,
      mode: order.mode,
    });

    res.json({ id: session.id, url: session.url, dry_run: false, mode: order.mode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/agent-order', express.json(), (req, res) => {
  if (req.body?.confirm !== true) {
    return res.status(403).json({ error: 'agent orders require confirm=true' });
  }
  const order = validateOrder({ ...req.body, source: 'agent', confirm: true });
  if (order.error) return res.status(order.status).json({ error: order.error });
  const id = 'ord_' + crypto.randomBytes(6).toString('hex');
  ledger('agent_order_queued', { id, amount_cents: order.amount_cents, currency: order.currency, source: order.source, mode: order.mode, charged: false });
  res.json({ ok: true, id, charged: false, note: 'queued only; no live charge' });
});

app.post('/intake', express.json({ limit: '32kb' }), (req, res) => {
  const secretErr = rejectEmbeddedSecrets(req.body);
  if (secretErr) return res.status(secretErr.status).json({ error: secretErr.error });
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
    const payload = {
      session_id: session.id,
      customer_id: customerId,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: email,
      payment_status: session.payment_status,
      source: session.metadata?.source || 'website',
      mode: session.mode,
      dry_run: false,
    };
    ledger('payment_completed', payload);
    try {
      const published = await publishFulfillment(payload);
      ledger('fulfillment_publish', published);
    } catch (err) {
      console.error('fulfillment publish error', err.message);
    }
  }

  res.json({ received: true });
});

app.listen(PORT, () => {
  console.log(`apd-payment-worker listening on ${PORT} dry_run=${!stripe}`);
});
