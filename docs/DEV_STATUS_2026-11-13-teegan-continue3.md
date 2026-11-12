# Development status — 2026-11-13 Teegan continue3 (dry-run + auth blocker)

## GCP
- gcloud SDK present in sandbox.
- `gcloud auth list` → no credentialed accounts. Project unset.
- Did not mutate IAM, did not invent PROJECT_ID, did not run bootstrap.sh or apply-after-auth.sh.
- Operator login URL generated (sandbox cannot complete interactive code entry):
  https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform&state=...&prompt=consent&access_type=offline&code_challenge=...
- After login on operator machine: `gcloud config set project PROJECT_ID` then `bash cloud/iam/bootstrap.sh` then `bash cloud/automation/apply-after-auth.sh`.
- Least-privilege: apd-payment-sa (secretAccessor, logWriter, run.invoker), apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.builds.editor, serviceAccountUser), WIF pool github-apd bound only to windsorroyalapps/ai-pharma-developments, region australia-southeast1.

## Stripe / payments
- No live charges. Dry-run enforced. Secrets remain names only: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key.
- Agent orders require confirm=true or refused (worker, dry-run-server, process-queue, tools).
- Never commit keys or identity documents.

## Site / automation
- Existing dry-run queue, invoice preview, consult intake, credit notes, support tickets, quote, ledger all functional without keys.
- Status pages and readiness endpoints report current blockers.

## Blocked on operator
1. GCP login + PROJECT_ID reply.
2. Stripe identity verification before any live keys.
3. Explicit confirmation before live charges.

Dry-run only until those steps.
