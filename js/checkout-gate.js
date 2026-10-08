/**
 * Shared checkout gate for the static site and local tools.
 * Agent-sourced orders require confirm === true. Nothing here charges.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.apdCheckoutGate = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function evaluateCheckout(body) {
    const blob = JSON.stringify(body || {});
    if (/sk_(live|test)_|pk_live_|whsec_/.test(blob)) {
      return { ok: false, status: 400, error: 'do not send secrets in the request body', charged: false };
    }
    const source = body && body.source === 'agent' ? 'agent' : 'website';
    const confirm = body && body.confirm === true;
    if (source === 'agent' && !confirm) {
      return { ok: false, status: 403, error: 'agent orders require confirm=true', charged: false, source, confirm: false };
    }
    const amount = body && body.amount_cents;
    if (!Number.isInteger(amount) || amount < 100) {
      return { ok: false, status: 400, error: 'amount_cents must be integer >= 100', charged: false, source, confirm };
    }
    const currency = String((body && body.currency) || 'aud').toLowerCase();
    if (currency !== 'aud') {
      return { ok: false, status: 400, error: 'currency must be aud until multi-currency is enabled', charged: false, source, confirm };
    }
    return {
      ok: true,
      status: 200,
      charged: false,
      source,
      confirm,
      amount_cents: amount,
      currency,
      dry_run: true,
    };
  }
  return { evaluateCheckout };
});
