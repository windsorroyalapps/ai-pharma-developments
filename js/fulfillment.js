(() => {
  const KEY = 'apd_fulfillment_queue';
  const form = document.querySelector('#fulfill-form');
  const ledger = document.querySelector('#ledger');
  const sku = document.querySelector('#sku');
  const status = form?.querySelector('[data-form-status]');

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  }
  function save(rows) {
    localStorage.setItem(KEY, JSON.stringify(rows.slice(-50)));
  }
  function render() {
    const rows = load();
    if (ledger) ledger.textContent = rows.length ? rows.map((r) => JSON.stringify(r)).join('\n') : 'Queue empty.';
  }

  (window.APD_CATALOG || []).forEach((item) => {
    const opt = document.createElement('option');
    opt.value = item.sku;
    opt.textContent = item.name + ' — $' + (item.amount_cents / 100).toFixed(2) + ' AUD';
    opt.dataset.cents = String(item.amount_cents);
    sku?.appendChild(opt);
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const selected = sku?.selectedOptions[0];
    const source = String(data.get('source') || 'website');
    const confirm = data.get('confirm') === 'on';
    if (source === 'agent' && !confirm) {
      if (status) status.textContent = 'Refused: agent orders require confirm=true. Not charged.';
      return;
    }
    const row = {
      ts: new Date().toISOString(),
      id: 'ord_' + Math.random().toString(16).slice(2, 14),
      sku: String(data.get('sku') || ''),
      amount_cents: Number(selected?.dataset.cents || 0),
      currency: 'aud',
      email: String(data.get('email') || ''),
      source,
      confirm,
      note: String(data.get('note') || ''),
      status: 'queued',
      charged: false,
      mode: 'dry_run',
    };
    const rows = load();
    rows.push(row);
    save(rows);
    if (status) status.textContent = 'Queued ' + row.id + '. charged=false.';
    form.reset();
    render();
  });

  document.querySelector('#export')?.addEventListener('click', () => {
    const blob = new Blob([load().map((r) => JSON.stringify(r)).join('\n') + '\n'], { type: 'application/jsonl' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'apd-fulfillment.jsonl';
    a.click();
  });
  document.querySelector('#clear')?.addEventListener('click', () => {
    localStorage.removeItem(KEY);
    render();
  });
  render();
})();
