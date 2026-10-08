#!/usr/bin/env node
/**
 * Simulate checkout.session.completed into a local JSONL ledger.
 * Never calls Stripe. charged and refunded stay false.
 * Agent source is refused unless --confirm is set.
 *
 * Usage:
 *   node tools/webhook-event-dry-run.js
 *   node tools/webhook-event-dry-run.js cloud/automation/webhook-dry-run.jsonl --agent
 *   node tools/webhook-event-dry-run.js cloud/automation/webhook-dry-run.jsonl --agent --confirm
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const out = args.find((a) => !a.startsWith('--')) || 'cloud/automation/webhook-dry-run.jsonl';
const source = args.includes('--agent') ? 'agent' : 'operator';
const confirm = args.includes('--confirm');

if (source === 'agent' && !confirm) {
  console.error('refused: agent webhook simulation requires --confirm');
  process.exit(2);
}

const row = {
  type: 'checkout.session.completed',
  simulated: true,
  charged: false,
  refunded: false,
  source,
  confirm: source === 'agent' ? true : true,
  currency: 'aud',
  amount_cents: 10000,
  description: 'AI Pharma services dry-run',
  created_at: new Date().toISOString()
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.appendFileSync(out, JSON.stringify(row) + '\n');
console.log(JSON.stringify(row));
