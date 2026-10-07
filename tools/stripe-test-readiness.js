#!/usr/bin/env node
/**
 * Stripe test-mode readiness. No network, no keys, no gcloud.
 * Fails if live key material is committed or the agent confirm gate is missing.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

const worker = read('cloud/worker/index.js');
const secretsScript = read('cloud/iam/add-test-secrets.sh');
const checkout = read('js/stripe-checkout.js');
const privileges = read('cloud/iam/PRIVILEGES.md');

assert.ok(worker.includes("confirm !== true"), 'agent confirm gate missing');
assert.ok(worker.includes('agent orders require confirm=true'), 'confirm error string missing');
assert.ok(worker.includes("'aud'"), 'AUD allowlist missing');
assert.ok(worker.includes('/ready'), 'readiness route missing');
assert.ok(worker.includes('live_charges: false'), 'health must not claim live charges');
assert.ok(!/sk_live_[A-Za-z0-9]{8,}/.test(worker), 'live secret committed in worker');
assert.ok(!/sk_test_[A-Za-z0-9]{8,}/.test(worker), 'test secret committed in worker');
assert.ok(!/whsec_[A-Za-z0-9]{8,}/.test(worker), 'webhook secret committed in worker');

assert.ok(secretsScript.includes('sk_live_'), 'add-test-secrets must refuse live secret keys');
assert.ok(secretsScript.includes('pk_live_'), 'add-test-secrets must refuse live publishable keys');
assert.ok(checkout.includes('charged: false') || checkout.includes('No charge'), 'checkout dry-run must not charge');
assert.ok(privileges.includes('secretmanager.secretAccessor'), 'runtime privilege doc drifted');
assert.ok(!privileges.includes('roles/owner'), 'privilege doc must not grant owner');

const actions = ['GCP_PROJECT_ID', 'GCP_REGION', 'GCP_WIF_PROVIDER', 'GCP_DEPLOY_SA'];
for (const name of actions) {
  assert.ok(privileges.includes(name), 'missing Actions var ' + name);
}

console.log(JSON.stringify({
  ok: true,
  mode: 'test_readiness',
  checks: ['confirm_gate', 'aud_only', 'no_committed_secrets', 'live_key_refusal', 'actions_vars_documented', 'no_owner_role'],
  blockers: ['gcloud_auth', 'github_actions_vars', 'stripe_test_keys_in_secret_manager'],
  live_charges: false,
}));
