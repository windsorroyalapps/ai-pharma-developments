# Payment and GCP status — 2026-10-09 09:08 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required. Those skills already cover least-privilege IAM, Checkout, webhooks, Google Pay, ledger, and the `confirm=true` agent gate.

Identity documents stay out of git, skills, and chat. Complete Stripe identity in the Stripe Dashboard when ready. Do not send ID images to the agent. Test keys can be added before live verification. Live charges stay blocked until you say live and keys are confirmed.

## Blocker

This session has no `gcloud` binary on PATH and no Application Default Credentials. `gcloud auth list` cannot run. Project is unset. IAM was not mutated. Do not treat any service account, WIF pool, or secret as created. Do not invent a project id.

Previous notes that the SDK lived at `/root/google-cloud-sdk` do not apply to this session. Login must happen on a machine you control. A URL printed here is not reusable because the verification code never returns to this sandbox.

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

Privilege matrix: `cloud/iam/PRIVILEGES.md`. Bootstrap script: `cloud/iam/bootstrap.sh`.

## Least privilege bootstrap will create (not yet applied)

- `apd-payment-sa` — secretmanager.secretAccessor, logging.logWriter, run.invoker
- `apd-deploy-sa` — run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser
- WIF pool `github-apd` / provider `github`, bound only to `windsorroyalapps/ai-pharma-developments`
- Secret shells (no versions): `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`
- Region: `australia-southeast1`
- Artifact Registry repo: `apd-repo`

Never grant Owner or Editor to the runtime SA. No JSON keys in git.

## GitHub Actions variables still unset until bootstrap prints them

- `GCP_PROJECT_ID`
- `GCP_REGION` = `australia-southeast1`
- `GCP_WIF_PROVIDER`
- `GCP_DEPLOY_SA`

## Built without live keys

- Catalog, pay dry-run ledger, orders page with JSONL export and import
- Quote builder at `quotes.html`
- Automation console queue with JSONL import/export and local settle (confirm=true required, no charge)
- Fulfillment desk at `fulfillment.html` (local queue, charged=false)
- Research pipeline board at `pipeline.html`
- Worker dry-run sessions when `STRIPE_SECRET_KEY` is absent
- Keyless server `cloud/worker/dry-run-server.js` (no npm install, no Stripe package)
- Local ledger summary `tools/ledger-summary.js` (refuses files that contain secret patterns)

## Still waiting

- Operator GCP login and a real project id
- Stripe identity in Dashboard only
- Test key versions in Secret Manager via `cloud/iam/add-test-secrets.sh`
- Live mode only after an explicit operator confirmation
