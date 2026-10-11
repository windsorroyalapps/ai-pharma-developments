# Payment flow (agent-gated, dry-run safe)

All paths refuse live charges until:
- Operator completes Stripe Dashboard identity verification
- Explicit operator confirmation for live mode
- `STRIPE_LIVE_OK=1` on the worker
- Real test/live secrets in Secret Manager (never in git)

## Agent checkout sessions require confirm=true

- `source=agent` without `confirm=true` → 403 `agent orders require confirm=true`
- Enforced in:
  - `cloud/worker/index.js` (`validateOrder`, `/agent-order`, `/create-checkout-session`)
  - `js/checkout-gate.js` (site + tools)
  - `automation.html` local queue
  - Quotes, retainers, invoice-preview, intake
- Agent path always records `charged: false`

## Dry-run guarantees (no keys)

When `STRIPE_SECRET_KEY` is absent or `STRIPE_DRY_RUN=1`:
- Sessions return `cs_dry_*` IDs and success URLs with `dry_run=1`
- No Stripe API calls
- Ledger appends only (local JSONL or browser `apd_ledger`)
- `/credit-note` never calls `stripe.refunds`
- Live keys force dry-run unless `STRIPE_LIVE_OK=1`

## Site → worker path

1. `pay.html` collects amount (AUD cents), description, email, source, confirm checkbox
2. `js/stripe-checkout.js` + `js/checkout-gate.js` validate
3. POST to Cloud Run `/create-checkout-session` (placeholder until deploy)
4. On success: redirect to Stripe Checkout (or dry-run URL)
5. Webhook `checkout.session.completed` → ledger + optional Pub/Sub `apd-fulfillment`

## Local operator automation

- `automation.html`: browser-only queue (`apd_automation_queue`), export JSONL, local settle
- `node cloud/automation/process-queue.js` processes sample queues without charges
- Health probe on `/ready` reports `confirm_gate: true`, `live_charges: false`

## What still needs operator

- GCP project ID + auth (see `docs/NEXT_OPERATOR_ACTIONS.md`)
- Stripe test key versions via `cloud/iam/add-test-secrets.sh`
- Deploy worker, set GitHub Actions vars
- Replace `YOUR-CLOUD-RUN-URL` and `pk_test_placeholder` in `pay.html`
- Explicit live approval after Dashboard ID verification

Never store live keys, ID documents, or verification codes in the repo or chat.
