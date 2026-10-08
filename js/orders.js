(() => {
  const list = document.getElementById('orders-list');
  const empty = document.getElementById('orders-empty');
  const clearBtn = document.getElementById('orders-clear');
  const exportBtn = document.getElementById('orders-export');
  const key = 'apd_ledger';

  function read() {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch (e) { return []; }
  }

  function totals(rows) {
    const cents = rows.reduce((sum, row) => sum + (Number.isInteger(row.amount_cents) ? row.amount_cents : Math.round(Number(row.amount_aud || 0) * 100)), 0);
    return { count: rows.length, aud: (cents / 100).toFixed(2), charged: 0 };
  }

  function render() {
    const rows = read().slice().reverse();
    if (!list) return;
    list.innerHTML = '';
    if (empty) empty.hidden = rows.length > 0;
    const summary = document.getElementById('orders-summary');
    const t = totals(read());
    if (summary) summary.textContent = t.count + ' rows · ' + t.aud + ' AUD preview · charged: 0';
    rows.forEach((row) => {
      const el = document.createElement('article');
      el.className = 'card';
      el.style.marginTop = '0.75rem';
      const id = row.id || 'n/a';
      const amount = row.amount_aud != null ? row.amount_aud + ' AUD' : (row.amount_cents != null ? (row.amount_cents / 100).toFixed(2) + ' AUD' : 'amount unset');
      const confirmed = row.confirm === true ? 'confirm=true' : 'confirm missing';
      el.innerHTML = '<strong>' + id + '</strong><p>' +
        (row.description || row.event || 'dry-run') + ' · ' + amount +
        '</p><p>charged: false · ' + confirmed + ' · ' + (row.ts || '') + '</p>';
      list.appendChild(el);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem(key);
      render();
    });
  }
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const lines = read().map((row) => JSON.stringify(Object.assign({}, row, { charged: false }))).join('\n');
      const blob = new Blob([lines + (lines ? '\n' : '')], { type: 'application/x-ndjson' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'apd-ledger-dry-run.jsonl';
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }
  const importInput = document.getElementById('orders-import');
  if (importInput) {
    importInput.addEventListener('change', () => {
      const file = importInput.files && importInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const rows = read();
        String(reader.result || '').split(/\r?\n/).filter(Boolean).forEach((line) => {
          try {
            const row = JSON.parse(line);
            if (/sk_(live|test)_|whsec_/.test(JSON.stringify(row))) return;
            row.charged = false;
            rows.push(row);
          } catch (err) { /* skip bad line */ }
        });
        localStorage.setItem(key, JSON.stringify(rows.slice(-50)));
        render();
      };
      reader.readAsText(file);
    });
  }
  render();
})();
