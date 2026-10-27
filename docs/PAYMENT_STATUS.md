# Payment and GCP status — 2026-10-28 09:08 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required for payment API or Stripe integration.

Identity documents stay out of git, skills, and chat. Complete Stripe identity verification in the Stripe Dashboard only. Live charges stay blocked until the operator says live and keys are confirmed. Provide ID documents when ready for Stripe access.

## Blocker

This sandbox session: `gcloud` command not found (SDK not installed). No credentialed accounts. Project is unset. IAM was not mutated. `cloud/iam/bootstrap.sh` was not run.

Authenticate on a machine you control (do not use a sandbox-generated URL):
```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/auth-status.sh
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```
Then reply with the project id only. Do not paste verification codes, ID documents, or keys into chat.

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
- Operator pages: `readiness.html`, `gcp-access.html`, enhanced `automation.html`
- Local automation dry-runs ready (`tools/`, `cloud/automation/`)
- Agent orders, invoice-preview, intake, and credit-note all refuse without `confirm=true` when source=agent and force `charged: false`
- Ledger summary tracks credit notes, intakes, queues; charged always 0
- Detailed gated flow: `docs/PAYMENT_FLOW.md`
- Ledger remains append-only with forced `charged: false`
- New: queue gate health check in tools/

## Still waiting

- Operator GCP login and a real project id (never invent one)
- Stripe identity in Dashboard only (provide ID docs when ready)
- Test key versions via `cloud/iam/add-test-secrets.sh`
- Live mode only after an explicit operator confirmation

Site and automation features continue in dry-run mode. No secrets committed.
