(() => {
  // Stripe publishable key from env or placeholder (replace with live pk_ when ready)
  const STRIPE_PK = window.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';
  const CREATE_SESSION_URL = window.CREATE_CHECKOUT_SESSION_URL || '/api/create-checkout-session';
  // For static GitHub Pages use full Cloud Run URL once deployed

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

  if (modeEl && STRIPE_PK.startsWith('pk_test')) {
    modeEl.textContent = 'TEST (Stripe)';
  } else if (modeEl) {
    modeEl.textContent = 'LIVE (Stripe)';
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
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.id && window.Stripe) {
        const stripe = Stripe(STRIPE_PK);
        const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
        if (error) throw error;
        return;
      }
      throw new Error('No checkout URL or session id returned');
    } catch (err) {
      console.error(err);
      showToast(`Checkout error: ${err.message || err}. Backend may be offline — use Google Pay test mode.`, false);
    }
  }

  if (stripeBtn) {
    stripeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      createCheckoutSession();
    });
  }

  // Handle success / cancel query params
  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === '1') {
    showToast('Payment successful. Receipt will arrive by email.');
  } else if (params.get('canceled') === '1') {
    showToast('Checkout canceled.', false);
  }
})();
