# Next operator actions — 2026-11-27 09:43 AEDT

## Immediate (required for GCP privileges)

1. On your machine run:
   ```
   gcloud auth login --no-launch-browser
   gcloud auth application-default login --no-launch-browser
   ```
2. Reply in chat with **PROJECT_ID only** (no codes, no keys, no ID docs).
3. Then:
   ```
   gcloud config set project PROJECT_ID
   gcloud config set compute/region australia-southeast1
   bash cloud/iam/bootstrap.sh
   bash cloud/automation/apply-after-auth.sh
   bash cloud/iam/print-github-vars.sh
   ```

## After bootstrap

- Paste **test** Stripe keys only (as secret versions; never commit):
  ```
  echo -n sk_test_... | gcloud secrets versions add stripe-secret-key --data-file=-
  echo -n whsec_... | gcloud secrets versions add stripe-webhook-secret --data-file=-
  echo -n pk_test_... | gcloud secrets versions add stripe-publishable-key --data-file=-
  ```
- Set GitHub Actions repository variables from print-github-vars.sh output:
  - GCP_PROJECT_ID
  - GCP_REGION = australia-southeast1
  - GCP_WIF_PROVIDER
  - GCP_DEPLOY_SA
- Deploy worker (or push under cloud/worker/** to trigger deploy-worker.yml once vars exist).
- Update `window.CREATE_CHECKOUT_SESSION_URL` and `window.STRIPE_PUBLISHABLE_KEY` in pay.html.

## Stripe live (later)

- Complete identity verification in Stripe Dashboard (you will supply ID documents there).
- Only after verification + explicit operator "live" confirmation switch to live keys and set STRIPE_LIVE_OK=1.

## Skills status

- apd-gcp-access, gcloud, payment-api, stripe, stripe-full — all present and sufficient.
- **No new skill created or required** for GCP privileges or payment/Stripe integration.

## Already ready (no auth needed)

- Full dry-run payment + agent order gates (`confirm=true` enforced)
- Local ledgers, queue processor (credit_note, invoice_preview, subscription_preview, consult_intake, support_ticket, fulfillment)
- Static site + automation.html + status readiness board
- Worker dry-run server: `node cloud/worker/dry-run-server.js`
- Support queue dry-run endpoint and local console ready

## Recheck

Last checked: 2026-11-27T09:43:00+11:00. gcloud not on PATH; unauthenticated. No IAM mutations. Continue dry-run site/automation work while waiting for operator auth + PROJECT_ID. Readiness board refreshed.
