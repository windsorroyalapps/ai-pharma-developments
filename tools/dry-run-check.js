#!/usr/bin/env node
/**
 * Local contract check for payment automation. No Stripe, no GCP.
 * Agent orders must refuse unless confirm===true and must never charge.
 */
const assert = require('assert');

function validateOrder(body) {
  const {
    amount_cents = 10000,
    currency = 'aud',
    description = 'AI Pharma Developments services',
    customer_email,
    source = 'website',
    confirm,
  } = body || {};
  if (source === 'agent' && confirm !== true) {
    return { error: 'agent orders require confirm=true', status: 403 };
  }
  if (!Number.isInteger(amount_cents) || amount_cents < 100) {
    return { error: 'amount_cents must be integer >= 100', status: 400 };
  }
  return { amount_cents, currency, description, customer_email, source, confirm, charged: false };
}

const refused = validateOrder({ source: 'agent', confirm: false, amount_cents: 25000 });
assert.strictEqual(refused.status, 403);

const queued = validateOrder({ source: 'agent', confirm: true, amount_cents: 25000, customer_email: 'ops@example.com' });
assert.strictEqual(queued.charged, false);
assert.strictEqual(queued.currency, 'aud');

const badAmount = validateOrder({ amount_cents: 50 });
assert.strictEqual(badAmount.status, 400);

const site = validateOrder({ amount_cents: 10000, source: 'website' });
assert.strictEqual(site.charged, false);

console.log(JSON.stringify({
  ok: true,
  checks: ['agent_confirm_gate', 'min_amount', 'no_charge_flag'],
  note: 'dry-run only; live charges remain blocked until operator confirms',
}));
