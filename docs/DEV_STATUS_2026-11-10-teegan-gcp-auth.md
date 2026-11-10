# DEV STATUS 2026-11-10 — Teegan GCP Auth Gate

## Status
- gcloud SDK installed in sandbox (592.0.0).
- No active account. Project unset.
- Bootstrap blocked until operator authenticates.

## Login required
Operator must run on controlled machine:
```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project PROJECT_ID
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```

## Until Stripe ID docs
- Site features continue in test/dry-run mode.
- Payment skills (stripe, stripe-full, payment-api) already present.
- Agent orders require confirm=true.
- No live charges.

## Next after auth
1. Run bootstrap → creates apd-payment-sa, apd-deploy-sa, WIF pool github-apd, secrets stubs.
2. Set GitHub Actions vars: GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA.
3. Deploy worker, add test keys to Secret Manager.
4. Switch pay.html placeholders to real URLs/keys.

## Automation
Site automation features (ledger, scheduler stubs, fulfillment hooks) ready for post-auth wiring.
