#!/usr/bin/env bash
# Print the least-privilege plan. Does not call gcloud and does not bind roles.
set -euo pipefail
PROJECT_ID="${PROJECT_ID:-PROJECT_ID}"
REGION="${REGION:-australia-southeast1}"
cat <<EOF
Project: ${PROJECT_ID}
Region: ${REGION}

Runtime SA: apd-payment-sa@${PROJECT_ID}.iam.gserviceaccount.com
  roles/secretmanager.secretAccessor
  roles/logging.logWriter
  roles/run.invoker

Deploy SA: apd-deploy-sa@${PROJECT_ID}.iam.gserviceaccount.com
  roles/run.admin
  roles/artifactregistry.writer
  roles/cloudbuild.builds.editor
  roles/iam.serviceAccountUser
  roles/iam.workloadIdentityUser via pool github-apd
    principalSet attribute.repository windsorroyalapps/ai-pharma-developments

Secret shells (no versions until test keys):
  stripe-secret-key
  stripe-webhook-secret
  stripe-publishable-key

Never Owner or Editor on the runtime SA. No JSON keys.
Apply only after auth: bash cloud/iam/bootstrap.sh
EOF
