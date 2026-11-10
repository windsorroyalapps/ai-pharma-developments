#!/usr/bin/env node
/**
 * Dry-run multi-item quote preview.
 * Usage: node tools/quote-preview.js
 * Never charges. Agent path requires confirm=true.
 */
const { CATALOG } = require('../cloud/worker/credit-note');

function buildQuote(body) {
  const source = body.source || 'website';
  if (source === 'agent' && body.confirm !== true) {
    return { error: 'agent orders require confirm=true', status: 403 };
  }
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return { error: 'items required', status: 400 };
  const lines = [];
  let total = 0;
  for (const row of items) {
    const sku = String(row.sku || '');
    const qty = Number(row.quantity || 1);
    const cat = CATALOG.find((c) => c.sku === sku);
    if (!cat || !Number.isInteger(qty) || qty < 1) {
      return { error: 'invalid sku or quantity', status: 400 };
    }
    const line_cents = cat.amount_cents * qty;
    total += line_cents;
    lines.push({ sku, name: cat.name, quantity: qty, unit_cents: cat.amount_cents, line_cents });
  }
  return {
    ok: true,
    dry_run: true,
    charged: false,
    currency: 'aud',
    source,
    confirm: body.confirm === true,
    lines,
    total_cents: total,
  };
}

const sample = {
  source: 'agent',
  confirm: true,
  items: [
    { sku: 'consult-30', quantity: 1 },
    { sku: 'scoping', quantity: 1 },
  ],
};

const result = buildQuote(sample);
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
console.log('quote-preview ok (charged=false)');
