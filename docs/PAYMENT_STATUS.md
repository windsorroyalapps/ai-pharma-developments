# Payment and GCP status — 2026-10-09 20:11 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required.

Identity documents stay out of git, skills, and chat. Complete Stripe identity verification in the Stripe Dashboard only. Live charges stay blocked until the operator says live and keys are confirmed.

## Blocker

Google Cloud SDK 588.0.0 is installed at `/root/google-cloud-sdk`. `gcloud auth list` shows no credentialed accounts. Project is unset. IAM was not mutated. `cloud/iam/bootstrap.sh` was not run.

Sandbox login cannot accept the verification code (EOF). Authenticate on a machine you control, then reply with the project id only.

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
- Worker dry-run when `STRIPE_SECRET_KEY` is absent
- Operator pages: `readiness.html`, `gcp-access.html`
- Weekday automation scheduled for dry-run site work

## Still waiting

- Operator GCP login and a real project id
- Stripe identity in Dashboard only
- Test key versions via `cloud/iam/add-test-secrets.sh`
- Live mode only after an explicit operator confirmation
