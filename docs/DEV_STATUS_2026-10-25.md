# Development status — 2026-10-25 (session update)

## GCP access privileges
- gcloud SDK 590.0.1 installed. No credentialed accounts. Project unset.
- Auth login URL generated this session (sandbox EOF on code entry expected). Operator must complete auth on controlled machine:
  ```bash
  gcloud auth login --no-launch-browser
  gcloud auth application-default login --no-launch-browser
  gcloud config set project YOUR_PROJECT_ID
  gcloud config set compute/region australia-southeast1
  bash cloud/iam/bootstrap.sh
  bash cloud/automation/apply-after-auth.sh
  bash cloud/iam/print-github-vars.sh
  ```
- Reply with PROJECT_ID only. Least-privilege bootstrap ready (apd-payment-sa, apd-deploy-sa, WIF github-apd). No Owner/Editor, no JSON keys, no mutations. Do not invent project IDs.

## Payment API & Stripe
- Skills present and sufficient: payment-api, stripe, stripe-full, apd-gcp-access, gcloud. No new skills required.
- Dry-run operational: confirm=true gate, local ledgers, charged=0. Test keys after bootstrap via add-test-secrets.sh.
- Live mode blocked until Stripe Dashboard identity verification. Provide ID documents when ready (never in git/skills/chat).

## Site & automation features (continued)
- All pages, worker dry-run, local tools, gated flows ready.
- Status tracking updated.
- Future: xAI-powered realistic 3D avatar interface (background automation noted).

Next: operator auth + PROJECT_ID → bootstrap → test secrets → deploy → GitHub Actions vars.
Charged = 0 until explicit live confirmation.

Future improvement log: multi-currency, subscriptions, Firestore ledger, Hugging Face video gen integration for demos, realistic 3D avatar for operator interface.
