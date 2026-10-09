# Next operator actions

Rechecked 2026-10-09 20:11 AEDT. IAM was not mutated. gcloud 588.0.0 is installed at `/root/google-cloud-sdk`. `gcloud auth list` reports no credentialed accounts. Project unset. `cloud/iam/bootstrap.sh` was not run.

A `--no-launch-browser` login in this sandbox prints a one-time URL, then exits with EOF before a verification code can be entered. That URL is bound to the dead sandbox process and must not be reused. Authenticate on a machine you control, then reply with the project id only. Do not paste the verification code or ID documents into chat.

Skills already present: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No additional payment skill is required. Live Stripe stays blocked until identity verification is finished in the Stripe Dashboard and you explicitly say live.

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
node tools/evidence-queue.js
node tools/webhook-event-dry-run.js
node tools/support-queue.js
node cloud/automation/process-queue.js cloud/automation/sample-queue.json
```

Operator page: `gcp-access.html`. Readiness board: `readiness.html`. Agent rows without `confirm=true` are refused. Charged stays 0.
