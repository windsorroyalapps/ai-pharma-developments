/** Operator readiness board. Names only. No secret values. */
(function () {
  var board = {
    live_charges: false,
    confirm_gate: true,
    checked_at: '2026-11-27T09:35:00+11:00',
    secret_names: ['stripe-secret-key', 'stripe-webhook-secret', 'stripe-publishable-key'],
    github_actions_vars: ['GCP_PROJECT_ID', 'GCP_REGION', 'GCP_WIF_PROVIDER', 'GCP_DEPLOY_SA'],
    blockers: [
      'gcloud not installed on PATH in current sandbox. No active account. Project unset. IAM not mutated. Login required on controlled machine.',
      'Authenticate: gcloud auth login --no-launch-browser then reply with PROJECT_ID only. Do not invent IDs.',
      'GitHub Actions vars unset: GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA',
      'Secret Manager versions missing: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key (test keys only after operator pastes).',
      'Stripe Dashboard identity verification still required before any live keys. Do not store ID documents in git or skills.'
    ],
    dry_run_ready: ['support_queue', 'ledger', 'checkout_gate', 'agent_confirm_true']
  };
  var list = document.getElementById('blocker-list');
  var live = document.getElementById('live-line');
  if (!list || !live) return;
  board.blockers.forEach(function (item) {
    var li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
  live.textContent = 'Checked ' + board.checked_at + '. live_charges=' + board.live_charges + '. Agent checkout refuses unless confirm=true. Region default australia-southeast1. Dry-run support queue, ledger, invoice preview, consult intake, checkout gate ready. No live charges. GCP auth still required.';
})();
