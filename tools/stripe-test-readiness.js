#!/usr/bin/env node
/**
 * Offline Stripe / payment readiness check.
 * Does not call Stripe and does not read secret values.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const required = [
  'pay.html',
  'js/stripe-checkout.js',
  'js/google-pay.js',
  'cloud/worker/index.js',
  'cloud/iam/bootstrap.sh',
  'cloud/iam/add-test-secrets.sh',
  'docs/PAYMENT_STATUS.md'
];

const checks = [];
function pass(name, detail) { checks.push({ ok: true, name, detail }); }
function fail(name, detail) { checks.push({ ok: false, name, detail }); }

for (const rel of required) {
  const p = path.join(root, rel);
  if (fs.existsSync(p)) pass('file', rel);
  else fail('file', rel + ' missing');
}

const worker = fs.readFileSync(path.join(root, 'cloud/worker/index.js'), 'utf8');
if (worker.includes('confirm')) pass('agent-gate', 'worker mentions confirm');
else fail('agent-gate', 'worker missing confirm gate');
if (worker.includes('checkout.sessions') || worker.includes('checkout.session')) pass('checkout', 'session create path present');
else fail('checkout', 'no checkout session path');

const secrets = fs.readFileSync(path.join(root, 'cloud/iam/add-test-secrets.sh'), 'utf8');
if (secrets.includes('sk_live_') && secrets.includes('exit')) pass('live-block', 'add-test-secrets refuses live keys');
else fail('live-block', 'live key guard missing');

const pay = fs.readFileSync(path.join(root, 'pay.html'), 'utf8');
if (pay.includes('YOUR-CLOUD-RUN-URL') || pay.includes('CREATE_CHECKOUT_SESSION_URL')) {
  pass('pay-placeholder', 'pay.html still has a session URL hook');
} else fail('pay-placeholder', 'pay.html missing session URL hook');

const failed = checks.filter(c => !c.ok);
console.log(JSON.stringify({
  ready_for_test_keys: failed.length === 0,
  live_mode: 'blocked_until_operator_says_live',
  gcp_iam: 'not_applied_until_auth',
  checks
}, null, 2));
process.exit(failed.length === 0 ? 0 : 1);
