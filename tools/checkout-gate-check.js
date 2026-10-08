#!/usr/bin/env node
/** Browser-shared gate, exercised without a DOM. */
const assert = require('assert');
const { evaluateCheckout } = require('../js/checkout-gate.js');

const refused = evaluateCheckout({ source: 'agent', confirm: false, amount_cents: 10000 });
assert.strictEqual(refused.ok, false);
assert.strictEqual(refused.status, 403);
assert.strictEqual(refused.charged, false);

const missing = evaluateCheckout({ source: 'agent', amount_cents: 10000 });
assert.strictEqual(missing.status, 403);

const website = evaluateCheckout({ source: 'website', amount_cents: 10000 });
assert.strictEqual(website.ok, true);
assert.strictEqual(website.confirm, false);
assert.strictEqual(website.charged, false);

const agent = evaluateCheckout({ source: 'agent', confirm: true, amount_cents: 25000, currency: 'AUD' });
assert.strictEqual(agent.ok, true);
assert.strictEqual(agent.confirm, true);
assert.strictEqual(agent.charged, false);

const leaked = evaluateCheckout({ source: 'agent', confirm: true, amount_cents: 10000, note: 'whsec_not_real' });
assert.strictEqual(leaked.status, 400);

console.log(JSON.stringify({ ok: true, checks: ['agent_refused', 'website_allowed', 'agent_confirmed_not_charged', 'secrets_rejected'] }));
