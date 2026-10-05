#!/usr/bin/env bash
# Add Stripe TEST secret versions only. Refuses live keys.
# Do not paste ID documents. Live keys wait for an explicit operator yes.
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
if [[ -z "${PROJECT_ID}" || "${PROJECT_ID}" == "(unset)" ]]; then
  echo "Set PROJECT_ID first" >&2
  exit 1
fi

reject_live() {
  local name="$1" value="$2"
  case "${value}" in
    sk_live_*|pk_live_*|rk_live_*)
      echo "Refusing live key for ${name}. Identity verification is not done." >&2
      exit 2
      ;;
  esac
}

add_one() {
  local name="$1" value="$2"
  [[ -n "${value}" ]] || return 0
  reject_live "${name}" "${value}"
  printf '%s' "${value}" | gcloud secrets versions add "${name}" --data-file=- --project="${PROJECT_ID}"
  echo "Added version for ${name} (value not printed)"
}

add_one stripe-secret-key "${STRIPE_SECRET_KEY:-}"
add_one stripe-webhook-secret "${STRIPE_WEBHOOK_SECRET:-}"
add_one stripe-publishable-key "${STRIPE_PUBLISHABLE_KEY:-}"

if [[ -z "${STRIPE_SECRET_KEY:-}${STRIPE_WEBHOOK_SECRET:-}${STRIPE_PUBLISHABLE_KEY:-}" ]]; then
  echo "No env values set. Export STRIPE_SECRET_KEY=sk_test_... (and webhook/publishable) then re-run." >&2
  exit 1
fi
