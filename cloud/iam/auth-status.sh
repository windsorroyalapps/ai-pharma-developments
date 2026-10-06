#!/usr/bin/env bash
# Non-mutating auth probe. Never creates resources.
set -u
export PATH="${HOME}/google-cloud-sdk/bin:${PATH}"

if ! command -v gcloud >/dev/null 2>&1; then
  echo "status=sdk_missing"
  exit 2
fi

echo "sdk=$(gcloud version --format='value(Google Cloud SDK)' 2>/dev/null || gcloud version | head -1)"
ACCOUNTS="$(gcloud auth list --format='value(account)' 2>/dev/null || true)"
if [[ -z "${ACCOUNTS}" ]]; then
  echo "status=unauthenticated"
  echo "project=$(gcloud config get-value project 2>/dev/null || echo unset)"
  echo "next=gcloud auth login --no-launch-browser"
  exit 1
fi

echo "status=authenticated"
echo "accounts=${ACCOUNTS}"
echo "project=$(gcloud config get-value project 2>/dev/null || echo unset)"
exit 0
