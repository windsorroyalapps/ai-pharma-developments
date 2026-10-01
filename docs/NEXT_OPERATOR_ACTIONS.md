# Next operator actions

IAM was not mutated. Sandbox has gcloud installed and zero credentialed accounts. Project is unset.

## 1. Authenticate (required before bootstrap)

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project YOUR_PROJECT_ID
bash cloud/iam/bootstrap.sh
```

Paste the verification code back in chat after the browser step. Do not send ID documents.

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
echo -n 'sk_test_...' | gcloud secrets versions add stripe-secret-key --data-file=-
echo -n 'whsec_...' | gcloud secrets versions add stripe-webhook-secret --data-file=-
echo -n 'pk_test_...' | gcloud secrets versions add stripe-publishable-key --data-file=-
```

Deploy worker, then set in the site:

- `pay.html` → `window.CREATE_CHECKOUT_SESSION_URL` and `window.STRIPE_PUBLISHABLE_KEY`
- `consult.html` → `window.INTAKE_URL`

Agent orders stay gated on `confirm=true`.
