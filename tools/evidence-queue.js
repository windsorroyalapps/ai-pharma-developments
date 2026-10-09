#!/usr/bin/env node
/** Local evidence queue. No GCP, no Stripe, no charges. */
const fs = require('fs');

const file = process.argv[2] || 'cloud/automation/sample-evidence.json';
const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
const accepted = [];
const refused = [];

for (const row of rows) {
  if (row.reviewer === 'agent' && row.confirm !== true) {
    refused.push({ id: row.id, reason: 'agent rows require confirm=true', charged: false });
    continue;
  }
  accepted.push({
    id: row.id,
    question: row.question,
    sources: row.sources || [],
    state: 'review_ready',
    charged: false,
    published: false
  });
}

const summary = {
  file,
  accepted: accepted.length,
  refused: refused.length,
  charged: 0,
  live_charges: false,
  accepted_rows: accepted,
  refused_rows: refused
};
process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
