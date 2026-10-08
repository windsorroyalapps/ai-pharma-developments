#!/usr/bin/env node
/**
 * Process a local automation queue without charging.
 * Agent items are dropped unless confirm === true.
 * Consult intake rows do not require an amount and never charge.
 * Writes an append-only JSONL ledger. No Stripe calls.
 *
 * Usage: node cloud/automation/process-queue.js [queue.json]
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const input = process.argv[2] || path.join(__dirname, 'sample-queue.json');
const outDir = process.env.APD_LEDGER_DIR || path.join(process.cwd(), '.apd-ledger');
const ledgerPath = path.join(outDir, 'automation.jsonl');

function load(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error('queue must be a JSON array');
  return data;
}

function append(row) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.appendFileSync(ledgerPath, JSON.stringify(row) + '\n');
}

function refuse(reason) {
  return { ok: false, status: 'refused', reason, charged: false };
}

function processItem(item) {
  const source = item.source || 'website';
  const type = item.type || 'order';
  if (source === 'agent' && item.confirm !== true) {
    return refuse('agent orders require confirm=true');
  }
  if (type === 'consult_intake') {
    if (!item.email || !item.need) {
      return { ok: false, status: 'invalid', reason: 'consult_intake requires email and need', charged: false };
    }
    return {
      ok: true,
      status: 'queued',
      type: 'consult_intake',
      id: 'int_' + crypto.randomBytes(6).toString('hex'),
      email: String(item.email).slice(0, 200),
      name: item.name ? String(item.name).slice(0, 120) : null,
      need: String(item.need).slice(0, 500),
      source,
      confirm: item.confirm === true,
      charged: false,
      mode: 'dry_run',
    };
  }
  if (type === 'invoice_preview') {
    const skus = Array.isArray(item.skus) ? item.skus.map(String) : [];
    if (!skus.length) {
      return { ok: false, status: 'invalid', reason: 'invoice_preview requires skus', charged: false };
    }
    return {
      ok: true,
      status: 'preview',
      type: 'invoice_preview',
      id: 'inv_preview_' + crypto.randomBytes(4).toString('hex'),
      skus,
      email: item.email || null,
      source,
      confirm: item.confirm === true,
      charged: false,
      billed: false,
      mode: 'dry_run',
    };
  }
  const amount = Number(item.amount_cents);
  if (!Number.isInteger(amount) || amount < 100) {
    return { ok: false, status: 'invalid', reason: 'amount_cents must be integer >= 100', charged: false };
  }
  return {
    ok: true,
    status: 'queued',
    type: 'order',
    id: 'ord_' + crypto.randomBytes(6).toString('hex'),
    sku: item.sku || null,
    amount_cents: amount,
    currency: item.currency || 'aud',
    email: item.email || null,
    source,
    confirm: item.confirm === true,
    charged: false,
    mode: 'dry_run',
  };
}

const items = load(input);
const results = items.map((item) => {
  const row = { ts: new Date().toISOString(), ...processItem(item) };
  append(row);
  return row;
});

const summary = {
  input,
  ledger: ledgerPath,
  total: results.length,
  queued: results.filter((r) => r.ok && r.status === 'queued').length,
  previews: results.filter((r) => r.ok && r.status === 'preview').length,
  refused: results.filter((r) => !r.ok).length,
  charged: 0,
};
console.log(JSON.stringify({ summary, results }, null, 2));
if (results.some((r) => r.source === 'agent' && r.ok && r.confirm !== true)) process.exit(2);
