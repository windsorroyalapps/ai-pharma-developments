# Payment and GCP status — 2026-11-12 22:16 UTC (Teegan cycle)

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill required for payment API or Stripe.

Identity documents stay out of git. Complete Stripe ID verification in Dashboard. Live charges blocked until operator says "live" and keys confirmed.

## Blocker

Sandbox: gcloud SDK 593.0.0 installed this cycle. `gcloud auth list` returns no active account. Project unset. IAM not mutated. `cloud/iam/bootstrap.sh` not run. No project ID invented.

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

## Built / improved this cycle (dry-run only)

- Restored and expanded POST `/queue/process` on dry-run-server (was dropped in prior commit). Now handles: order, consult_intake, support_ticket, invoice_preview, subscription_preview, fulfillment. All agent items require confirm=true; charged always false.
- Support ticket endpoint retained + confirm gate.
- Multi-item `/quote`, `/catalog`, `/ledger/summary`, `/ledger/export`, credit-note, intake, invoice-preview, agent-order, create-checkout-session all dry-run safe.
- Local JSONL ledgers (worker.jsonl + automation.jsonl). Never writes secrets.
- Worker code runs without Stripe keys or GCP credentials.
- Agent orders and agent credit notes / support tickets refuse without confirm=true.

## Still needs operator

1. gcloud auth login (no-launch-browser) on a machine that can reach the sandbox or share PROJECT_ID.
2. Stripe Dashboard: finish identity verification. Paste test keys only into Secret Manager (names: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key). Never commit values.
3. After bootstrap: set GitHub Actions vars GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA.
4. Explicit "live" confirmation before any live charges. Agent orders always require confirm=true.

Continue expanding static site + dry-run ledger + automation console without live keys or IAM mutations.
