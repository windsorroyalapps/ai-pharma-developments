#!/usr/bin/env node
/**
 * Payment worker routes without npm packages or Stripe keys.
 * Same confirm=true gate as index.js. Never charges.
 *
 * Usage: node cloud/worker/dry-run-server.js
 * PORT defaults to 8080. APD_LEDGER_DIR writes worker.jsonl.
 */
const http = require('http');
const crypto = require('crypto');
const { append, summarizeDir } = require('./ledger');

const PORT = Number(process.env.PORT || 8080);
const ALLOWED = ['aud'];

function validate(body) {
  const blob = JSON.stringify(body || {});
  if (/sk_(live|test)_|pk_live_|whsec_/.test(blob)) {
    return { error: 'do not send secrets in the request body', status: 400 };
  }
  const amount = body.amount_cents == null ? 10000 : body.amount_cents;
  const currency = String(body.currency || 'aud').toLowerCase();
  const source = body.source || 'website';
  if (source === 'agent' && body.confirm !== true) {
    return { error: 'agent orders require confirm=true', status: 403 };
  }
  if (!Number.isInteger(amount) || amount < 100) {
    return { error: 'amount_cents must be integer >= 100', status: 400 };
  }
  if (!ALLOWED.includes(currency)) {
    return { error: 'currency must be aud until multi-currency is enabled', status: 400 };
  }
  const mode = body.mode === 'subscription' || body.mode === 'subscription_preview' ? 'subscription' : 'payment';
  return {
    amount_cents: amount,
    currency,
    description: body.description || 'AI Pharma Developments services',
    customer_email: body.customer_email || null,
    source,
    confirm: body.confirm === true,
    mode,
    sku: body.sku || null,
  };
}

function send(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    return res.end();
  }
  if (req.method === 'GET' && (req.url === '/healthz' || req.url === '/health' || req.url === '/ready')) {
    return send(res, 200, {
      ok: true,
      service: 'apd-payment-worker-dry-run',
      dry_run: true,
      live_charges: false,
      confirm_gate: true,
      stripe_configured: false,
      intake: true,
      blockers: ['gcp_auth_missing', 'stripe_test_key_missing'],
      ledger: summarizeDir(),
    });
  }
  if (req.method === 'GET' && req.url === '/ledger/summary') {
    return send(res, 200, summarizeDir());
  }
  if (req.method !== 'POST') return send(res, 404, { error: 'not found' });

  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    let body = {};
    try { body = JSON.parse(Buffer.concat(chunks).toString() || '{}'); }
    catch (err) { return send(res, 400, { error: 'invalid json' }); }

    if (req.url === '/create-checkout-session' || req.url === '/agent-order') {
      const order = validate(Object.assign({}, body, req.url === '/agent-order' ? { source: 'agent' } : {}));
      if (order.error) return send(res, order.status, { error: order.error });
      const id = (req.url === '/agent-order' ? 'ord_' : 'cs_dry_') + crypto.randomBytes(6).toString('hex');
      append(req.url === '/agent-order' ? 'agent_order_queued' : 'dry_run_session', Object.assign({ id }, order));
      return send(res, 200, { id, dry_run: true, charged: false, mode: order.mode, url: null });
    }
    if (req.url === '/intake') {
      if (!body.name || !body.email || !body.need) return send(res, 400, { error: 'name, email, and need required' });
      const row = append('consult_intake_fallback', {
        name: String(body.name).slice(0, 120),
        email: String(body.email).slice(0, 200),
        charged: false,
      });
      return send(res, 200, { ok: true, charged: false, queued: true, row });
    }
    if (req.url === '/dry-run/settle') {
      if (!body.session_id) return send(res, 400, { error: 'session_id required' });
      const row = append('dry_run_settled', { session_id: String(body.session_id).slice(0, 80), note: 'local settle only' });
      return send(res, 200, { ok: true, charged: false, row });
    }
    return send(res, 404, { error: 'not found' });
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(JSON.stringify({ listening: PORT, dry_run: true, live_charges: false }));
  });
}

module.exports = { validate, server };
