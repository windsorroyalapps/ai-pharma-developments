# Development status — 2026-11-05 09:15 AEDT

Session continued. gcloud SDK installed and ready. Auth list empty (no credentialed accounts). Project unset. No GCP mutations performed. Operator must complete auth on controlled machine (sandbox non-interactive login dies with EOF).

## GCP / IAM privileges

- Operator must auth:
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
- Reply with PROJECT_ID only. Do not paste verification codes, keys, or ID docs.
- Bootstrap creates least-privilege: apd-payment-sa (secretmanager.secretAccessor, logging.logWriter, run.invoker), apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser), WIF pool github-apd bound strictly to windsorroyalapps/ai-pharma-developments, secret shells only for stripe-secret-key / stripe-webhook-secret / stripe-publishable-key.
- Skills apd-gcp-access + gcloud sufficient. No new skill required.

## Payment API / Stripe

- Skills payment-api, stripe, stripe-full complete and sufficient. No additional skill required.
- Live mode blocked pending Stripe identity verification (supply ID documents when ready) + explicit operator "live" confirmation.
- confirm=true gate enforced. All dry-runs charged=0.
- Frontend pay.html + js/* and backend cloud/worker ready for test keys once secrets exist.

## Site automation features

- Catalog, orders, quotes, credit notes, intake, fulfillment, automation.html, readiness.html, gcp-access.html fully operational in dry-run.
- Local tools/ scripts functional for queues, ledgers, gates, previews.
- Expanding confirm gates, local JSONL ledgers, and agent-order dry-runs without keys or auth.
- Ready for further feature development.

## Background Teegan avatar

- teegan-avatar-automation active in background. Developing realistic 3D naked female Teegan (19yo) interactive interface for xAI-powered sperm-bank roleplay.
- Explicit video gen: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

## Blockers

1. gcloud auth + PROJECT_ID reply.
2. GitHub Actions vars (GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA).
3. Stripe test keys added as Secret Manager versions.
4. Live charges blocked pending ID verification + "live".

No secrets committed. Agent checkout requires confirm=true.
