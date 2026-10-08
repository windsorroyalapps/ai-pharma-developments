/** Shared dry-run credit note validator. Never calls Stripe refunds. */
function buildCreditNote(body, catalog) {
  const blob = JSON.stringify(body || {});
  if (/sk_(live|test)_|pk_live_|whsec_/.test(blob)) {
    return { error: 'do not send secrets in the request body', status: 400 };
  }
  const source = body.source || 'website';
  if (source === 'agent' && body.confirm !== true) {
    return { error: 'agent credit notes require confirm=true', status: 403 };
  }
  const sku = String(body.sku || '');
  const item = (catalog || []).find((row) => row.sku === sku);
  if (!item) return { error: 'unknown sku', status: 400 };
  const amount = Number(body.amount_cents);
  if (!Number.isInteger(amount) || amount < 100 || amount > item.amount_cents) {
    return { error: 'amount_cents must be an integer from 100 to the catalog amount', status: 400 };
  }
  const currency = String(body.currency || 'aud').toLowerCase();
  if (currency !== 'aud') return { error: 'currency must be aud', status: 400 };
  return {
    sku: item.sku,
    name: item.name,
    amount_cents: amount,
    currency,
    reason: String(body.reason || 'preview adjustment').slice(0, 240),
    related_invoice: body.related_invoice ? String(body.related_invoice).slice(0, 80) : null,
    source,
    confirm: body.confirm === true,
    charged: false,
    refunded: false,
    stripe_refund: false,
  };
}

const CATALOG = [
  { sku: 'consult-30', name: 'Discovery consult (30 min)', amount_cents: 15000 },
  { sku: 'scoping', name: 'Automation scoping pack', amount_cents: 45000 },
  { sku: 'support', name: 'Patient-support workflow setup', amount_cents: 25000 },
  { sku: 'careflow-setup', name: 'Careflow intake automation setup', amount_cents: 35000 },
  { sku: 'retainer', name: 'Research support retainer (monthly)', amount_cents: 100000 },
  { sku: 'ops-retainer', name: 'Site and payment ops retainer (monthly)', amount_cents: 75000 },
];

module.exports = { buildCreditNote, CATALOG };
