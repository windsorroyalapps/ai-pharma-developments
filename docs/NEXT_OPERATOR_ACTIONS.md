# Next operator actions

Rechecked 2026-10-09 13:11 AEDT. IAM was not mutated. No credentialed gcloud account. Project unset. Bootstrap was not run.

Do not paste a verification code into this chat. The sandbox login exits with EOF. Authenticate on a machine you control.

Skills already present: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. Live Stripe stays blocked until identity verification is finished in the Stripe Dashboard. Do not send ID documents into git, skills, or chat.

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
node tools/evidence-queue.js
node tools/webhook-event-dry-run.js
node cloud/automation/process-queue.js cloud/automation/sample-queue.json
```

Agent rows without `confirm=true` are refused. Charged stays 0. Readiness board: `readiness.html`.
