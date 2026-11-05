# Development status — 2026-11-06 09:42 AEDT Teegan continue

Operator request: continue windsorroyalapps/ai-pharma-developments without live charges. Skills used: apd-gcp-access, gcloud, payment-api, stripe, stripe-full.

## GCP status
- Google Cloud SDK 592.0.0 installed in sandbox.
- `gcloud auth list`: No credentialed accounts.
- Project unset.
- No IAM mutations performed. Bootstrap not run. No project ID invented.
- Auth login URL (operator must complete on controlled machine and reply with PROJECT_ID only; do not paste verification code):

https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=eJ8s8tVpF5lYE7uvb5XpsTkZYhI1fJ&prompt=consent&token_usage=remote&access_type=offline&code_challenge=J66F2ruwXF-5GULTyRAREUHr-Dx0f81N7TfaiO89WBI&code_challenge_method=S256

Least privilege plan remains: apd-payment-sa (secretAccessor, logWriter, run.invoker), apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.builds.editor, serviceAccountUser), WIF pool github-apd bound only to windsorroyalapps/ai-pharma-developments, region australia-southeast1.

## Site / automation features (no live keys)
- Agent orders: POST /create-checkout-session and /agent-order refuse unless confirm=true (source=agent). Intake and queue processor enforce the same. Charged remains false in dry-run.
- Secrets: names only in code and docs (stripe-secret-key, stripe-webhook-secret, stripe-publishable-key). No keys or identity documents committed.
- Dry-run worker, ledger JSONL, process-queue.js (handles order, consult_intake, invoice_preview, subscription_preview, fulfillment), credit notes, invoice preview all operational without Stripe.
- Readiness board and status pages reflect blockers.

## Blocked on operator
- GCP login + set PROJECT_ID (reply with id only).
- Then bootstrap.sh, apply-after-auth.sh, set GitHub Actions vars.
- Stripe test key versions in Secret Manager (after login).
- Stripe identity verification before any live keys or charges. Explicit "live" confirmation required.

All features remain dry-run. No live charges.
