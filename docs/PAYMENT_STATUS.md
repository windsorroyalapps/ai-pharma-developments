# Payment and GCP status — 2026-11-13 09:12 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill required for payment API or Stripe.

Identity documents stay out of git. Complete Stripe ID verification in Dashboard. Live charges blocked until operator says "live" and keys confirmed.

## Blocker

Sandbox: gcloud SDK installed at $HOME/google-cloud-sdk. No active account (`gcloud auth list` returns []). Project unset. IAM not mutated. `cloud/iam/bootstrap.sh` not run.

**Authenticate now (operator machine or paste code here):**
```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
```

Current login URL (expires; regenerate if needed):
https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=aXhs5eHyIo0e0cxAf0yECtCtC0qDr2&prompt=consent&token_usage=remote&access_type=offline&code_challenge=l-EY-VlaG2asGxJxNRsANoD7BnNgTq5rXwNTNNk3k10&code_challenge_method=S256

After auth succeeds, reply with PROJECT_ID only, then run:
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

## Built in dry-run (continue developing)
- Confirm=true gates on all agent orders (`/agent-order`, intake, checkout, quote, credit-note, support-ticket)
- Local JSONL ledgers, catalog, quotes, credit notes, fulfillment + support_ticket stubs
- Worker dry-run mode + `cloud/worker/dry-run-server.js` (runs without Stripe keys or GCP)
- GET `/catalog` returns SKU list (AUD, dry-run only)
- POST `/quote` builds multi-item dry-run quote from catalog SKUs (agent requires confirm=true, charged=false)
- POST `/support-ticket` queues local support tickets (agent requires confirm=true)
- GET `/ledger/export` returns combined JSONL (worker + automation) for operator download — never charges
- Operator pages: pay.html, readiness.html, automation.html, gcp-access.html
- Tools: agent-order-dry-run, checkout-gate-check, ledger-summary, queue-gate-check, quote-preview, etc.
- process-queue.js: order, consult_intake, invoice_preview, subscription_preview, fulfillment, support_ticket — all agent-gated, charged=false

Continue expanding automation features without live keys or GCP mutations. Secrets remain names only: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key.
