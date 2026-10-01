# Site + payment automation

## Skills already loaded (do not duplicate)

- `apd-gcp-access` — least-privilege IAM + WIF
- `gcloud` — CLI/auth
- `payment-api` — checkout, ledger, agent gate
- `stripe` / `stripe-full` — Checkout, webhooks, Google Pay, live blocked on ID verification

## In repo

- Static site (GitHub Pages / aipharmadevelopments.com)
- Stripe Checkout + Google Pay (`pay.html`)
- Cloud Run worker: sessions, signed webhooks, `/intake`, agent `confirm=true`
- Consult form posts to worker when `INTAKE_URL` is real, else mailto
- Operator status page: `status.html`
- IAM bootstrap: `cloud/iam/bootstrap.sh`

## Blocked until operator login

No project ID discovered. No IAM bindings applied. Live Stripe keys wait on Dashboard identity verification. Do not commit ID documents.
