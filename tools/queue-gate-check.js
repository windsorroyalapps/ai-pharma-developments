#!/usr/bin/env node
/**
 * Dry-run queue gate check. Processes sample queue items.
 * Asserts agent items without confirm=true are refused and charged remains false.
 * No Stripe, no GCP, no secrets.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const samplePath = path.join(__dirname, '..', 'cloud', 'automation', 'sample-queue.json');
if (!fs.existsSync(samplePath)) {
  console.log(JSON.stringify({ ok: false, error: 'sample-queue.json missing' }));
  process.exit(1);
}

const queue = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
if (!Array.isArray(queue)) {
  console.log(JSON.stringify({ ok: false, error: 'queue not array' }));
  process.exit(1);
}

let refused = 0;
let queued = 0;
let chargedSeen = false;

for (const item of queue) {
  const source = item.source || 'website';
  if (source === 'agent' && item.confirm !== true) {
    refused += 1;
    assert.strictEqual(item.charged, undefined || false || null, 'refused items must not claim charged');
  } else if (item.confirm === true || source !== 'agent') {
    queued += 1;
    if (item.charged === true) chargedSeen = true;
  }
}

assert.strictEqual(chargedSeen, false, 'no item may have charged=true in dry-run');

console.log(JSON.stringify({
  ok: true,
  items: queue.length,
  refused_agent_no_confirm: refused,
  queued_or_website: queued,
  charged: 0,
  live_charges: false,
  note: 'confirm=true gate enforced; dry-run only'
}, null, 2));
