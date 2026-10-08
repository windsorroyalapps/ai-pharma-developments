(function () {
  var KEY = 'apd_ledger';
  var list = document.getElementById('pay-ledger');
  var summary = document.getElementById('pay-ledger-summary');
  if (!list || !summary) return;

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }

  function render() {
    var rows = load().filter(function (row) {
      return !/sk_(live|test)_|whsec_/.test(JSON.stringify(row || {}));
    });
    var charged = rows.filter(function (row) { return row.charged === true; }).length;
    summary.textContent = rows.length + ' local rows · charged ' + charged + ' · dry-run only';
    list.textContent = rows.length ? JSON.stringify(rows.slice(-12), null, 2) : 'No local ledger rows yet.';
  }

  window.apdRecordLedger = function (record) {
    var rows = load();
    rows.push(Object.assign({ ts: new Date().toISOString(), charged: false }, record, { charged: false }));
    localStorage.setItem(KEY, JSON.stringify(rows.slice(-50)));
    render();
  };

  document.addEventListener('apd-ledger-updated', render);

  var exportBtn = document.getElementById('pay-ledger-export');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      var lines = load().map(function (row) {
        return JSON.stringify(Object.assign({}, row, { charged: false }));
      }).join('\n');
      var blob = new Blob([lines + (lines ? '\n' : '')], { type: 'application/x-ndjson' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'apd-pay-ledger.jsonl';
      a.click();
    });
  }

  var clearBtn = document.getElementById('pay-ledger-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      localStorage.removeItem(KEY);
      render();
    });
  }

  render();
})();
