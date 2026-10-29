#!/usr/bin/env node
/**
 * Summarize local JSONL ledgers. No Stripe, no GCP.
 * Usage: node tools/ledger-summary.js [.apd-ledger]
 * Always reports charged: 0 and live_charges: false.
 */
const fs = require('fs');
const path = require('path');

const dir = process.argv[2] || process.env.APD_LEDGER_DIR || path.join(process.cwd(), '.apd-ledger');
if (!fs.existsSync(dir)) {
  console.log(JSON.stringify({
    dir,
    files: 0,
    rows: 0,
    charged: 0,
    live_charges: false,
    agent_refused: 0,
    queued: 0,
    events: {},
    note: 'no ledger yet — dry-run only',
  }, null, 2));
  process.exit(0);
}

const files = fs.readdirSync(dir).filter((name) => name.endsWith('.jsonl'));
const rows = [];
files.forEach((name) => {
  fs.readFileSync(path.join(dir, name), 'utf8').split('\n').filter(Boolean).forEach((line) => {
    try { rows.push(JSON.parse(line)); } catch (err) { rows.push({ event: 'parse_error' }); }
  });
});

const agentRefused = rows.filter((row) =>
  row.reason === 'agent orders require confirm=true' ||
  row.status === 'refused' ||
  row.error === 'agent orders require confirm=true'
).length;

const eventCounts = {};
rows.forEach((row) => {
  const key = row.event || row.status || (row.ok === false ? 'error' : 'unknown');
  eventCounts[key] = (eventCounts[key] || 0) + 1;
});

const leaked = rows.some((row) => /sk_(live|test)_|pk_(live|test)_|whsec_|BEGIN PRIVATE KEY/.test(JSON.stringify(row)));
const anyCharged = rows.some((row) => row.charged === true || row.live_charge === true);

const summary = {
  dir,
  files: files.length,
  rows: rows.length,
  agent_refused: agentRefused,
  queued: rows.filter((row) =>
    row.ok === true ||
    row.status === 'queued' ||
    row.event === 'dry_run_session' ||
    row.event === 'agent_order_queued' ||
    row.event === 'local_dry_run'
  ).length,
  charged: 0,
  live_charges: false,
  any_charged_flag_seen: anyCharged,
  secret_leak: leaked,
  events: eventCounts,
  note: 'dry-run only; live charges remain blocked until operator says live',
};

if (leaked || anyCharged) {
  console.error(JSON.stringify(summary, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(summary, null, 2));
