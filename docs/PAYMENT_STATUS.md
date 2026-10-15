# Payment and GCP status — 2026-10-16 09:10 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required.

Identity documents stay out of git, skills, and chat. Complete Stripe identity verification in the Stripe Dashboard only. Live charges stay blocked until the operator says live and keys are confirmed.

## Blocker

Google Cloud SDK is not present in this sandbox session (`gcloud` command not found). No credentialed accounts. Project is unset. IAM was not mutated. `cloud/iam/bootstrap.sh` was not run.

Sandbox login cannot accept the verification code (EOF). Authenticate on a machine you control, then reply with the project id only. Do not paste verification codes or ID documents into chat.

## Least privilege bootstrap will create (not yet applied)

- `apd-payment-sa` — secretmanager.secretAccessor, logging.logWriter, run.invoker
- `apd-deploy-sa` — run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser
- WIF pool `github-apd` / provider `github`, bound only to `windsorroyalapps/ai-pharma-developments`
- Secret shells (no versions): `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`
- Region: `australia-southeast1`
- Artifact Registry repo: `apd-repo`

Never grant Owner or Editor to the runtime SA. No JSON keys in git.

## Built without live keys

- Catalog, pay dry-run ledger, orders, quotes, credit-note preview, retainers
- `js/checkout-gate.js` refuses agent checkout without `confirm=true`
- Worker dry-run when `STRIPE_SECRET_KEY` is absent; live keys force dry-run unless `STRIPE_LIVE_OK=1`
- Operator pages: `readiness.html`, `gcp-access.html`
- Local automation dry-runs ready (`tools/`, `cloud/automation/`)
- Queue processor now supports `subscription_preview` (dry-run, charged: false)
- Agent orders, invoice-preview, intake, subscription_preview, and credit-note all refuse without `confirm=true` when source=agent and force `charged: false`
- Detailed gated flow: `docs/PAYMENT_FLOW.md`
- Ledger remains append-only with forced `charged: false`

## Still waiting

- Operator GCP login and a real project id
- Stripe identity in Dashboard only (provide ID docs when ready)
- Test key versions via `cloud/iam/add-test-secrets.sh`
- Live mode only after an explicit operator confirmation
