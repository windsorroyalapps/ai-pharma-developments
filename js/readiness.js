/** Operator readiness board. Names only. No secret values. */
(function () {
  var board = {
    live_charges: false,
    confirm_gate: true,
    checked_at: '2026-10-09T10:16:00+10:00',
    secret_names: ['stripe-secret-key', 'stripe-webhook-secret', 'stripe-publishable-key'],
    github_actions_vars: ['GCP_PROJECT_ID', 'GCP_REGION', 'GCP_WIF_PROVIDER', 'GCP_DEPLOY_SA'],
    blockers: [
      'gcloud auth: no credentialed account in this sandbox; project unset',
      'GitHub Actions vars unset until bootstrap: GCP_PROJECT_ID, GCP_REGION, GCP_WIF_PROVIDER, GCP_DEPLOY_SA',
      'Secret Manager versions missing: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key'
    ]
  };
  var list = document.getElementById('blocker-list');
  var live = document.getElementById('live-line');
  if (!list || !live) return;
  board.blockers.forEach(function (item) {
    var li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
  live.textContent = 'live_charges=' + board.live_charges + '; agent checkout requires confirm=true; region default australia-southeast1.';
})();
