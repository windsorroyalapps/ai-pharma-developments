# Payment and GCP status — 2026-10-09 16:12 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required. Payment and Stripe skills already cover Checkout, webhooks, Google Pay, the ledger, and the agent `confirm=true` gate.

Identity documents stay out of git, skills, and chat. Complete Stripe identity verification in the Stripe Dashboard only. Live charges stay blocked until the operator says live and keys are confirmed.

## Blocker

Google Cloud SDK is installed at `/root/google-cloud-sdk`. `gcloud auth list` shows no credentialed accounts. Project is unset. IAM was not mutated. `cloud/iam/bootstrap.sh` was not run.

A `--no-launch-browser` login in this sandbox prints a one-time URL, then exits with EOF before a verification code can be entered. That URL is bound to the dead sandbox process and must not be reused. Authenticate on a machine you control, then reply with the project id only. Do not paste the verification code into chat.

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

## Least privilege bootstrap will create (not yet applied)

- `apd-payment-sa` — secretmanager.secretAccessor, logging.logWriter, run.invoker
- `apd-deploy-sa` — run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser
- WIF pool `github-apd` / provider `github`, bound only to `windsorroyalapps/ai-pharma-developments`
- Secret shells (no versions): `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`
- Region: `australia-southeast1`
- Artifact Registry repo: `apd-repo`

Never grant Owner or Editor to the runtime SA. No JSON keys in git.

## GitHub Actions variables after bootstrap

- `GCP_PROJECT_ID`
- `GCP_REGION` = `australia-southeast1`
- `GCP_WIF_PROVIDER`
- `GCP_DEPLOY_SA`

## Built without live keys

- Catalog, pay dry-run ledger, orders, quotes, credit-note preview, retainers
- `js/checkout-gate.js` refuses agent checkout without `confirm=true`
- Worker dry-run when `STRIPE_SECRET_KEY` is absent
- Operator board: `readiness.html` (names only)
- Weekday automations already scheduled for dry-run site work

## Still waiting

- Operator GCP login and a real project id
- Stripe identity in Dashboard only
- Test key versions via `cloud/iam/add-test-secrets.sh`
- Live mode only after an explicit operator confirmation
