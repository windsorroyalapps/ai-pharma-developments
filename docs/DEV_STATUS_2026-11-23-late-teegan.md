# DEV STATUS 2026-11-23 late — Teegan

## GCP Access
- gcloud SDK installed in sandbox (594.0.1).
- No active account. Operator must run:
  gcloud auth login --no-launch-browser
- After auth + PROJECT_ID set, run cloud/iam/bootstrap.sh then cloud/automation/apply-after-auth.sh.
- Privileges: least-privilege as documented in cloud/iam/PRIVILEGES.md (apd-payment-sa runtime, apd-deploy-sa deploy + WIF).
- Secrets: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key (names only; values after test keys).

## Payments / Stripe
- Skills payment-api, stripe, stripe-full already complete. No new skill required.
- Dry-run fully operational on pay.html + cloud/worker.
- Live blocked until operator supplies Stripe ID verification docs + explicit live confirmation.
- Agent rule enforced: confirm=true required for any Checkout Session.

## Site features (continued without auth)
- All local automation, ledgers, readiness, catalog, orders ready.
- Continue expanding dry-run hooks and previews.

## Next
1. Operator authenticates gcloud and provides PROJECT_ID.
2. Bootstrap IAM + WIF.
3. Add test secret versions.
4. Deploy worker, set GitHub Actions vars (GCP_PROJECT_ID, GCP_REGION, GCP_WIF_PROVIDER, GCP_DEPLOY_SA).
5. Update pay.html with real Cloud Run URL + pk_test_.
6. ID docs for Stripe live later.

Background: Teegan avatar 3D automation skill active (HF video gen ready).
