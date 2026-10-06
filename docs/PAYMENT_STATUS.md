# Payment and GCP status — 2026-10-06 19:11 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required. Stripe and payment skills already exist.

Identity documents stay out of git, skills, and chat. Complete Stripe identity in the Stripe Dashboard when ready. Test keys can be added before live verification.

## Blocker

Google Cloud SDK 587.0.0 is installed in this session. `gcloud auth list` shows no credentialed account. Project is unset. `cloud/iam/bootstrap.sh` was not run. Service accounts, WIF, and secret shells are not created. Do not treat any IAM bind as done.

Probe (no mutations):

```bash
bash cloud/iam/auth-status.sh
```

Expected until login: `status=unauthenticated` exit 1.

Run login on a machine you control, then reply with only the project id:

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```

Privilege matrix: `cloud/iam/PRIVILEGES.md`.

## Least privilege bootstrap will create (not yet applied)

- `apd-payment-sa` — secretmanager.secretAccessor, logging.logWriter, run.invoker
- `apd-deploy-sa` — run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser
- WIF pool `github-apd` / provider `github`, bound only to `windsorroyalapps/ai-pharma-developments`
- Secret shells (no versions): `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`
- Region: `australia-southeast1`

Never grant Owner or Editor to the runtime SA. No JSON keys in git.

## Built without live keys

- Catalog, pay dry-run ledger, orders page with JSONL export
- Automation console queue (confirm=true required, no charge)
- Worker dry-run sessions when `STRIPE_SECRET_KEY` is absent
- `cloud/iam/add-test-secrets.sh` refuses `sk_live_` / `pk_live_`
- `cloud/automation/local-fulfill.js` appends a local JSONL ledger and refuses items without `confirm=true`
- `cloud/iam/auth-status.sh` reports auth without creating resources

## Still waiting

- Operator GCP login and project id
- Stripe identity in Dashboard only
- Test key versions in Secret Manager
- GitHub Actions variables `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_WIF_PROVIDER`, `GCP_DEPLOY_SA`
- Live mode only after an explicit operator confirmation
