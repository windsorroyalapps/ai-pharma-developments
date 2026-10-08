#!/usr/bin/env node
/**
 * Local invoice preview from the service catalog. No Stripe call. No charge.
 * Agent previews refuse unless --confirm is present.
 * Usage: node tools/invoice-preview.js consult-30 scoping
 *        node tools/invoice-preview.js consult-30 --agent --confirm
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
const skus = args.filter((arg) => !arg.startsWith('--'));
if (agent && !confirm) {
  console.error('agent invoice preview requires --confirm');
  process.exit(2);
}
if (!skus.length) {
  console.error('usage: node tools/invoice-preview.js <sku> [sku...] [--agent --confirm]');
  process.exit(1);
}

const lines = skus.map((sku) => {
  const item = catalog.find((row) => row.sku === sku);
  if (!item) {
    console.error('unknown sku: ' + sku);
    process.exit(1);
  }
  return {
    sku: item.sku,
    name: item.name,
    mode: item.mode,
    amount_cents: item.amount_cents,
    currency: 'aud',
    billed: false,
  };
});

const total = lines.reduce((sum, line) => sum + line.amount_cents, 0);
const invoice = {
  id: 'inv_preview_' + Date.now().toString(36),
  currency: 'aud',
  lines,
  total_cents: total,
  charged: false,
  source: agent ? 'agent' : 'website',
  confirm: confirm,
  note: 'preview only; live invoices wait for Stripe identity and explicit live confirmation',
};
console.log(JSON.stringify(invoice, null, 2));
