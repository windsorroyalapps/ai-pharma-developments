#!/usr/bin/env node
/** Assert the public readiness board never enables live charges or embeds secrets. */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'status.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'js/readiness.js'), 'utf8');
const blob = html + '\n' + js;
if (/sk_(live|test)_|pk_live_|whsec_|BEGIN PRIVATE KEY/.test(blob)) {
  console.error('readiness board must not contain secret material');
  process.exit(1);
}
if (!js.includes('live_charges: false')) {
  console.error('live_charges must stay false');
  process.exit(1);
}
if (!js.includes('confirm_gate: true') || !html.includes('confirm=true')) {
  console.error('confirm gate missing');
  process.exit(1);
}
const required = ['GCP_PROJECT_ID', 'GCP_REGION', 'GCP_WIF_PROVIDER', 'GCP_DEPLOY_SA', 'stripe-secret-key', 'stripe-webhook-secret', 'stripe-publishable-key', 'gcloud auth'];
for (const name of required) {
  if (!blob.includes(name)) {
    console.error('missing blocker name: ' + name);
    process.exit(1);
  }
}
if (/roles\/owner|roles\/editor/i.test(blob)) {
  console.error('do not document Owner or Editor grants');
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, live_charges: false, confirm_gate: true, charged: false }));
