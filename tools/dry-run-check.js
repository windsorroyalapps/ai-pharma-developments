#!/usr/bin/env node
/**
 * Local contract check for payment automation. No Stripe, no GCP.
 * Agent orders must refuse unless confirm===true and must never charge.
 */
const assert = require('assert');

function validateOrder(body) {
  const blob = JSON.stringify(body || {});
  if (/sk_(live|test)_|pk_live_|whsec_/.test(blob)) {
    return { error: 'do not send secrets in the request body', status: 400 };
  }
  const {
    amount_cents = 10000,
    currency = 'aud',
    description = 'AI Pharma Developments services',
    customer_email,
    source = 'website',
    confirm,
    mode = 'payment',
  } = body || {};
  if (source === 'agent' && confirm !== true) {
    return { error: 'agent orders require confirm=true', status: 403 };
  }
  if (!Number.isInteger(amount_cents) || amount_cents < 100) {
    return { error: 'amount_cents must be integer >= 100', status: 400 };
  }
  const normalized = String(currency || '').toLowerCase();
  if (normalized !== 'aud') {
    return { error: 'currency must be aud until multi-currency is enabled', status: 400 };
  }
  const checkoutMode = mode === 'subscription' || mode === 'subscription_preview' ? 'subscription' : 'payment';
  return { amount_cents, currency: normalized, description, customer_email, source, confirm, mode: checkoutMode, charged: false };
}

const refused = validateOrder({ source: 'agent', confirm: false, amount_cents: 25000 });
assert.strictEqual(refused.status, 403);

const missingConfirm = validateOrder({ source: 'agent', amount_cents: 25000 });
assert.strictEqual(missingConfirm.status, 403);

const queued = validateOrder({ source: 'agent', confirm: true, amount_cents: 25000, customer_email: 'ops@example.com' });
assert.strictEqual(queued.charged, false);
assert.strictEqual(queued.currency, 'aud');

const badAmount = validateOrder({ amount_cents: 50 });
assert.strictEqual(badAmount.status, 400);

const usd = validateOrder({ amount_cents: 10000, currency: 'usd' });
assert.strictEqual(usd.status, 400);

const leaked = validateOrder({ amount_cents: 10000, note: 'sk_test_placeholder_not_real' });
assert.strictEqual(leaked.status, 400);

const site = validateOrder({ amount_cents: 10000, source: 'website' });
assert.strictEqual(site.charged, false);

const retainer = validateOrder({ amount_cents: 100000, mode: 'subscription_preview' });
assert.strictEqual(retainer.mode, 'subscription');
assert.strictEqual(retainer.charged, false);

console.log(JSON.stringify({
  ok: true,
  checks: ['agent_confirm_gate', 'missing_confirm', 'min_amount', 'aud_only', 'reject_embedded_secrets', 'no_charge_flag', 'subscription_preview'],
  note: 'dry-run only; live charges remain blocked until operator confirms',
}));
