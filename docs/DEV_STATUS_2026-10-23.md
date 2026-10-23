# Development status — 2026-10-23

## GCP access privileges
- gcloud SDK 590.0.0 installed in sandbox. No credentialed accounts. Project unset.
- Sandbox cannot complete interactive auth (EOF on code entry). Operator must authenticate on a controlled machine:
  ```bash
  gcloud auth login --no-launch-browser
  gcloud auth application-default login --no-launch-browser
  gcloud config set project YOUR_PROJECT_ID
  gcloud config set compute/region australia-southeast1
  bash cloud/iam/bootstrap.sh
  bash cloud/automation/apply-after-auth.sh
  bash cloud/iam/print-github-vars.sh
  ```
- Reply with PROJECT_ID only after auth. Least-privilege bootstrap ready (apd-payment-sa, apd-deploy-sa, WIF github-apd). No Owner/Editor, no JSON keys, no mutations performed.

## Payment API & Stripe
- Existing skills (payment-api, stripe, stripe-full, apd-gcp-access, gcloud) cover requirements. No new skills created.
- Dry-run fully operational: confirm=true gate, local ledgers, no live charges. Test keys can be added to Secret Manager shells after bootstrap.
- Live mode waits for Stripe identity verification. Provide ID documents when ready; never store them in git, skills, or chat.

## Site & automation features (continued without live keys)
- Worker (cloud/worker/index.js) supports dry-run sessions, agent orders, credit notes, intake, invoice preview, webhook stubs.
- Frontend: pay.html with Checkout + Google Pay placeholders, local ledger, readiness pages.
- Automation: queue processor, sample data, local fulfillment dry-runs.
- Continue expanding previews and hooks. Any agent Checkout Session requires confirm=true.

Next: operator auth + PROJECT_ID → bootstrap → test secrets → deploy worker → set GitHub Actions vars.
Charged = 0 until explicit live confirmation.

Future improvement log: multi-currency, subscription live mode, Firestore ledger, avatar interface automation (background).
