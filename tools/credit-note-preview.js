#!/usr/bin/env node
/**
 * Local credit-note preview. No Stripe refund API. No charge.
 * Agent notes refuse unless --confirm is present.
 * Usage: node tools/credit-note-preview.js consult-30 --cents 15000 --reason "scoping overlap"
 *        node tools/credit-note-preview.js consult-30 --agent
 */
const fs = require('fs');
const path = require('path');

const catalogSrc = fs.readFileSync(path.join(__dirname, '../js/catalog.js'), 'utf8');
const match = catalogSrc.match(/window\.APD_CATALOG\s*=\s*(\[[\s\S]*?\]);/);
if (!match) {
  console.error('catalog parse failed');
  process.exit(1);
}
const catalog = Function('"use strict"; return (' + match[1] + ');')();
const args = process.argv.slice(2);
const agent = args.includes('--agent');
const confirm = args.includes('--confirm');

function flagValue(name) {
  const i = args.indexOf(name);
  if (i === -1 || !args[i + 1] || args[i + 1].startsWith('--')) return null;
  return args[i + 1];
}

const reserved = new Set([flagValue('--cents'), flagValue('--reason'), flagValue('--invoice')].filter(Boolean));
const sku = args.find((arg) => !arg.startsWith('--') && !reserved.has(arg));
if (agent && !confirm) {
  console.error('agent credit note requires --confirm');
  process.exit(2);
}
if (!sku) {
  console.error('usage: node tools/credit-note-preview.js <sku> [--cents N] [--reason text] [--invoice id] [--agent --confirm]');
  process.exit(1);
}
const item = catalog.find((row) => row.sku === sku);
if (!item) {
  console.error('unknown sku: ' + sku);
  process.exit(1);
}
const centsRaw = flagValue('--cents');
const amount = centsRaw == null ? item.amount_cents : Number(centsRaw);
if (!Number.isInteger(amount) || amount < 100 || amount > item.amount_cents) {
  console.error('cents must be an integer from 100 to the catalog amount');
  process.exit(1);
}
const reason = flagValue('--reason') || 'preview adjustment';
if (reason.length > 240) {
  console.error('reason too long');
  process.exit(1);
}
const note = {
  id: 'cn_preview_' + Date.now().toString(36),
  related_invoice: flagValue('--invoice') || null,
  sku: item.sku,
  name: item.name,
  currency: 'aud',
  amount_cents: amount,
  reason: reason.slice(0, 240),
  source: agent ? 'agent' : 'website',
  confirm: confirm,
  charged: false,
  refunded: false,
  stripe_refund: false,
  note: 'preview only; no Stripe refund is created',
};
console.log(JSON.stringify(note, null, 2));
