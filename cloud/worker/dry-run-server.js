#!/usr/bin/env node
/**
 * Payment worker routes without npm packages or Stripe keys.
 * Same confirm=true gate as index.js. Never charges. Never refunds.
 *
 * Usage: node cloud/worker/dry-run-server.js
 * PORT defaults to 8080. APD_LEDGER_DIR writes worker.jsonl.
 */
const http = require('http');
const crypto = require('crypto');
const { append, summarizeDir } = require('./ledger');
const { buildCreditNote, CATALOG } = require('./credit-note');

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
      credit_notes: true,
      invoice_preview: true,
      support_ticket: true,
      support_queue: true,
      catalog: true,
      quote: true,
      queues: true,
      blockers: ['gcp_auth_missing', 'stripe_test_key_missing'],
      ledger: summarizeDir(),
    });
  }
  if (req.method === 'GET' && req.url === '/catalog') {
    return send(res, 200, {
      ok: true,
      dry_run: true,
      live_charges: false,
      currency: 'aud',
      items: CATALOG,
      note: 'SKU catalog for dry-run quotes and credit notes. Never charges.',
    });
  }
  if (req.method === 'GET' && req.url === '/ledger/summary') {
    return send(res, 200, summarizeDir());
  }
  if (req.method === 'GET' && req.url === '/ledger/export') {
    const fs = require('fs');
    const path = require('path');
    const dir = process.env.APD_LEDGER_DIR || path.join(process.cwd(), '.apd-ledger');
    const files = ['worker.jsonl', 'automation.jsonl'];
    let out = '';
    for (const f of files) {
      const fp = path.join(dir, f);
      if (fs.existsSync(fp)) out += fs.readFileSync(fp, 'utf8');
    }
    res.writeHead(200, {
      'Content-Type': 'application/x-ndjson',
      'Content-Disposition': 'attachment; filename=\"apd-ledger-export.jsonl\"',
      'Access-Control-Allow-Origin': '*',
    });
    return res.end(out || '{}\n');
  }
  if (req.method === 'GET' && req.url === '/support/queue') {
    const fs = require('fs');
    const path = require('path');
    const dir = process.env.APD_LEDGER_DIR || path.join(process.cwd(), '.apd-ledger');
    let tickets = [];
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter((n) => n.endsWith('.jsonl'));
      for (const f of files) {
        const lines = fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const row = JSON.parse(line);
            if (row.event === 'support_ticket' || (row.type === 'support_ticket' && row.ok === true)) {
              tickets.push({
                id: row.id || null,
                email: row.email || null,
                subject: row.subject || null,
                source: row.source || null,
                confirm: row.confirm === true,
                ts: row.ts || null,
                charged: false,
              });
            }
          } catch (e) { /* skip bad line */ }
        }
      }
    }
    return send(res, 200, {
      ok: true,
      dry_run: true,
      live_charges: false,
      count: tickets.length,
      recent: tickets.slice(-20).reverse(),
      note: 'dry-run support queue. never charges. confirm=true enforced on agent source.',
    });
  }
  if (req.method !== 'POST') return send(res, 404, { error: 'not found' });

  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    let body = {};
    try { body = JSON.parse(Buffer.concat(chunks).toString() || '{}'); }
    catch (err) { return send(res, 400, { error: 'invalid json' }); }

    if (req.url === '/quote') {
      const source = body.source || 'website';
      if (source === 'agent' && body.confirm !== true) {
        return send(res, 403, { error: 'agent orders require confirm=true' });
      }
      const items = Array.isArray(body.items) ? body.items : [];
      if (items.length === 0) return send(res, 400, { error: 'items array required' });
      const lines = [];
      let total = 0;
      for (const row of items) {
        const sku = String(row.sku || '');
        const qty = Number(row.quantity || 1);
        const cat = CATALOG.find((c) => c.sku === sku);
        if (!cat || !Number.isInteger(qty) || qty < 1 || qty > 99) {
          return send(res, 400, { error: 'invalid sku or quantity' });
        }
        const line_cents = cat.amount_cents * qty;
        total += line_cents;
        lines.push({ sku, name: cat.name, quantity: qty, unit_cents: cat.amount_cents, line_cents });
      }
      const id = 'qt_dry_' + crypto.randomBytes(6).toString('hex');
      const quote = {
        id,
        dry_run: true,
        charged: false,
        currency: 'aud',
        source,
        confirm: body.confirm === true,
        lines,
        total_cents: total,
        note: 'dry-run multi-item quote. Never charges.',
      };
      append('quote_preview', quote);
      return send(res, 200, quote);
    }
    if (req.url === '/create-checkout-session' || req.url === '/agent-order') {
      const order = validate(Object.assign({}, body, req.url === '/agent-order' ? { source: 'agent' } : {}));
      if (order.error) return send(res, order.status, { error: order.error });
      const id = (req.url === '/agent-order' ? 'ord_' : 'cs_dry_') + crypto.randomBytes(6).toString('hex');
      append(req.url === '/agent-order' ? 'agent_order_queued' : 'dry_run_session', Object.assign({ id }, order));
      return send(res, 200, { id, dry_run: true, charged: false, mode: order.mode, url: null });
    }
    if (req.url === '/credit-note') {
      const note = buildCreditNote(body, CATALOG);
      if (note.error) return send(res, note.status, { error: note.error });
      const id = 'cn_dry_' + crypto.randomBytes(6).toString('hex');
      const row = append('credit_note_preview', Object.assign({ id }, note));
      return send(res, 200, { ok: true, id, charged: false, refunded: false, stripe_refund: false, row });
    }
    if (req.url === '/invoice-preview') {
      const order = validate(body);
      if (order.error) return send(res, order.status, { error: order.error });
      const id = 'inv_dry_' + crypto.randomBytes(6).toString('hex');
      const row = append('invoice_preview', Object.assign({ id, charged: false }, order));
      return send(res, 200, { ok: true, id, dry_run: true, charged: false, amount_cents: order.amount_cents, row });
    }
    if (req.url === '/support-ticket') {
      const source = body.source || 'website';
      if (source === 'agent' && body.confirm !== true) {
        return send(res, 403, { error: 'agent support tickets require confirm=true' });
      }
      if (!body.email || !body.subject) return send(res, 400, { error: 'email and subject required' });
      const id = 'sup_dry_' + crypto.randomBytes(6).toString('hex');
      const row = append('support_ticket', {
        id,
        email: String(body.email).slice(0, 200),
        subject: String(body.subject).slice(0, 200),
        body: body.body ? String(body.body).slice(0, 1000) : null,
        source,
        confirm: body.confirm === true,
        charged: false,
      });
      return send(res, 200, { ok: true, id, charged: false, queued: true, row });
    }
    if (req.url === '/intake') {
      if (body.source === 'agent' && body.confirm !== true) {
        return send(res, 403, { error: 'agent orders require confirm=true' });
      }
      if (!body.name || !body.email || !body.need) return send(res, 400, { error: 'name, email, and need required' });
      const row = append('consult_intake_fallback', {
        name: String(body.name).slice(0, 120),
        email: String(body.email).slice(0, 200),
        need: String(body.need).slice(0, 4000),
        charged: false,
      });
      return send(res, 200, { ok: true, charged: false, queued: true, row });
    }
    if (req.url === '/dry-run/settle') {
      if (!body.session_id) return send(res, 400, { error: 'session_id required' });
      const row = append('dry_run_settled', { session_id: String(body.session_id).slice(0, 80), note: 'local settle only' });
      return send(res, 200, { ok: true, charged: false, row });
    }
    if (req.url === '/queue/process') {
      const items = Array.isArray(body.items) ? body.items : [];
      if (items.length === 0) return send(res, 400, { error: 'items array required' });
      const results = [];
      for (const item of items) {
        const source = item.source || 'website';
        const type = item.type || 'order';
        if (source === 'agent' && item.confirm !== true) {
          const refused = {
            ok: false,
            status: 'refused',
            reason: 'agent orders require confirm=true',
            charged: false,
            type,
            source,
          };
          append('queue_refused', refused);
          results.push(refused);
          continue;
        }
        let processed;
        if (type === 'consult_intake') {
          if (!item.email || !item.need) {
            processed = { ok: false, status: 'invalid', reason: 'consult_intake requires email and need', charged: false, type, source };
          } else {
            processed = {
              ok: true, status: 'queued', type: 'consult_intake',
              id: 'int_' + crypto.randomBytes(4).toString('hex'),
              email: String(item.email).slice(0, 200),
              name: item.name ? String(item.name).slice(0, 120) : null,
              need: String(item.need).slice(0, 500),
              source, confirm: item.confirm === true, charged: false, mode: 'dry_run',
            };
          }
        } else if (type === 'support_ticket') {
          if (!item.email || !item.subject) {
            processed = { ok: false, status: 'invalid', reason: 'support_ticket requires email and subject', charged: false, type, source };
          } else {
            processed = {
              ok: true, status: 'queued', type: 'support_ticket',
              id: 'sup_' + crypto.randomBytes(4).toString('hex'),
              email: String(item.email).slice(0, 200),
              subject: String(item.subject).slice(0, 200),
              body: item.body ? String(item.body).slice(0, 1000) : null,
              source, confirm: item.confirm === true, charged: false, mode: 'dry_run',
            };
          }
        } else if (type === 'invoice_preview' || type === 'subscription_preview') {
          processed = {
            ok: true, status: 'preview', type,
            id: (type === 'subscription_preview' ? 'sub_' : 'inv_') + crypto.randomBytes(4).toString('hex'),
            sku: item.sku || null,
            amount_cents: item.amount_cents || null,
            source, confirm: item.confirm === true, charged: false, billed: false, mode: 'dry_run',
          };
        } else if (type === 'fulfillment') {
          if (!item.order_id) {
            processed = { ok: false, status: 'invalid', reason: 'fulfillment requires order_id', charged: false, type, source };
          } else {
            processed = {
              ok: true, status: 'queued', type: 'fulfillment',
              id: 'ful_' + crypto.randomBytes(4).toString('hex'),
              order_id: String(item.order_id).slice(0, 80),
              source, confirm: item.confirm === true, charged: false, mode: 'dry_run',
            };
          }
        } else {
          // default order
          const amount = Number(item.amount_cents);
          if (!Number.isInteger(amount) || amount < 100) {
            processed = { ok: false, status: 'invalid', reason: 'amount_cents must be integer >= 100', charged: false, type, source };
          } else {
            processed = {
              ok: true, status: 'queued', type: 'order',
              id: 'q_' + crypto.randomBytes(4).toString('hex'),
              sku: item.sku || null,
              amount_cents: amount,
              source, confirm: item.confirm === true, charged: false, mode: 'dry_run',
            };
          }
        }
        if (processed.ok) append('queue_processed', processed);
        else append('queue_refused', processed);
        results.push(processed);
      }
      const summary = {
        total: results.length,
        queued: results.filter((r) => r.ok && r.status === 'queued').length,
        previews: results.filter((r) => r.ok && r.status === 'preview').length,
        refused: results.filter((r) => !r.ok).length,
        charged: 0,
        live_charges: false,
      };
      return send(res, 200, {
        ok: true,
        summary,
        results,
        note: 'dry-run queue process. confirm=true gate applied. never charges.',
      });
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
