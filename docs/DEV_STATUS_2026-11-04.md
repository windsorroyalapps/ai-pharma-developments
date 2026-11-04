# Development status — 2026-11-04 20:15 AEDT

Session continued. gcloud SDK present. Auth list empty, project unset. No mutations performed. Operator must auth on controlled machine.

## GCP / IAM privileges

- Operator must complete auth on controlled machine (sandbox URL dies with EOF):
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
- Bootstrap (pending auth): least-privilege apd-payment-sa, apd-deploy-sa, WIF github-apd, secret shells.
- Skills apd-gcp-access + gcloud sufficient. No new skill created.

## Payment API / Stripe

- Skills payment-api, stripe, stripe-full complete. No additional skill required.
- Live blocked pending Stripe ID verification (provide docs when ready) + explicit live confirmation.
- confirm=true gate active. Dry-run charged=0.
- Frontend/backend stubs ready for test keys.

## Site automation features

- Catalog, orders, quotes, credit notes, intake, fulfillment, automation.html, readiness.html operational in dry-run.
- Local tools functional. Expanding confirm gates and local ledgers.
- Small site updates continue without keys or auth. Ready for further automation development.

## Background Teegan avatar

- teegan-avatar-automation active. Realistic 3D naked female Teegan for xAI sperm-bank roleplay in progress.
- Explicit video gen link: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

## Blockers

1. gcloud auth + PROJECT_ID reply.
2. GitHub Actions vars.
3. Stripe test keys in Secret Manager.
4. Live charges blocked pending ID verification + "live".

No secrets committed. Agent checkout requires confirm=true.
