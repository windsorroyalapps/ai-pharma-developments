#!/usr/bin/env bash
# Prints the operator auth sequence. Does not open a browser and does not mutate IAM.
set -euo pipefail
echo "No IAM mutation from this script."
echo "Run these in a terminal you control:"
echo "  gcloud auth login --no-launch-browser"
echo "  gcloud auth application-default login --no-launch-browser"
echo "  gcloud config set project PROJECT_ID"
echo "  bash cloud/iam/bootstrap.sh"
echo "  bash cloud/automation/apply-after-auth.sh"
echo "Then set GitHub Actions variables:"
echo "  GCP_PROJECT_ID GCP_REGION=australia-southeast1 GCP_WIF_PROVIDER GCP_DEPLOY_SA"
echo "Do not commit Stripe keys or identity documents."
