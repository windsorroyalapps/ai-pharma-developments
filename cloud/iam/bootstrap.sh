#!/usr/bin/env bash
# Least-privilege IAM for AI Pharma Developments payment worker.
# Run AFTER: gcloud auth login && gcloud config set project PROJECT_ID
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${REGION:-australia-southeast1}"

if [[ -z "${PROJECT_ID}" || "${PROJECT_ID}" == "(unset)" ]]; then
  echo "Set PROJECT_ID or run gcloud config set project first" >&2
  exit 1
fi

PROJECT_NUMBER="$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')"
if [[ -z "${PROJECT_NUMBER}" ]]; then
  echo "Could not resolve project number for ${PROJECT_ID}" >&2
  exit 1
fi

PAYMENT_SA="apd-payment-sa@${PROJECT_ID}.iam.gserviceaccount.com"
DEPLOY_SA="apd-deploy-sa@${PROJECT_ID}.iam.gserviceaccount.com"

echo "Project: ${PROJECT_ID} (${PROJECT_NUMBER})"

APIS=(
  run.googleapis.com
  artifactregistry.googleapis.com
  cloudbuild.googleapis.com
  secretmanager.googleapis.com
  iam.googleapis.com
  iamcredentials.googleapis.com
  cloudresourcemanager.googleapis.com
  logging.googleapis.com
  monitoring.googleapis.com
  pubsub.googleapis.com
  firestore.googleapis.com
  sts.googleapis.com
)
gcloud services enable "${APIS[@]}"

gcloud iam service-accounts create apd-payment-sa --display-name="APD payment runtime" || true
gcloud iam service-accounts create apd-deploy-sa --display-name="APD Cloud Build / WIF deploy" || true

for ROLE in roles/secretmanager.secretAccessor roles/logging.logWriter roles/run.invoker; do
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${PAYMENT_SA}" --role="${ROLE}" --quiet
done

for ROLE in roles/run.admin roles/artifactregistry.writer roles/cloudbuild.builds.editor roles/iam.serviceAccountUser; do
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${DEPLOY_SA}" --role="${ROLE}" --quiet
done

gcloud artifacts repositories create apd-repo \
  --repository-format=docker --location="${REGION}" --description="APD images" || true

for SECRET in stripe-secret-key stripe-webhook-secret stripe-publishable-key; do
  gcloud secrets create "${SECRET}" --replication-policy=automatic || true
  gcloud secrets add-iam-policy-binding "${SECRET}" \
    --member="serviceAccount:${PAYMENT_SA}" \
    --role="roles/secretmanager.secretAccessor" || true
done

# Workload Identity Federation for GitHub Actions (no JSON keys).
# principalSet must use the numeric project number, not the project id.
gcloud iam workload-identity-pools create github-apd \
  --location=global --display-name="GitHub APD" || true

POOL="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-apd"

gcloud iam workload-identity-pools providers create-oidc github \
  --location=global \
  --workload-identity-pool=github-apd \
  --display-name="GitHub OIDC" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.actor=assertion.actor" \
  --attribute-condition="assertion.repository=='windsorroyalapps/ai-pharma-developments'" \
  --issuer-uri="https://token.actions.githubusercontent.com" || true

gcloud iam service-accounts add-iam-policy-binding "${DEPLOY_SA}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${POOL}/attribute.repository/windsorroyalapps/ai-pharma-developments"

echo "Done. Add secret VALUES only after Stripe test keys exist."
echo "  echo -n sk_test_... | gcloud secrets versions add stripe-secret-key --data-file=-"
echo "Deploy SA: ${DEPLOY_SA}"
echo "Runtime SA: ${PAYMENT_SA}"
echo "WIF pool: ${POOL}"
