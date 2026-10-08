/** Local credit-note drafts. Never calls Stripe. Agent rows need confirm=true. */
(function () {
  var KEY = 'apd_credit_notes';
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch (err) { return []; }
  }
  function save(rows) {
    localStorage.setItem(KEY, JSON.stringify(rows.slice(-40)));
  }
  function catalogItem(sku) {
    return (window.APD_CATALOG || []).filter(function (row) { return row.sku === sku; })[0] || null;
  }
  window.APDCreditNotes = {
    list: load,
    draft: function (input) {
      var item = catalogItem(input.sku);
      if (!item) return { error: 'unknown sku' };
      var amount = Number(input.amount_cents);
      if (!Number.isInteger(amount) || amount < 100 || amount > item.amount_cents) {
        return { error: 'amount must be an integer from 100 to the catalog amount' };
      }
      if (input.source === 'agent' && input.confirm !== true) {
        return { error: 'agent credit notes require confirm=true' };
      }
      var blob = JSON.stringify(input);
      if (/sk_(live|test)_|pk_live_|whsec_/.test(blob)) return { error: 'do not paste secrets' };
      var note = {
        id: 'cn_local_' + Date.now().toString(36),
        sku: item.sku,
        name: item.name,
        amount_cents: amount,
        currency: 'aud',
        reason: String(input.reason || 'preview adjustment').slice(0, 240),
        related_invoice: String(input.related_invoice || '').slice(0, 80) || null,
        source: input.source === 'agent' ? 'agent' : 'website',
        confirm: input.confirm === true,
        charged: false,
        refunded: false,
        stripe_refund: false
      };
      var rows = load();
      rows.push(note);
      save(rows);
      return note;
    }
  };
})();
