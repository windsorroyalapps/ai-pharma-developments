(() => {
  const STRIPE_PK = window.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';
  const CREATE_SESSION_URL = window.CREATE_CHECKOUT_SESSION_URL || '';
  const PLACEHOLDER = !CREATE_SESSION_URL || CREATE_SESSION_URL.indexOf('YOUR-CLOUD-RUN-URL') !== -1;

  const form = document.getElementById('pay-form');
  const toast = document.getElementById('pay-toast');
  const stripeBtn = document.getElementById('stripe-pay-button');
  const modeEl = document.getElementById('pay-mode');

  function showToast(msg, ok = true) {
    if (!toast) return;
    toast.textContent = msg;
    toast.style.borderColor = ok ? 'rgba(166, 240, 198, 0.35)' : 'rgba(255, 123, 138, 0.45)';
    toast.style.color = ok ? 'var(--accent)' : 'var(--danger)';
    toast.classList.add('show');
  }

  if (modeEl) {
    if (PLACEHOLDER) modeEl.textContent = 'LOCAL DRY-RUN (no Cloud Run yet)';
    else if (STRIPE_PK.indexOf('pk_live_') === 0) modeEl.textContent = 'LIVE (Stripe)';
    else modeEl.textContent = 'TEST (Stripe)';
  }

  function selectedSku() {
    const sel = document.getElementById('sku');
    const sku = sel ? sel.value : '';
    const item = (window.APD_CATALOG || []).find((row) => row.sku === sku);
    return item || null;
  }

  function localDryRun(amount, description, email, mode, sku) {
    const id = 'cs_local_' + Math.random().toString(16).slice(2, 10);
    const record = {
      event: 'local_dry_run',
      id,
      amount_aud: amount,
      description,
      email,
      mode,
      sku,
      ts: new Date().toISOString(),
      charged: false,
    };
    if (window.apdRecordLedger) window.apdRecordLedger(record);
    else {
      try {
        const key = 'apd_ledger';
        const prev = JSON.parse(localStorage.getItem(key) || '[]');
        prev.push(record);
        localStorage.setItem(key, JSON.stringify(prev.slice(-50)));
      } catch (e) {
        console.warn(e);
      }
    }
    document.dispatchEvent(new Event('apd-ledger-updated'));
    showToast('Dry-run only. No charge. ' + mode + ' session ' + id + '.');
  }

  async function createCheckoutSession() {
    if (form && !form.reportValidity()) return;

    const skuItem = selectedSku();
    const amount = skuItem ? skuItem.amount_cents / 100 : parseFloat(document.getElementById('amount')?.value || '0');
    const description = skuItem ? skuItem.name : (document.getElementById('description')?.value || 'AI Pharma Developments services');
    const email = document.getElementById('email')?.value || '';
    const mode = skuItem && String(skuItem.mode).indexOf('subscription') === 0 ? 'subscription' : 'payment';

    if (amount < 1) {
      showToast('Minimum amount is 1.00 AUD', false);
      return;
    }

    if (PLACEHOLDER) {
      localDryRun(amount, description, email, mode, skuItem ? skuItem.sku : null);
      return;
    }

    showToast('Creating secure Stripe Checkout session…');

    try {
      const res = await fetch(CREATE_SESSION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount_cents: Math.round(amount * 100),
          currency: 'aud',
          description,
          customer_email: email,
          mode,
          sku: skuItem ? skuItem.sku : undefined,
          success_url: window.location.origin + '/pay.html?success=1',
          cancel_url: window.location.origin + '/pay.html?canceled=1',
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || res.statusText);
      }

      const data = await res.json();
      if (data.dry_run) {
        const record = { event: 'worker_dry_run', id: data.id, amount_aud: amount, description, email, mode, sku: skuItem ? skuItem.sku : null, charged: false };
        if (window.apdRecordLedger) window.apdRecordLedger(record);
        document.dispatchEvent(new Event('apd-ledger-updated'));
        showToast('Worker dry-run. No charge. Session ' + data.id);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.id && window.Stripe && STRIPE_PK.indexOf('pk_') === 0 && STRIPE_PK.indexOf('placeholder') === -1) {
        const stripe = Stripe(STRIPE_PK);
        const result = await stripe.redirectToCheckout({ sessionId: data.id });
        if (result.error) throw result.error;
        return;
      }
      throw new Error('No checkout URL or session id returned');
    } catch (err) {
      console.error(err);
      showToast('Checkout error: ' + (err.message || err) + '. Backend may be offline.', false);
    }
  }

  if (stripeBtn) {
    stripeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      createCheckoutSession();
    });
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === '1' && params.get('dry_run') === '1') {
    showToast('Dry-run session ' + (params.get('session') || '') + '. No charge.');
  } else if (params.get('success') === '1') {
    showToast('Payment successful. Receipt will arrive by email.');
  } else if (params.get('canceled') === '1') {
    showToast('Checkout canceled.', false);
  }
})();
