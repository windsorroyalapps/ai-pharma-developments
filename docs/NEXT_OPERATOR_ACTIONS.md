# Next operator actions

IAM was not mutated on 2026-10-05 20:15 AEDT. Sandbox gcloud SDK 587.0.0 is installed. Zero credentialed accounts. Project is unset. A browser login started here exited on EOF, so that URL is dead.

## 1. Authenticate (required before bootstrap)

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```

Do not send ID documents. Stripe identity stays in the Stripe Dashboard.

Bootstrap creates (least privilege, no Owner, no JSON keys):

- `apd-payment-sa` — secretAccessor, logWriter, run.invoker
- `apd-deploy-sa` — run.admin, artifactregistry.writer, cloudbuild.builds.editor, serviceAccountUser
- WIF pool `github-apd` bound to `windsorroyalapps/ai-pharma-developments`
- Secret shells: `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`

## 2. GitHub Actions variables

- `GCP_PROJECT_ID`
- `GCP_REGION` = `australia-southeast1`
- `GCP_WIF_PROVIDER` = `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-apd/providers/github`
- `GCP_DEPLOY_SA` = `apd-deploy-sa@PROJECT_ID.iam.gserviceaccount.com`

## 3. Test keys only (live waits on Stripe identity)

```bash
export STRIPE_SECRET_KEY='sk_test_...'
export STRIPE_WEBHOOK_SECRET='whsec_...'
export STRIPE_PUBLISHABLE_KEY='pk_test_...'
bash cloud/iam/add-test-secrets.sh
```

The script exits if a value starts with `sk_live_` or `pk_live_`.

Deploy worker, then set in the site:

- `pay.html` → `window.CREATE_CHECKOUT_SESSION_URL` and `window.STRIPE_PUBLISHABLE_KEY`
- `consult.html` → `window.INTAKE_URL`

Agent orders stay gated on `confirm=true`.
