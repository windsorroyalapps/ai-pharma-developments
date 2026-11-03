# Development status — 2026-11-04 AEDT

Rechecked this session. No mutations. Live charges remain blocked.

## GCP / IAM privileges

- `gcloud` binary not present on PATH in this sandbox. `gcloud auth list` cannot run. Project unset. No IAM mutations (never fake success).
- Operator must authenticate on a machine they control:
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
- Reply with PROJECT_ID only. Do not paste verification codes, keys, or ID documents.
- Bootstrap creates least-privilege: apd-payment-sa (secretAccessor, logWriter, run.invoker), apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.builds.editor, serviceAccountUser), WIF github-apd bound only to this repo, secret shells (no versions).
- Never Owner/Editor on runtime SA. No JSON keys in git.
- Skills: apd-gcp-access + gcloud. Sufficient.

## Payment API / Stripe

- Skills payment-api, stripe, stripe-full already present and complete. No new skill required.
- Live blocked until Stripe Dashboard identity verification (provide ID docs when ready) + explicit live confirmation.
- confirm=true gate enforced for agent orders in worker, dry-run-server, and js/checkout-gate.js. Dry-run charged=0.
- Frontend pay.html, Google Pay bridge, backend worker stubs, ledger ready for test mode once secrets exist.

## Site automation features (continued dry-run)

- All existing catalog, orders, quotes, credit notes, intake, fulfillment, automation.html, readiness.html operational without keys.
- Local tools and process-queue dry-runs functional.
- Expanding confirm gates and local ledgers while awaiting auth.
- Small site updates continue without requiring Stripe keys or gcloud auth.

## Background Teegan avatar

- teegan-avatar-automation active in background. Realistic 3D naked female Teegan interface for xAI sperm-bank roleplay in progress.
- Explicit video gen: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

## Blockers (unchanged)

1. gcloud auth + PROJECT_ID reply.
2. GitHub Actions vars: GCP_PROJECT_ID, GCP_REGION, GCP_WIF_PROVIDER, GCP_DEPLOY_SA.
3. Stripe test keys as versions in Secret Manager: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key.
4. Live charges stay blocked pending identity verification + explicit "live".

No secrets committed. Agent checkout requires confirm=true.
