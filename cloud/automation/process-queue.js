#!/usr/bin/env node
/**
 * Process a local automation queue without charging.
 * Agent items are dropped unless confirm === true.
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

function processItem(item) {
  const source = item.source || 'website';
  if (source === 'agent' && item.confirm !== true) {
    return {
      ok: false,
      status: 'refused',
      reason: 'agent orders require confirm=true',
      charged: false,
    };
  }
  const amount = Number(item.amount_cents);
  if (!Number.isInteger(amount) || amount < 100) {
    return { ok: false, status: 'invalid', reason: 'amount_cents must be integer >= 100', charged: false };
  }
  return {
    ok: true,
    status: 'queued',
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
  queued: results.filter((r) => r.ok).length,
  refused: results.filter((r) => !r.ok).length,
  charged: 0,
};
console.log(JSON.stringify({ summary, results }, null, 2));
