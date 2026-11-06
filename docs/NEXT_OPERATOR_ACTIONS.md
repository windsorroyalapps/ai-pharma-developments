# Next operator actions — 2026-11-06

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

- Paste **test** Stripe keys only:
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
  gcloud run deploy apd-payment-worker --image ... --region australia-southeast1 --service-account apd-payment-sa@PROJECT.iam.gserviceaccount.com --allow-unauthenticated
  ```
- Update `window.CREATE_CHECKOUT_SESSION_URL` and `window.STRIPE_PUBLISHABLE_KEY` in pay.html.

## Stripe live (later)

- Complete identity verification in Stripe Dashboard (you will supply ID documents there).
- Only after verification + explicit operator "live" confirmation switch to live keys and set STRIPE_LIVE_OK=1.

## Already ready (no auth needed)

- Full dry-run payment + agent order gates
- Local ledgers, queue processor, credit notes, fulfillment stubs
- All static pages + automation.html
- Skills: apd-gcp-access, payment-api, stripe, stripe-full

Continue expanding dry-run features and site automation while waiting.
