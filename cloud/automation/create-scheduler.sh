#!/usr/bin/env bash
# Create the daily worker health ping AFTER deploy.
# Does not create charges. Refuses if project or worker URL is missing.
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${REGION:-australia-southeast1}"
WORKER_URL="${WORKER_URL:-}"

if [[ -z "${PROJECT_ID}" || "${PROJECT_ID}" == "(unset)" ]]; then
  echo "Set PROJECT_ID or run gcloud config set project first" >&2
  exit 1
fi

if [[ -z "${WORKER_URL}" || "${WORKER_URL}" == *YOUR-CLOUD-RUN* ]]; then
  echo "Set WORKER_URL to the Cloud Run origin, e.g. https://apd-payment-worker-xxxx.a.run.app" >&2
  exit 1
fi

gcloud services enable cloudscheduler.googleapis.com --project="${PROJECT_ID}"

gcloud scheduler jobs create http apd-worker-health \
  --project="${PROJECT_ID}" \
  --location="${REGION}" \
  --schedule='0 9 * * *' \
  --time-zone='Australia/Sydney' \
  --uri="${WORKER_URL%/}/healthz" \
  --http-method=GET || true

echo "Job: apd-worker-health"
echo "URI: ${WORKER_URL%/}/healthz"
echo "Region: ${REGION}"
