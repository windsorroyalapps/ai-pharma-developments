# Development status — 2026-11-05 22:50 UTC (Teegan continue)

Operator request: continue windsorroyalapps/ai-pharma-developments without live charges.
Skills: apd-gcp-access, gcloud, payment-api, stripe, stripe-full.

## GCP
- Google Cloud SDK 592.0.0 installed in sandbox (`/home/workdir/google-cloud-sdk`).
- `gcloud auth list`: **No credentialed accounts**.
- Project: **unset**.
- **No IAM mutations.** bootstrap.sh not run. No project ID invented.
- Least-privilege plan unchanged: apd-payment-sa, apd-deploy-sa, WIF pool github-apd → windsorroyalapps/ai-pharma-developments only, region australia-southeast1.

## Auth required (operator)
On a machine you control:
```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/auth-status.sh
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```
Reply with PROJECT_ID only. Do not paste verification codes, keys, or identity documents.

## Dry-run features (no Stripe live keys)
- Agent orders: `/create-checkout-session`, `/agent-order`, intake refuse unless `confirm=true` when source=agent. charged always false in dry-run.
- Secrets: names only (`stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`). Never committed.
- process-queue.js: support_ticket, consult_intake, invoice_preview, subscription_preview, fulfillment, order — all confirm-gated for agents, charged=false.
- Worker + dry-run-server, ledger JSONL, credit notes, readiness board operational without keys.

## Blocked on operator
1. GCP login + PROJECT_ID
2. bootstrap + GitHub Actions vars (GCP_PROJECT_ID, GCP_REGION, GCP_WIF_PROVIDER, GCP_DEPLOY_SA)
3. Stripe test key versions into Secret Manager (after login)
4. Stripe identity verification before any live keys or charges. Explicit "live" confirmation required.

All features remain dry-run. No live charges.
