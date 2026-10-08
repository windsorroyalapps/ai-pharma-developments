#!/usr/bin/env node
/**
 * Summarize local JSONL ledgers. No Stripe, no GCP.
 * Usage: node tools/ledger-summary.js [.apd-ledger]
 */
const fs = require('fs');
const path = require('path');

const dir = process.argv[2] || process.env.APD_LEDGER_DIR || path.join(process.cwd(), '.apd-ledger');
if (!fs.existsSync(dir)) {
  console.log(JSON.stringify({ dir, files: 0, rows: 0, charged: 0, live_charges: false, note: 'no ledger yet' }));
  process.exit(0);
}

const files = fs.readdirSync(dir).filter((name) => name.endsWith('.jsonl'));
const rows = [];
files.forEach((name) => {
  fs.readFileSync(path.join(dir, name), 'utf8').split('\n').filter(Boolean).forEach((line) => {
    try { rows.push(JSON.parse(line)); } catch (err) { rows.push({ event: 'parse_error' }); }
  });
});

const agentRefused = rows.filter((row) => row.reason === 'agent orders require confirm=true' || row.status === 'refused').length;
const leaked = rows.some((row) => /sk_(live|test)_|whsec_/.test(JSON.stringify(row)));
const summary = {
  dir,
  files: files.length,
  rows: rows.length,
  agent_refused: agentRefused,
  queued: rows.filter((row) => row.ok === true || row.status === 'queued' || row.event === 'dry_run_session' || row.event === 'agent_order_queued').length,
  charged: 0,
  live_charges: false,
  secret_leak: leaked,
};
if (leaked) {
  console.error(JSON.stringify(summary));
  process.exit(1);
}
console.log(JSON.stringify(summary, null, 2));
