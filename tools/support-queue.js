#!/usr/bin/env node
/**
 * Local support-ticket queue. No Stripe calls. No secrets.
 * Agent rows without confirm=true are refused.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const outDir = path.join(__dirname, '..', 'cloud', 'automation', 'out');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'support-queue.jsonl');

const sample = [
  { source: 'website', name: 'Sample Clinic', email: 'ops@example.com', topic: 'retainer', need: 'Preview monthly research retainer', confirm: true },
  { source: 'agent', name: 'Agent', email: 'agent@example.com', topic: 'checkout', need: 'Must be refused', confirm: false },
];

const input = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : sample;
const rows = Array.isArray(input) ? input : [input];
let accepted = 0;
let refused = 0;

for (const row of rows) {
  if (row.source === 'agent' && row.confirm !== true) {
    refused += 1;
    const rec = { ts: new Date().toISOString(), status: 'refused', reason: 'agent orders require confirm=true', charged: false };
    fs.appendFileSync(outFile, JSON.stringify(rec) + '\n');
    continue;
  }
  if (!row.email || !row.need) {
    refused += 1;
    continue;
  }
  accepted += 1;
  const rec = {
    ts: new Date().toISOString(),
    id: 'sup_' + crypto.randomBytes(4).toString('hex'),
    status: 'queued',
    topic: String(row.topic || 'general').slice(0, 80),
    email: String(row.email).slice(0, 200),
    need: String(row.need).slice(0, 2000),
    charged: false,
  };
  fs.appendFileSync(outFile, JSON.stringify(rec) + '\n');
}

const summary = { accepted, refused, charged: 0, file: outFile };
console.log(JSON.stringify(summary));
if (accepted < 1) process.exit(1);
