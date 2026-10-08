#!/usr/bin/env node
/** Build one dry-run quote JSONL row. Refuses agent source without confirm=true. No Stripe call. */
const catalog = [
  { sku: 'consult-30', amount_cents: 15000, mode: 'one_time' },
  { sku: 'scoping', amount_cents: 45000, mode: 'one_time' },
  { sku: 'support', amount_cents: 25000, mode: 'one_time' },
  { sku: 'careflow-setup', amount_cents: 35000, mode: 'one_time' },
  { sku: 'retainer', amount_cents: 100000, mode: 'subscription_preview' },
  { sku: 'ops-retainer', amount_cents: 75000, mode: 'subscription_preview' }
];

const sku = process.argv[2];
const email = process.argv[3] || 'ops@example.com';
const source = process.argv[4] || 'website';
const confirm = process.argv[5] === 'confirm=true';
const item = catalog.find((row) => row.sku === sku);

if (!item) {
  console.error('Unknown sku. Use consult-30, scoping, support, careflow-setup, retainer, ops-retainer');
  process.exit(1);
}
if (source === 'agent' && !confirm) {
  console.error('Refused: agent quotes require confirm=true');
  process.exit(2);
}

const row = {
  sku: item.sku,
  amount_cents: item.amount_cents,
  currency: 'aud',
  mode: item.mode,
  email,
  source,
  confirm,
  dry_run: true,
  created_at: new Date().toISOString()
};
process.stdout.write(JSON.stringify(row) + '\n');
