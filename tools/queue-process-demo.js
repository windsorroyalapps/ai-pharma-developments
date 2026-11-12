#!/usr/bin/env node
/**
 * Local demo of the confirm=true gate used by dry-run-server /queue/process.
 * No network. Never charges.
 */
const crypto = require('crypto');

function processItems(items) {
  const results = [];
  for (const item of items || []) {
    const source = item.source || 'website';
    if (source === 'agent' && item.confirm !== true) {
      results.push({
        ok: false,
        status: 'refused',
        reason: 'agent orders require confirm=true',
        charged: false,
        type: item.type || 'order',
        source,
      });
      continue;
    }
    results.push({
      ok: true,
      status: 'queued',
      type: item.type || 'order',
      id: 'q_' + crypto.randomBytes(4).toString('hex'),
      source,
      confirm: item.confirm === true,
      charged: false,
      mode: 'dry_run',
    });
  }
  return {
    ok: true,
    summary: {
      total: results.length,
      queued: results.filter((r) => r.ok).length,
      refused: results.filter((r) => !r.ok).length,
      charged: 0,
      live_charges: false,
    },
    results,
    note: 'dry-run only; matches server /queue/process gate',
  };
}

if (require.main === module) {
  const sample = [
    { source: 'agent', confirm: false, amount_cents: 10000 },
    { source: 'agent', confirm: true, amount_cents: 15000 },
    { source: 'website', amount_cents: 20000 },
  ];
  console.log(JSON.stringify(processItems(sample), null, 2));
}

module.exports = { processItems };
