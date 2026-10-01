# Site + payment automation

## Skills already loaded (do not duplicate)

- `apd-gcp-access` — least-privilege IAM + WIF
- `gcloud` — CLI/auth
- `payment-api` — checkout, ledger, agent gate
- `stripe` / `stripe-full` — Checkout, webhooks, Google Pay, live blocked on ID verification

## In repo

- Static site (GitHub Pages / aipharmadevelopments.com)
- Stripe Checkout + Google Pay (`pay.html`)
- Cloud Run worker: sessions, signed webhooks, `/intake`, `/agent-order`
- Dry-run: if `STRIPE_SECRET_KEY` is unset, `/create-checkout-session` returns a fake session and does not charge
- Agent orders require `confirm=true` and never charge from the agent path
- Consult form posts to worker when `INTAKE_URL` is real, else mailto
- Operator status page: `status.html`
- IAM bootstrap: `cloud/iam/bootstrap.sh`
- Auth blocker: `docs/OPERATOR_AUTH.md`

## Blocked until operator login

No project ID discovered. No IAM bindings applied. Live Stripe keys wait on Dashboard identity verification. Do not commit ID documents.
