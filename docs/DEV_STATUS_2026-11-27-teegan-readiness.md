# Development status — 2026-11-27 Teegan readiness probe

Operator request: continue windsorroyalapps/ai-pharma-developments for aipharmadevelopments.com. Review repo, payment worker, Stripe test-mode readiness, GCP least-privilege docs. Implement only small site or automation features that do not require live Stripe keys or gcloud auth. Never store secrets or ID documents. Agent checkout must require confirm=true. Do not grant Owner or Editor. Summarize blockers.

## Review summary
- Static site + Cloud Run worker architecture confirmed.
- Worker (cloud/worker/index.js) enforces confirm=true for agent source; dry-run sessions when keys absent or live without LIVE_OK; readiness reports blockers; live_charges:false.
- GCP least-privilege documented in cloud/iam/PRIVILEGES.md (apd-payment-sa minimal roles; apd-deploy-sa deploy roles; WIF; no Owner/Editor).
- Stripe test-mode code-ready (placeholders, FORCE_DRY). Live gated on identity verification.

## Sandbox GCP status
- gcloud SDK 594.0.1 installed.
- auth list empty. Project unset. Zero mutations. No project ID invented.

## Small features this session
- This readiness status document.
- Branch teegan/dry-run-readiness-2026-11-27 for operator review.
- All existing dry-run paths (checkout, ledger, intake, credit-note, invoice-preview) remain active and charged:false.

## Blockers
1. gcloud auth required: `gcloud auth login --no-launch-browser` then application-default on operator machine. Then set real PROJECT_ID and region australia-southeast1.
2. GitHub Actions vars (after bootstrap): GCP_PROJECT_ID, GCP_REGION, GCP_WIF_PROVIDER, GCP_DEPLOY_SA.
3. Stripe test keys as Secret Manager versions: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key.

Live charges stay blocked. Agent checkout requires confirm=true. No secrets or ID documents stored.

## After auth
```bash
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
# add test key versions only
```

No IAM changes performed. No live keys.
