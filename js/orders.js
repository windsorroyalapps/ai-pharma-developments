(() => {
  const list = document.getElementById('orders-list');
  const empty = document.getElementById('orders-empty');
  const clearBtn = document.getElementById('orders-clear');
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
      el.innerHTML = '<strong>' + id + '</strong><p>' +
        (row.description || row.event || 'dry-run') + ' · ' + amount +
        '</p><p>charged: false · ' + (row.ts || '') + '</p>';
      list.appendChild(el);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem(key);
      render();
    });
  }
  render();
})();
