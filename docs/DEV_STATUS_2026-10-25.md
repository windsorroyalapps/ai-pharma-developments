# Development status — 2026-10-25

## GCP access privileges
- gcloud SDK 590.0.1 installed in this session. No credentialed accounts. Project unset.
- Sandbox cannot complete interactive auth (EOF on verification code). Operator must authenticate on a controlled machine:
  ```bash
  gcloud auth login --no-launch-browser
  gcloud auth application-default login --no-launch-browser
  gcloud config set project YOUR_PROJECT_ID
  gcloud config set compute/region australia-southeast1
  bash cloud/iam/bootstrap.sh
  bash cloud/automation/apply-after-auth.sh
  bash cloud/iam/print-github-vars.sh
  ```
- Reply with PROJECT_ID only after auth. Least-privilege bootstrap ready (apd-payment-sa, apd-deploy-sa, WIF github-apd). No Owner/Editor, no JSON keys, no mutations performed. Do not invent project IDs.

## Payment API & Stripe
- Existing skills (payment-api, stripe, stripe-full, apd-gcp-access, gcloud) cover all requirements. No new skills created.
- Dry-run fully operational: confirm=true gate enforced everywhere, local ledgers, charged always 0. Test keys can be added to Secret Manager shells after bootstrap.
- Live mode waits for Stripe identity verification in Dashboard. Provide ID documents when ready; never store them in git, skills, or chat.

## Site & automation features (continued without live keys)
- All pages, worker dry-run, local automation tools, and gated flows remain ready.
- Expanded status tracking and future improvement notes.
- Background: continue automation for site features; avatar interface noted as future.

Next: operator auth + PROJECT_ID → bootstrap → test secrets → deploy worker → set GitHub Actions vars.
Charged = 0 until explicit live confirmation.

Future improvement log: multi-currency beyond AUD, subscription mode, Firestore ledger migration, xAI-powered avatar interface for operator chat.
