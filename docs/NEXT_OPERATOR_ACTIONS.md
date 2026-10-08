# Next operator actions

Rechecked 2026-10-09 09:08 AEDT. IAM was not mutated. This session has no gcloud binary on PATH and no credentialed account. Project is unset. Do not reuse a dead `--no-launch-browser` URL from a sandbox that cannot paste the verification code. Run login on a machine you control.

Skills already on the agent: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required. Live Stripe stays blocked until identity verification is finished in the Stripe Dashboard. Do not send ID documents into git, skills, or chat.

Weekday automation `apd-site-continue` is already active. Do not add another copy.

Shipped this pass: keyless dry-run worker, JSONL ledger summary, automation console import/export and local settle. No charge.

## 1. Authenticate on a machine you control

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

Reply with the project id only if you want bootstrap run in a session that can accept the verification code.

Preview without binding: `bash cloud/iam/privilege-plan.sh`

Bootstrap creates (least privilege, no Owner, no JSON keys):

- `apd-payment-sa` — secretAccessor, logWriter, run.invoker
- `apd-deploy-sa` — run.admin, artifactregistry.writer, cloudbuild.builds.editor, serviceAccountUser
- WIF pool `github-apd` bound to `windsorroyalapps/ai-pharma-developments` using the numeric project number
- Secret shells only: `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`

## 2. GitHub Actions variables

- `GCP_PROJECT_ID`
- `GCP_REGION` = `australia-southeast1`
- `GCP_WIF_PROVIDER` = `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-apd/providers/github`
- `GCP_DEPLOY_SA` = `apd-deploy-sa@PROJECT_ID.iam.gserviceaccount.com`

## 3. Test keys only

```bash
export STRIPE_SECRET_KEY='sk_test_...'
export STRIPE_WEBHOOK_SECRET='whsec_...'
export STRIPE_PUBLISHABLE_KEY='pk_test_...'
bash cloud/iam/add-test-secrets.sh
```

The script exits if a value starts with `sk_live_` or `pk_live_`.

## 4. Local automation (no charge)

```bash
node cloud/automation/process-queue.js cloud/automation/sample-queue.json
node tools/ledger-summary.js
node cloud/worker/dry-run-server.js
node tools/invoice-preview.js consult-30 careflow-setup
node tools/retainer-preview.js ops-retainer 3
node tools/retainer-preview.js retainer 1 --agent
node tools/stripe-test-readiness.js
```

Agent rows without `confirm=true` are refused. The `--agent` example above exits 2 until `--confirm` is added.
