# Payment and GCP status — 2026-10-09 10:16 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required.

Identity documents stay out of git, skills, and chat. Live charges stay blocked until the operator says live and keys are confirmed.

## Blocker

`gcloud` is not on PATH in this session and `/root/google-cloud-sdk/bin/gcloud` is absent. No credentialed account. Project is unset. IAM was not mutated. `cloud/iam/bootstrap.sh` and `cloud/automation/apply-after-auth.sh` were not run. Do not treat any service account, WIF pool, or secret as created. Do not invent a project id.

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

## GitHub Actions variables the operator must set after bootstrap

- `GCP_PROJECT_ID`
- `GCP_REGION` = `australia-southeast1`
- `GCP_WIF_PROVIDER`
- `GCP_DEPLOY_SA`

## Built without live keys

- Catalog, pay dry-run ledger, orders page with JSONL export and import
- Quote builder at `quotes.html`
- Credit-note preview at `adjustments.html` (no Stripe refund)
- Batch adjustment queue refuses agent rows without confirm=true; charged=0, refunded=0
- `js/checkout-gate.js` shared confirm gate. Agent source without `confirm=true` is refused. `charged` stays false.
- Worker dry-run sessions when `STRIPE_SECRET_KEY` is absent; live keys force dry-run unless `STRIPE_LIVE_OK=1`
- Public operator board at `status.html` (secret names only; `tools/readiness-board-check.js`)

## Still waiting

- Operator GCP login and a real project id
- Stripe identity in Dashboard only
- Test key versions in Secret Manager via `cloud/iam/add-test-secrets.sh`
- Live mode only after an explicit operator confirmation
