(function () {
  var select = document.getElementById('sku');
  var preview = document.getElementById('preview');
  var status = document.getElementById('status');
  var rows = [];
  (window.APD_CATALOG || []).forEach(function (item) {
    var opt = document.createElement('option');
    opt.value = item.sku;
    opt.textContent = item.name + ' — $' + (item.amount_cents / 100).toFixed(2) + ' AUD';
    opt.dataset.cents = String(item.amount_cents);
    opt.dataset.mode = item.mode;
    select.appendChild(opt);
  });
  function render() {
    preview.textContent = rows.map(function (row) { return JSON.stringify(row); }).join('\n');
  }
  document.getElementById('quote-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var option = select.options[select.selectedIndex];
    var source = document.getElementById('source').value;
    var confirm = document.getElementById('confirm').checked;
    if (source === 'agent' && !confirm) {
      status.textContent = 'Refused: agent quotes require confirm=true. No charge was created.';
      return;
    }
    var row = {
      sku: option.value,
      amount_cents: Number(option.dataset.cents),
      currency: 'aud',
      mode: option.dataset.mode,
      email: document.getElementById('email').value,
      source: source,
      note: document.getElementById('note').value,
      confirm: confirm,
      dry_run: true,
      created_at: new Date().toISOString()
    };
    rows.push(row);
    status.textContent = 'Queued dry-run row. Stripe was not called.';
    render();
  });
  document.getElementById('download').addEventListener('click', function () {
    var blob = new Blob([rows.map(function (row) { return JSON.stringify(row); }).join('\n') + (rows.length ? '\n' : '')], { type: 'application/x-ndjson' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'apd-quotes.jsonl';
    link.click();
  });
})();
