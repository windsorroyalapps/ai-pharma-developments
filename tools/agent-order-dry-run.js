/**
 * Local dry-run simulator for agent orders.
 * Enforces confirm=true. Never charges. charged always false.
 * Usage: node tools/agent-order-dry-run.js
 */
const { evaluateCheckout } = require('../js/checkout-gate');

const samples = [
  { amount_cents: 10000, currency: 'aud', source: 'agent', confirm: true, description: 'retainer preview' },
  { amount_cents: 5000, currency: 'aud', source: 'agent', confirm: false, description: 'should refuse' },
  { amount_cents: 50, currency: 'aud', source: 'agent', confirm: true, description: 'amount too small' },
  { amount_cents: 10000, currency: 'usd', source: 'agent', confirm: true, description: 'currency not allowed' },
  { amount_cents: 10000, currency: 'aud', source: 'website', confirm: false, description: 'website ok without confirm' },
];

console.log('Agent order dry-run (charged: false always)\n');

samples.forEach((body, i) => {
  const result = evaluateCheckout(body);
  const id = result.ok ? 'ord_dry_' + Math.random().toString(16).slice(2, 10) : 'refused';
  console.log(JSON.stringify({
    sample: i + 1,
    input: { source: body.source, confirm: body.confirm, amount_cents: body.amount_cents, currency: body.currency },
    ok: result.ok,
    status: result.status,
    error: result.error || null,
    id,
    charged: false,
    note: result.ok ? 'queued only' : 'refused by gate',
  }));
});

console.log('\nAll paths keep charged=false. Live charges blocked until operator says live.');
