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
- `automation.html` local intake + agent-order queue (`apd_automation_queue`), JSONL import/export, local settle
- Keyless worker: `node cloud/worker/dry-run-server.js` (confirm=true gate, no Stripe package)
- Ledger summary: `node tools/ledger-summary.js` over `.apd-ledger` (gitignored)
- Agent order contract: `confirm=true` required, never charges from the agent path
- Consult form falls back to mailto until `INTAKE_URL` is a real worker URL

## After operator auth

1. `bash cloud/iam/bootstrap.sh`
2. `bash cloud/automation/apply-after-auth.sh` (Pub/Sub topic `apd-fulfillment` + publisher bind)
3. Add Stripe **test** secret versions only
4. Deploy `cloud/worker` to Cloud Run `australia-southeast1`
5. Set GitHub Actions variables listed in `docs/OPERATOR_AUTH.md`
6. Replace placeholders in `pay.html` and `consult.html`
7. Optional: Cloud Scheduler health ping printed by the apply script

Live Stripe keys wait on Dashboard identity verification. Do not commit ID documents.

## Fulfillment hook (not charged)

Worker logs `payment_completed` JSONL. After deploy, publish to `apd-fulfillment` only from the verified webhook handler.
