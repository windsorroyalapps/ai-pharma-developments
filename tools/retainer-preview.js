#!/usr/bin/env node
/** Dry-run monthly retainer quote. No Stripe call. */
const catalog = [
  { sku: 'retainer', name: 'Research support retainer (monthly)', amount_cents: 100000 },
  { sku: 'ops-retainer', name: 'Site and payment ops retainer (monthly)', amount_cents: 75000 },
];

const sku = process.argv[2] || 'ops-retainer';
const months = Number(process.argv[3] || 3);
const confirm = process.argv.includes('--confirm');
const source = process.argv.includes('--agent') ? 'agent' : 'website';
const item = catalog.find((row) => row.sku === sku);

if (!item) {
  console.error('unknown sku');
  process.exit(1);
}
if (!Number.isInteger(months) || months < 1 || months > 12) {
  console.error('months must be 1-12');
  process.exit(1);
}
if (source === 'agent' && !confirm) {
  console.error('agent orders require confirm=true');
  process.exit(2);
}

console.log(JSON.stringify({
  event: 'retainer_preview',
  sku: item.sku,
  description: item.name,
  currency: 'aud',
  monthly_cents: item.amount_cents,
  months,
  preview_total_cents: item.amount_cents * months,
  source,
  confirm,
  charged: false,
  dry_run: true,
}, null, 2));
