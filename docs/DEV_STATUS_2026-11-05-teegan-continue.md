# Development status — 2026-11-05 22:45 UTC Teegan continue

Operator request: continue windsorroyalapps/ai-pharma-developments. Skills: apd-gcp-access, gcloud, payment-api, stripe, stripe-full.

## GCP status
- Google Cloud SDK 592.0.0 installed in sandbox.
- `gcloud auth list`: No credentialed accounts.
- Project unset. No project ID invented.
- IAM mutations stopped. bootstrap.sh not run.
- Auth login URL (complete on controlled machine, reply with PROJECT_ID only; never paste verification code, keys, or ID docs):

https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=qxKqCnOiUbdtGUJoRl4lZHKHgAVaHH&prompt=consent&token_usage=remote&access_type=offline&code_challenge=trLPXVkWe9jSYfCrDNqA5hu6aDP7aiNhCyTF9DhqEd4&code_challenge_method=S256

Least privilege remains: apd-payment-sa (secretAccessor, logWriter, run.invoker), apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.builds.editor, serviceAccountUser), WIF github-apd bound only to this repo, region australia-southeast1.

## Changes this cycle (non-secret, dry-run)
- Fixed syntax error in `cloud/automation/process-queue.js` (support_ticket was nested inside subscription_preview). All types now correct: order, consult_intake, support_ticket, invoice_preview, subscription_preview, fulfillment. Agent rows still require confirm=true; charged always false.
- Extended `cloud/automation/sample-queue.json` with a fulfillment dry-run item.
- No secrets, no Stripe keys, no ID documents stored or committed.

## Site features (no live charges)
- Checkout / pay.html, local ledger, confirm=true gate
- Consult intake (local fallback + /intake)
- Order ledger, credit notes, invoice/subscription preview
- Cloud Run worker dry-run mode + readiness endpoints
- process-queue.js + local automation tools

## Blocked on operator
1. Complete gcloud auth login (URL above) on your machine.
2. Reply with GCP_PROJECT_ID only.
3. Then bootstrap + GitHub Actions vars.
4. Stripe test keys into Secret Manager after auth.
5. Stripe identity verification before any live mode.

All features remain dry-run. Charged = 0.
