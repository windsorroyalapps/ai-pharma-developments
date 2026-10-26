# Development status — 2026-10-26 (session update)

## GCP access privileges
- gcloud SDK installed and ready in session. No credentialed accounts. Project unset. No IAM mutations performed.
- Operator must authenticate on a controlled machine (sandbox cannot complete interactive login):
  ```bash
  gcloud auth login --no-launch-browser
  gcloud auth application-default login --no-launch-browser
  gcloud config set project YOUR_PROJECT_ID
  gcloud config set compute/region australia-southeast1
  bash cloud/iam/bootstrap.sh
  bash cloud/automation/apply-after-auth.sh
  bash cloud/iam/print-github-vars.sh
  ```
- Reply with PROJECT_ID only. Bootstrap creates least-privilege SAs (apd-payment-sa, apd-deploy-sa), WIF pool github-apd bound to this repo, secret shells. No Owner/Editor, no JSON keys.

## Payment API & Stripe integration
- Existing skills sufficient: payment-api, stripe, stripe-full, apd-gcp-access, gcloud. No new skills created or required.
- Dry-run mode fully operational: confirm=true gate on agent orders, local JSONL/JSON ledgers, charged always 0.
- Live mode remains blocked until Stripe identity verification completed in Dashboard. Provide ID documents when ready (never store in git, skills, or chat).

## Site & automation features continued
- Catalog, pay dry-run, orders, quotes, credit notes, intake, fulfillment, automation console, careflow, assistant pages ready.
- Local tools and worker dry-run paths enforced.
- Added this status update. Future: multi-currency dry-run, subscriptions, Firestore ledger, xAI 3D avatar interface (background).

Next operator action: complete GCP auth + provide PROJECT_ID to enable bootstrap and test secret versions.
Charged = 0 until explicit live confirmation after verification.

Future improvement log: enhance automation with scheduled local queue processing, multi-currency support in catalog, integrate Hugging Face video gen links for demos if requested, realistic 3D avatar for interactive operator interface.
