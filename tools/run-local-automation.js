#!/usr/bin/env node
'use strict';
/**
 * Chains keyless site automation. Never calls Stripe. Never mutates GCP.
 * Agent paths without confirm=true are expected to fail closed.
 */
const { spawnSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const steps = [
  ['node', ['tools/stripe-test-readiness.js']],
  ['node', ['tools/checkout-gate-check.js']],
  ['node', ['tools/dry-run-check.js']],
  ['node', ['tools/readiness-board-check.js']],
  ['node', ['tools/consult-intake-check.js']],
  ['node', ['tools/webhook-event-dry-run.js', 'cloud/automation/webhook-dry-run.jsonl', '--agent']],
  ['node', ['tools/webhook-event-dry-run.js', 'cloud/automation/webhook-dry-run.jsonl', '--agent', '--confirm']],
  ['node', ['cloud/automation/process-queue.js', 'cloud/automation/sample-queue.json']],
  ['node', ['tools/adjustment-queue.js', 'cloud/automation/sample-adjustments.json']],
  ['node', ['tools/ledger-summary.js']],
];

const results = [];
for (const [cmd, args] of steps) {
  const started = Date.now();
  const run = spawnSync(cmd, args, { cwd: root, encoding: 'utf8' });
  const expectFail = args.includes('--agent') && !args.includes('--confirm') && args[0].includes('webhook-event-dry-run');
  const code = run.status == null ? 1 : run.status;
  const ok = expectFail ? code !== 0 : code === 0;
  results.push({
    cmd: [cmd, ...args].join(' '),
    code,
    ok,
    ms: Date.now() - started,
  });
  process.stdout.write((run.stdout || '') + (run.stderr || ''));
}

const failed = results.filter((row) => !row.ok);
const summary = {
  at: new Date().toISOString(),
  charged: false,
  refunded: false,
  live: false,
  gcp_mutated: false,
  ok: failed.length === 0,
  failed: failed.map((row) => row.cmd),
  results,
};
process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
process.exit(failed.length ? 1 : 0);
