#!/usr/bin/env node
/**
 * Local billing-adjustment queue. No Stripe refund API. No charge.
 * Agent rows are refused unless confirm=true.
 * Usage: node tools/adjustment-queue.js cloud/automation/sample-adjustments.json
 */
const fs = require('fs');
const path = require('path');

const input = process.argv[2];
if (!input) {
  console.error('usage: node tools/adjustment-queue.js <queue.json>');
  process.exit(1);
}

const catalogSrc = fs.readFileSync(path.join(__dirname, '../js/catalog.js'), 'utf8');
const match = catalogSrc.match(/window\.APD_CATALOG\s*=\s*(\[[\s\S]*?\]);/);
if (!match) {
  console.error('catalog parse failed');
  process.exit(1);
}
const catalog = Function('"use strict"; return (' + match[1] + ');')();
const raw = fs.readFileSync(input, 'utf8');
if (/sk_(live|test)_|pk_live_|whsec_/.test(raw)) {
  console.error('queue contains a secret pattern; refused');
  process.exit(1);
}

const queue = JSON.parse(raw);
const rows = Array.isArray(queue) ? queue : queue.adjustments;
if (!Array.isArray(rows)) {
  console.error('queue must be an array or { adjustments: [] }');
  process.exit(1);
}

const ledgerDir = process.env.APD_LEDGER_DIR;
const accepted = [];
const refused = [];

rows.forEach((row, index) => {
  const source = row.source || 'website';
  const sku = row.sku;
  const item = catalog.find((entry) => entry.sku === sku);
  if (source === 'agent' && row.confirm !== true) {
    refused.push({ index, sku, error: 'agent adjustments require confirm=true' });
    return;
  }
  if (!item) {
    refused.push({ index, sku, error: 'unknown sku' });
    return;
  }
  const amount = Number.isInteger(row.amount_cents) ? row.amount_cents : item.amount_cents;
  if (amount < 100 || amount > item.amount_cents) {
    refused.push({ index, sku, error: 'amount_cents must be 100..catalog amount' });
    return;
  }
  accepted.push({
    id: 'adj_preview_' + index + '_' + Date.now().toString(36),
    sku: item.sku,
    name: item.name,
    currency: 'aud',
    amount_cents: amount,
    reason: String(row.reason || 'preview adjustment').slice(0, 240),
    source,
    confirm: row.confirm === true,
    charged: false,
    refunded: false,
    stripe_refund: false,
  });
});

if (ledgerDir) {
  fs.mkdirSync(ledgerDir, { recursive: true });
  const lines = accepted.map((row) => JSON.stringify({ event: 'adjustment_preview', ...row })).join('\n');
  fs.appendFileSync(path.join(ledgerDir, 'adjustments.jsonl'), (lines ? lines + '\n' : ''));
}

const summary = {
  accepted: accepted.length,
  refused: refused.length,
  charged: 0,
  refunded: 0,
  rows: accepted,
  errors: refused,
};
console.log(JSON.stringify(summary, null, 2));
process.exit(refused.some((row) => row.error === 'agent adjustments require confirm=true') && accepted.length === 0 ? 2 : 0);
