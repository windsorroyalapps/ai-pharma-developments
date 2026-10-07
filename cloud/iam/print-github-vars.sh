#!/usr/bin/env bash
# Print GitHub Actions variable values after auth. Does not create resources.
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || true)}"
REGION="${REGION:-australia-southeast1}"

if [[ -z "${PROJECT_ID}" || "${PROJECT_ID}" == "(unset)" ]]; then
  echo "GCP_PROJECT_ID unset. Run gcloud auth login, then gcloud config set project PROJECT_ID" >&2
  exit 1
fi

PROJECT_NUMBER="$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')"
DEPLOY_SA="apd-deploy-sa@${PROJECT_ID}.iam.gserviceaccount.com"
WIF="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-apd/providers/github"

echo "GCP_PROJECT_ID=${PROJECT_ID}"
echo "GCP_REGION=${REGION}"
echo "GCP_WIF_PROVIDER=${WIF}"
echo "GCP_DEPLOY_SA=${DEPLOY_SA}"
echo "Set these in GitHub Actions variables. Do not put secret key values here."
