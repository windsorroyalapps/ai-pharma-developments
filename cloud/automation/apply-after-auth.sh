#!/usr/bin/env bash
# Run AFTER cloud/iam/bootstrap.sh and gcloud auth.
# Creates fulfillment topic and publisher bind. Does not create charges.
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${REGION:-australia-southeast1}"

if [[ -z "${PROJECT_ID}" || "${PROJECT_ID}" == "(unset)" ]]; then
  echo "Set PROJECT_ID or run gcloud config set project first" >&2
  exit 1
fi

PAYMENT_SA="apd-payment-sa@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud services enable pubsub.googleapis.com cloudscheduler.googleapis.com --project="${PROJECT_ID}"

gcloud pubsub topics create apd-fulfillment --project="${PROJECT_ID}" || true
gcloud pubsub topics add-iam-policy-binding apd-fulfillment \
  --project="${PROJECT_ID}" \
  --member="serviceAccount:${PAYMENT_SA}" \
  --role="roles/pubsub.publisher" || true

echo "Topic: projects/${PROJECT_ID}/topics/apd-fulfillment"
echo "Publisher: ${PAYMENT_SA}"
echo "Scheduler is not created until the worker URL exists."
echo "After deploy, create a daily health ping:"
echo "  gcloud scheduler jobs create http apd-worker-health \\"
echo "    --location=${REGION} \\"
echo "    --schedule='0 9 * * *' \\"
echo "    --uri=https://WORKER_HOST/healthz \\"
echo "    --http-method=GET"
