#!/usr/bin/env node
/**
 * Local invoice preview from the service catalog. No Stripe call. No charge.
 * Usage: node tools/invoice-preview.js consult-30 scoping
 */
const fs = require('fs');
const path = require('path');

const catalogSrc = fs.readFileSync(path.join(__dirname, '../js/catalog.js'), 'utf8');
const match = catalogSrc.match(/window\.APD_CATALOG\s*=\s*(\[[\s\S]*?\]);/);
if (!match) {
  console.error('catalog parse failed');
  process.exit(1);
}
const catalog = JSON.parse(match[1]);
const skus = process.argv.slice(2);
if (!skus.length) {
  console.error('usage: node tools/invoice-preview.js <sku> [sku...]');
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
  note: 'preview only; live invoices wait for Stripe identity and explicit live confirmation',
};
console.log(JSON.stringify(invoice, null, 2));
