#!/usr/bin/env node
/**
 * Local dry-run simulation of agent order gate.
 * Never contacts Stripe or GCP. Always charged: false.
 * Demonstrates refusal when confirm !== true and acceptance when confirm === true.
 */
const crypto = require('crypto');

function simulateAgentOrder(body) {
  const source = body.source || 'website';
  if (source === 'agent' && body.confirm !== true) {
    return {
      ok: false,
      status: 403,
      error: 'agent orders require confirm=true',
      charged: false,
      session_id: null,
    };
  }
  if (/sk_(live|test)_|pk_live_|whsec_/.test(JSON.stringify(body))) {
    return { ok: false, status: 400, error: 'secrets rejected', charged: false };
  }
  const amount = body.amount_cents == null ? 10000 : body.amount_cents;
  if (!Number.isInteger(amount) || amount < 100) {
    return { ok: false, status: 400, error: 'invalid amount', charged: false };
  }
  return {
    ok: true,
    status: 200,
    charged: false,
    mode: 'dry_run',
    session_id: 'dry_' + crypto.randomBytes(8).toString('hex'),
    amount_cents: amount,
    currency: String(body.currency || 'aud').toLowerCase(),
    confirm: body.confirm === true,
    source,
  };
}

const refused = simulateAgentOrder({
  source: 'agent',
  amount_cents: 15000,
  description: 'dry-run test',
  confirm: false,
});

const accepted = simulateAgentOrder({
  source: 'agent',
  amount_cents: 15000,
  description: 'dry-run test',
  confirm: true,
  currency: 'aud',
});

const website = simulateAgentOrder({
  source: 'website',
  amount_cents: 10000,
});

console.log(JSON.stringify({
  ok: refused.status === 403 && accepted.ok === true && accepted.charged === false && website.ok === true,
  charged: false,
  live_charges: false,
  note: 'Agent orders refused without confirm=true. No secrets, no GCP, no Stripe calls.',
  cases: { refused, accepted, website },
}, null, 2));

process.exit(refused.status === 403 && accepted.charged === false ? 0 : 1);
