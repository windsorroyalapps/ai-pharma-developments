# Site + payment automation

## Skills already loaded (do not duplicate)

- `apd-gcp-access` — least-privilege IAM + WIF
- `gcloud` — CLI/auth
- `payment-api` — checkout, ledger, agent gate
- `stripe` / `stripe-full` — Checkout, webhooks, Google Pay, live blocked on ID verification

## What works without GCP login

- Static site on GitHub Pages / aipharmadevelopments.com
- `pay.html` local dry-run when `CREATE_CHECKOUT_SESSION_URL` still contains `YOUR-CLOUD-RUN-URL`
- Local ledger in `localStorage` key `apd_ledger` (last 50, no card data)
- Agent order contract: `confirm=true` required, never charges from the agent path
- Consult form falls back to mailto until `INTAKE_URL` is a real worker URL

## After operator auth

1. `bash cloud/iam/bootstrap.sh`
2. Add Stripe **test** secret versions only
3. Deploy `cloud/worker` to Cloud Run `australia-southeast1`
4. Set GitHub Actions variables listed in `docs/OPERATOR_AUTH.md`
5. Replace placeholders in `pay.html` and `consult.html`

Live Stripe keys wait on Dashboard identity verification. Do not commit ID documents.

## Fulfillment hook (not charged)

Worker logs `payment_completed` JSONL. Next bind after deploy: Pub/Sub topic `apd-fulfillment` published only from the verified webhook handler.
