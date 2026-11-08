# Payment and GCP status — 2026-11-09 09:00 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill required for payment API or Stripe.

Identity documents stay out of git. Complete Stripe ID verification in Dashboard. Live charges blocked until operator says "live" and keys confirmed.

## Blocker

Sandbox: gcloud installed (SDK 592). No active account. Project unset. IAM not mutated. bootstrap.sh not run.

**Authenticate now (operator machine):**
```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
```

After auth succeeds, reply with PROJECT_ID only, then run:
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

## Built in dry-run (continue developing)
- Confirm=true gates on all agent orders (`/agent-order`, intake, checkout)
- Local JSONL ledgers, catalog, quotes, credit notes, fulfillment + support_ticket stubs
- Worker dry-run mode + `cloud/worker/dry-run-server.js` (runs without Stripe keys or GCP)
- New: GET /catalog returns SKU list (AUD, dry-run only)
- Operator pages: pay.html, readiness.html, automation.html, gcp-access.html
- Tools: agent-order-dry-run, checkout-gate-check, ledger-summary, queue-gate-check, etc.
- process-queue.js: order, consult_intake, invoice_preview, subscription_preview, fulfillment, support_ticket — all agent-gated, charged=false

Continue expanding automation features without live keys or GCP mutations. Secrets remain names only: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key.
