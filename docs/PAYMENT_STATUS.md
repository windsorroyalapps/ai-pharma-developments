# Payment and GCP status — 2026-10-09 12:16 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required.

Identity documents stay out of git, skills, and chat. Live charges stay blocked until the operator says live and keys are confirmed.

## Blocker

Google Cloud SDK is installed at `/root/google-cloud-sdk`. `gcloud auth list` shows no credentialed accounts. Project is unset. IAM was not mutated. `cloud/iam/bootstrap.sh` was not run. Do not treat any service account, WIF pool, or secret as created.

A `--no-launch-browser` login in this sandbox prints a one-time URL, then exits with EOF before a verification code can be entered. Authenticate on a machine you control, then reply with the project id only.

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
- Local evidence queue: `node tools/evidence-queue.js` (agent rows without confirm are refused; charged stays 0)
- Weekday automation `apd-site-automation` continues dry-run site work

## Still waiting

- Operator GCP login and a real project id
- Stripe identity in Dashboard only
- Test key versions via `cloud/iam/add-test-secrets.sh`
- Live mode only after an explicit operator confirmation
