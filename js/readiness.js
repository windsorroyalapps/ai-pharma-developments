/** Operator readiness board. Names only. No secret values. */
(function () {
  var board = {
    live_charges: false,
    confirm_gate: true,
    checked_at: '2026-11-13T09:20:00+11:00',
    secret_names: ['stripe-secret-key', 'stripe-webhook-secret', 'stripe-publishable-key'],
    github_actions_vars: ['GCP_PROJECT_ID', 'GCP_REGION', 'GCP_WIF_PROVIDER', 'GCP_DEPLOY_SA'],
    blockers: [
      'gcloud auth: no credentialed account (SDK 593 installed in sandbox). Project unset. IAM not mutated. Login still required.',
      'Authenticate on a machine you control with gcloud auth login --no-launch-browser, then reply with PROJECT_ID only. Do not invent project IDs.',
      'GitHub Actions vars unset until bootstrap: GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA',
      'Secret Manager versions missing: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key (test keys only after operator pastes).',
      'Stripe Dashboard identity verification still required before any live keys. Do not store ID documents in git or skills.'
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
  live.textContent = 'Checked ' + board.checked_at + '. live_charges=' + board.live_charges + '. Agent checkout refuses unless confirm=true. Region default australia-southeast1. Dry-run queue processing, invoice preview, consult intake, and least-privilege docs ready. No live charges. GCP auth login still required.';
})();
