#!/usr/bin/env node
/**
 * Local fulfillment dry-run. Never charges. Never reads Stripe keys.
 * Usage: node cloud/automation/local-fulfill.js queue.json
 * Each item must include confirm:true or it is refused.
 */
const fs = require('fs');

const file = process.argv[2];
if (!file) {
  console.error('usage: node cloud/automation/local-fulfill.js queue.json');
  process.exit(2);
}

const items = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!Array.isArray(items)) {
  console.error('queue must be a JSON array');
  process.exit(2);
}

const ledger = [];
for (const item of items) {
  if (item.confirm !== true) {
    ledger.push({
      ts: new Date().toISOString(),
      status: 'refused',
      reason: 'confirm must be true',
      sku: item.sku || null
    });
    continue;
  }
  ledger.push({
    ts: new Date().toISOString(),
    status: 'dry_run_accepted',
    charged: false,
    sku: item.sku || 'unspecified',
    email: item.email || null,
    amount_aud_cents: Number(item.amount_aud_cents) || 0,
    note: 'Stripe live charge blocked until operator pastes test keys and confirms live'
  });
}

const out = 'cloud/automation/ledger-dry-run.jsonl';
fs.appendFileSync(out, ledger.map((row) => JSON.stringify(row)).join('\n') + '\n');
console.log(JSON.stringify({ wrote: out, count: ledger.length, refused: ledger.filter((r) => r.status === 'refused').length }, null, 2));
