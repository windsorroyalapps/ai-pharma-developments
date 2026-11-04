# Development status — 2026-11-04 21:15 AEDT

Session continued. gcloud SDK present at /root/google-cloud-sdk. Auth list empty, project unset. No mutations performed. Operator must auth on controlled machine (sandbox login dies with EOF).

## GCP / IAM privileges

- Operator must complete auth on controlled machine:
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
- Reply with PROJECT_ID only. Do not paste codes, keys, or ID docs.
- Bootstrap (pending auth): least-privilege apd-payment-sa (secretAccessor, logWriter, run.invoker), apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.builds.editor, serviceAccountUser), WIF github-apd bound only to windsorroyalapps/ai-pharma-developments, secret shells stripe-secret-key / stripe-webhook-secret / stripe-publishable-key.
- Skills apd-gcp-access + gcloud sufficient. No new skill created or required.

## Payment API / Stripe

- Skills payment-api, stripe, stripe-full complete. No additional skill required.
- Live blocked pending Stripe ID verification (provide docs when ready) + explicit live confirmation.
- confirm=true gate active. Dry-run charged=0.
- Frontend (pay.html + js) and backend (cloud/worker) stubs ready for test keys.
- Site features for automation continue in dry-run: catalog, orders, quotes, credit notes, intake, fulfillment, local ledgers, agent gates.

## Site automation features

- Catalog, orders, quotes, credit notes, intake, fulfillment, automation.html, readiness.html, gcp-access.html operational in dry-run.
- Local tools in tools/ functional. Expanding confirm gates and local ledgers.
- Small site updates continue without keys or auth. Ready for further automation development.

## Background Teegan avatar

- teegan-avatar-automation active. Realistic 3D naked female Teegan for xAI sperm-bank roleplay in progress.
- Explicit video gen link: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

## Blockers

1. gcloud auth + PROJECT_ID reply.
2. GitHub Actions vars (GCP_PROJECT_ID, GCP_REGION, GCP_WIF_PROVIDER, GCP_DEPLOY_SA).
3. Stripe test keys in Secret Manager.
4. Live charges blocked pending ID verification + "live".

No secrets committed. Agent checkout requires confirm=true.
