# Google Cloud access privileges — AI Pharma Developments

Status 2026-10-09 09:15 AEDT: CLI 588.0.0 present, no credentialed account, project unset, ADC missing. IAM was not mutated. Do not invent a project id.

Operator must authenticate before any IAM mutation:

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project PROJECT_ID
bash cloud/iam/bootstrap.sh
```

This sandbox cannot complete those steps without your login URL approval.

## Service accounts

| Account | Roles |
|---|---|
| `apd-payment-sa@PROJECT.iam.gserviceaccount.com` | secretmanager.secretAccessor, logging.logWriter, run.invoker |
| `apd-deploy-sa@PROJECT.iam.gserviceaccount.com` | run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser |

Runtime SA must never be project Owner. No JSON keys in git — use WIF.

## APIs

`run`, `artifactregistry`, `cloudbuild`, `secretmanager`, `iam`, `iamcredentials`, `cloudresourcemanager`, `logging`, `monitoring`, `pubsub`, `firestore`, `sts`

## Secrets

Create after test keys exist. Live keys only after Stripe identity verification.

- `stripe-secret-key`
- `stripe-webhook-secret`
- `stripe-publishable-key`

Grant accessor only to `apd-payment-sa`.

```bash
echo -n 'sk_test_...' | gcloud secrets versions add stripe-secret-key --data-file=-
```

## Deploy (after auth)

```bash
REGION=australia-southeast1
PROJECT_ID=$(gcloud config get-value project)
cd cloud/worker
gcloud artifacts repositories create apd-repo --repository-format=docker --location=$REGION || true
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/apd-repo/apd-payment-worker:latest
gcloud run deploy apd-payment-worker \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/apd-repo/apd-payment-worker:latest \
  --region $REGION \
  --service-account apd-payment-sa@$PROJECT_ID.iam.gserviceaccount.com \
  --allow-unauthenticated \
  --set-secrets=STRIPE_SECRET_KEY=stripe-secret-key:latest,STRIPE_WEBHOOK_SECRET=stripe-webhook-secret:latest \
  --set-env-vars=ALLOWED_ORIGINS=https://aipharmadevelopments.com,https://windsorroyalapps.github.io
```

Copy the Cloud Run URL into `pay.html` as `window.CREATE_CHECKOUT_SESSION_URL`.

## GitHub WIF

Pool `github-apd` is bound to repo `windsorroyalapps/ai-pharma-developments` and `apd-deploy-sa`. Workflow: `.github/workflows/deploy-worker.yml` (no-ops until repo variables are set).

## Stripe live mode

Blocked until you complete identity verification in Stripe Dashboard (do not commit ID documents).
