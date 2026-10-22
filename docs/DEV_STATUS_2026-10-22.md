# Development status — 2026-10-22

## GCP access privileges
- gcloud SDK installed in sandbox session (Google Cloud SDK 590.0.0).
- No active account. Auth URL generated but sandbox process cannot accept verification code (EOF).
- Operator must authenticate on a controlled machine:
  ```
  gcloud auth login --no-launch-browser
  gcloud auth application-default login --no-launch-browser
  gcloud config set project YOUR_PROJECT_ID
  gcloud config set compute/region australia-southeast1
  bash cloud/iam/bootstrap.sh
  bash cloud/automation/apply-after-auth.sh
  ```
- Least-privilege SAs (apd-payment-sa, apd-deploy-sa), WIF pool github-apd, secret shells ready. No mutations performed. No Owner/Editor granted.

## Payment API & Stripe integration
- Existing skills cover all needs: payment-api, stripe, stripe-full, apd-gcp-access, gcloud.
- No additional skills created (unnecessary).
- Dry-run mode fully operational: agent gates require confirm=true, local ledgers, sample queues, no live charges.
- Live Stripe blocked until ID verification in Dashboard. Provide documents when ready; never store in git/chat.

## Site automation features (developed without live keys)
- Queue processor handles orders, consult_intake, invoice_preview, subscription_preview.
- Local JSONL ledgers, dry-run server, agent-order simulator.
- Frontend: automation.html, pay.html (placeholder), catalog, orders, quotes, credit notes, intake, fulfillment.
- Continue expanding local automation hooks and previews.

Next steps after project ID + auth: run bootstrap, add test secret versions, deploy worker, set GitHub vars.
Charged remains 0 until explicit live confirmation.
