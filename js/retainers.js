(() => {
  const form = document.querySelector('#retainer-form');
  const skuSelect = document.querySelector('#sku');
  const status = document.querySelector('#status');
  const preview = document.querySelector('#preview');
  const catalog = (window.APD_CATALOG || []).filter((item) => item.mode === 'subscription_preview');

  catalog.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.sku;
    option.textContent = item.name + ' — A$' + (item.amount_cents / 100).toFixed(2) + '/mo';
    skuSelect.appendChild(option);
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const sku = catalog.find((item) => item.sku === skuSelect.value);
    const months = Number(document.querySelector('#months').value);
    const email = document.querySelector('#email').value.trim();
    const source = document.querySelector('#source').value;
    const confirm = document.querySelector('#confirm').checked;

    if (!sku || !Number.isInteger(months) || months < 1 || months > 12) {
      status.textContent = 'Choose a retainer and 1–12 months.';
      return;
    }
    if (source === 'agent' && !confirm) {
      status.textContent = 'Refused: agent orders require confirm=true.';
      preview.textContent = '';
      return;
    }

    const row = {
      event: 'retainer_preview',
      ts: new Date().toISOString(),
      sku: sku.sku,
      description: sku.name,
      currency: 'aud',
      monthly_cents: sku.amount_cents,
      months,
      preview_total_cents: sku.amount_cents * months,
      email,
      source,
      confirm,
      mode: 'subscription_preview',
      charged: false,
      dry_run: true,
    };
    status.textContent = 'Preview only. No Stripe session and no charge.';
    preview.textContent = JSON.stringify(row, null, 2);
  });
})();
