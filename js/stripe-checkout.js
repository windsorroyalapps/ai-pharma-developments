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

  function localDryRun(amount, description, email) {
    const id = 'cs_local_' + Math.random().toString(16).slice(2, 10);
    const record = {
      event: 'local_dry_run',
      id,
      amount_aud: amount,
      description,
      email,
      ts: new Date().toISOString(),
      charged: false,
    };
    try {
      const key = 'apd_ledger';
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      prev.push(record);
      localStorage.setItem(key, JSON.stringify(prev.slice(-50)));
    } catch (e) {
      console.warn(e);
    }
    showToast('Dry-run only. No charge. Session ' + id + '. Worker URL not set.');
  }

  async function createCheckoutSession() {
    if (form && !form.reportValidity()) return;

    const amount = parseFloat(document.getElementById('amount')?.value || '0');
    const description = document.getElementById('description')?.value || 'AI Pharma Developments services';
    const email = document.getElementById('email')?.value || '';

    if (amount < 1) {
      showToast('Minimum amount is 1.00 AUD', false);
      return;
    }

    if (PLACEHOLDER) {
      localDryRun(amount, description, email);
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
