# Next operator actions

Rechecked 2026-10-08 16:12 AEDT. IAM was not mutated. Google Cloud SDK 588.0.0 is installed in the agent environment. `gcloud auth list` has no account. Project is unset. A `--no-launch-browser` login printed a URL and died on EOF, so that URL and PKCE challenge are dead. Do not reuse it. Run login on a machine that can paste the verification code.

Skills already on the agent: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required. Live Stripe stays blocked until identity verification is finished in the Stripe Dashboard. Do not send ID documents into git or chat.

## 1. Authenticate on a machine you control

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
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
node tools/invoice-preview.js consult-30 careflow-setup
node tools/stripe-test-readiness.js
```

Agent rows without `confirm=true` are refused.
