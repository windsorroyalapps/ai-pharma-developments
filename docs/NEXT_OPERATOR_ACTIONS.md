# Next operator actions — 2026-11-13

## Immediate (required for GCP privileges)

1. On your machine run:
   ```
   gcloud auth login --no-launch-browser
   gcloud auth application-default login --no-launch-browser
   ```
2. Reply in chat with **PROJECT_ID only** (no codes, no keys).
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
- Set GitHub Actions repository variables from print-github-vars.sh output.
- Deploy worker:
  ```
  cd cloud/worker
  gcloud builds submit --tag australia-southeast1-docker.pkg.dev/PROJECT/apd-repo/apd-payment-worker:latest
  gcloud run deploy apd-payment-worker --image australia-southeast1-docker.pkg.dev/PROJECT/apd-repo/apd-payment-worker:latest --region australia-southeast1 --service-account apd-payment-sa@PROJECT.iam.gserviceaccount.com --allow-unauthenticated
  ```
- Update `window.CREATE_CHECKOUT_SESSION_URL` and `window.STRIPE_PUBLISHABLE_KEY` in pay.html (and consult.html if intake is live).

## Stripe live (later)

- Complete identity verification in Stripe Dashboard (you will supply ID documents there).
- Only after verification + explicit operator "live" confirmation switch to live keys and set STRIPE_LIVE_OK=1.

## Already ready (no auth needed)

- Full dry-run payment + agent order gates (`confirm=true` enforced)
- Local ledgers, queue processor (CLI + server `/queue/process`), credit notes, fulfillment stubs
- Support queue: GET `/support/queue` on dry-run server (reads ledger, never charges)
- All static pages + automation.html
- Skills: apd-gcp-access, payment-api, stripe, stripe-full
- Payment flow docs updated (this file + AGENT_ORDERS.md + AUTOMATION.md)

## Recheck

Last checked: 2026-11-13 09:36 AEDT. gcloud unauthenticated (no credentialed account). Next recheck: 2026-11-13 18:00 AEDT.

Continue expanding dry-run features and site automation while waiting for operator auth.
