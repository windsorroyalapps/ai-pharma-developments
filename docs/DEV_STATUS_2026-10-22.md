# Development status — 2026-10-22 (updated)

## GCP access privileges
- gcloud SDK installed (590.0.0). No active account. Project unset.
- Auth login URL generated this session (sandbox EOF expected — process cannot accept code).
- Operator: complete auth on your own machine (do not reuse this one-time URL):
  ```
  gcloud auth login --no-launch-browser
  gcloud auth application-default login --no-launch-browser
  gcloud config set project YOUR_PROJECT_ID
  gcloud config set compute/region australia-southeast1
  bash cloud/iam/bootstrap.sh
  bash cloud/automation/apply-after-auth.sh
  bash cloud/iam/print-github-vars.sh
  ```
- Least-privilege SAs (apd-payment-sa, apd-deploy-sa), WIF pool github-apd, secret shells ready. No mutations performed. No Owner/Editor granted. No JSON keys.

## Payment API & Stripe integration
- Skills present: apd-gcp-access, gcloud, payment-api, stripe, stripe-full. No new skills created (existing cover requirements).
- Dry-run mode fully operational: agent gates require confirm=true, local ledgers, sample queues, no live charges.
- Live Stripe blocked until ID verification in Dashboard. Provide documents when ready; never store in git/chat/skills.

## Site automation features (developed without live keys)
- Queue processor, local JSONL ledgers, dry-run server, agent-order simulator operational.
- Frontend pages: automation.html, pay.html (placeholder), catalog, orders, quotes, credit notes, intake, fulfillment, readiness.html, gcp-access.html.
- Continue expanding local automation hooks and previews. Any agent Checkout Session must send confirm=true.

Next steps after project ID + auth: run bootstrap, add test secret versions, deploy worker, set GitHub vars.
Charged remains 0 until explicit live confirmation.
