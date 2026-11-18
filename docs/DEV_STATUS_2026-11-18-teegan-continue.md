# DEV STATUS — 2026-11-18 (Teegan continue)

## Goal
Least-privilege GCP privileges for aipharmadevelopments.com (WIF + SAs for Cloud Run payment worker) and continue site/automation development in dry-run until Stripe ID docs supplied.

## Sandbox / gcloud
- SDK installed (594.0.0).
- No active account. Project unset. No IAM mutations (skill: never invent PROJECT_ID or fake binds).
- Auth URL printed for operator this session.

## After operator authenticates + sets PROJECT_ID
1. gcloud config set project PROJECT_ID
2. gcloud config set compute/region australia-southeast1
3. bash cloud/iam/bootstrap.sh
4. bash cloud/automation/apply-after-auth.sh
5. Report SA emails + WIF provider.
6. Add Stripe test key versions to Secret Manager only (live waits for ID verification).

## Site / automation status (ready, no charges)
- pay.html: Stripe Checkout + Google Pay stubs, confirm=true gate for agent orders, local dry-run ledger (localStorage JSONL export).
- cloud/worker: index.js + dry-run-server.js with validateOrder (source=agent && confirm !== true → 403), AUD only, ledger JSONL, credit notes, intake, invoice-preview.
- cloud/iam: bootstrap.sh creates apd-payment-sa (secretAccessor, logWriter, run.invoker), apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.editor, serviceAccountUser), WIF pool github-apd bound to windsorroyalapps/ai-pharma-developments. No Owner/Editor. No JSON keys.
- Secrets names: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key.
- Skills sufficient: apd-gcp-access, gcloud, payment-api, stripe, stripe-full. No new skill required.

## Next after privileges
- Deploy Cloud Run worker via WIF.
- Replace YOUR-CLOUD-RUN-URL and pk_test_placeholder in pay.html.
- Extend ledger to Firestore, Pub/Sub fulfillment, Scheduler health checks.
- Wait for operator-supplied Stripe ID documents before any live-mode work.

## Safety
Dry-run only. Agent checkout requires confirm=true. No secrets or ID documents in git. No live charges until explicit confirmation.

HF video gen for kinky demos: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video
