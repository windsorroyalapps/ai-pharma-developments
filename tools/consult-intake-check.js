#!/usr/bin/env node
/**
 * Consult intake contract. No network. No charge.
 * Agent intake without confirm exits 2.
 */
const samples = [
  { name: 'A', email: 'a@example.com', need: 'scope', source: 'website' },
  { name: 'A', email: 'a@example.com', need: 'scope', source: 'agent', confirm: false },
  { name: 'A', email: 'a@example.com', need: 'scope', source: 'agent', confirm: true },
];

function gate(body) {
  if (!body.name || !body.email || !body.need) return { status: 400 };
  if (body.source === 'agent' && body.confirm !== true) return { status: 403, error: 'agent orders require confirm=true' };
  return { status: 200, charged: false, queued: true };
}

const refused = gate(samples[1]);
if (refused.status !== 403) {
  console.error('agent intake without confirm must be 403');
  process.exit(2);
}
const ok = gate(samples[2]);
if (ok.status !== 200 || ok.charged !== false) process.exit(3);
const site = gate(samples[0]);
if (site.status !== 200 || site.charged !== false) process.exit(4);
console.log(JSON.stringify({ ok: true, charged: false, agent_gate: true, website: site.status, confirmed: ok.status }));
