# Next operator actions

Rechecked 2026-10-07 19:11 AEDT. IAM was not mutated. This session had no credentialed `gcloud` account and no project set. Google Cloud SDK is not persistent in the agent sandbox (install does not survive the next shell). Do not reuse any previous `--no-launch-browser` URL.

Skills already on the agent and sufficient until live Stripe: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required for test-mode site work. Live keys stay blocked until you finish Stripe Dashboard identity verification. Do not send ID documents into git or chat.

## 1. Authenticate (required before bootstrap)

On a machine where you can paste the verification code:

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

Reply in chat with the project id after login if you want the agent to run bootstrap in a session that stays open for the code.

Bootstrap creates (least privilege, no Owner, no JSON keys):

- `apd-payment-sa` — secretAccessor, logWriter, run.invoker
- `apd-deploy-sa` — run.admin, artifactregistry.writer, cloudbuild.builds.editor, serviceAccountUser
- WIF pool `github-apd` bound to `windsorroyalapps/ai-pharma-developments`
- Secret shells only: `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`

## 2. GitHub Actions variables

- `GCP_PROJECT_ID`
- `GCP_REGION` = `australia-southeast1`
- `GCP_WIF_PROVIDER` = `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-apd/providers/github`
- `GCP_DEPLOY_SA` = `apd-deploy-sa@PROJECT_ID.iam.gserviceaccount.com`

`cloud/iam/print-github-vars.sh` prints these after the project is set. It does not create resources.

## 3. Test keys only

```bash
export STRIPE_SECRET_KEY='sk_test_...'
export STRIPE_WEBHOOK_SECRET='whsec_...'
export STRIPE_PUBLISHABLE_KEY='pk_test_...'
bash cloud/iam/add-test-secrets.sh
```

The script exits if a value starts with `sk_live_` or `pk_live_`.

Then deploy `cloud/worker` and set:

- `pay.html` → `window.CREATE_CHECKOUT_SESSION_URL` and `window.STRIPE_PUBLISHABLE_KEY`
- `consult.html` → `window.INTAKE_URL`

## 4. Automation that already runs locally

```bash
node cloud/automation/process-queue.js cloud/automation/sample-queue.json
node tools/invoice-preview.js consult-30 careflow-setup
```

Agent rows without `confirm=true` are refused. Nothing is charged.

Weekday site-dev automations are already active (`apd-site-dev-weekday`, `apd-test-mode-dev`). No extra schedule was added this pass.
