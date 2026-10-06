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

  function render() {
    const rows = read().slice().reverse();
    if (!list) return;
    list.innerHTML = '';
    if (empty) empty.hidden = rows.length > 0;
    rows.forEach((row) => {
      const el = document.createElement('article');
      el.className = 'card';
      el.style.marginTop = '0.75rem';
      const id = row.id || 'n/a';
      const amount = row.amount_aud != null ? row.amount_aud + ' AUD' : 'amount unset';
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
  render();
})();
