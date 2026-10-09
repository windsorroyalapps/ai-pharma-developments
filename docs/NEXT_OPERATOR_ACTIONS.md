# Next operator actions

Rechecked 2026-10-09 11:17 AEDT. IAM was not mutated. Google Cloud SDK is installed at `/root/google-cloud-sdk`. `gcloud auth list` shows no credentialed accounts. Project is unset. ADC is missing. Bootstrap and apply-after-auth were not run.

A login URL from this sandbox exits with EOF before it can accept a verification code. Do not paste a code here. Authenticate on a machine you control.

Skills already on the agent: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required. Live Stripe stays blocked until identity verification is finished in the Stripe Dashboard. Do not send ID documents into git, skills, or chat.

## 1. Authenticate, then bootstrap

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

Reply with the project id only if you want bootstrap run in a session that already has an active account.

Bootstrap creates (least privilege, no Owner, no JSON keys):

- `apd-payment-sa` — secretAccessor, logWriter, run.invoker
- `apd-deploy-sa` — run.admin, artifactregistry.writer, cloudbuild.builds.editor, serviceAccountUser
- WIF pool `github-apd` bound to `windsorroyalapps/ai-pharma-developments`
- Secret shells only: `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`

## 2. GitHub Actions variables

- `GCP_PROJECT_ID`
- `GCP_REGION` = `australia-southeast1`
- `GCP_WIF_PROVIDER`
- `GCP_DEPLOY_SA`

## 3. Local automation (no charge)

```bash
node tools/run-local-automation.js
node tools/webhook-event-dry-run.js
node tools/webhook-event-dry-run.js cloud/automation/webhook-dry-run.jsonl --agent
node tools/webhook-event-dry-run.js cloud/automation/webhook-dry-run.jsonl --agent --confirm
node cloud/automation/process-queue.js cloud/automation/sample-queue.json
node tools/adjustment-queue.js cloud/automation/sample-adjustments.json
node tools/ledger-summary.js
node cloud/worker/dry-run-server.js
```

Agent rows without `confirm=true` are refused. Credit notes and adjustments set `refunded: false` and do not call Stripe.
