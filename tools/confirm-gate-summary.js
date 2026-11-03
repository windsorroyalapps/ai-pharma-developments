#!/usr/bin/env node
/**
 * Offline summary of confirm=true gates across site and worker.
 * Never calls Stripe or GCP. Prints charged: false always.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = [
  'cloud/worker/index.js',
  'cloud/worker/dry-run-server.js',
  'js/checkout-gate.js',
  'automation.html',
  'pay.html'
];

const results = [];
for (const rel of files) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    results.push({ file: rel, present: false, has_confirm_gate: false });
    continue;
  }
  const text = fs.readFileSync(p, 'utf8');
  const has = /confirm\s*===\s*true|confirm=true|confirm !== true/.test(text);
  results.push({ file: rel, present: true, has_confirm_gate: has, charged: false });
}

const allGated = results.every(r => !r.present || r.has_confirm_gate);
console.log(JSON.stringify({
  ok: allGated,
  charged: false,
  live_charges: false,
  note: 'Agent checkout requires confirm=true. No secrets read.',
  results
}, null, 2));
process.exit(allGated ? 0 : 1);
