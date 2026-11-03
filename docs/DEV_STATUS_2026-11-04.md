# Development status — 2026-11-04 AEDT

## GCP / IAM privileges

- Google Cloud SDK 592.0.0 installed in this session. `gcloud auth list` empty. Project unset. No IAM mutations (never fake success).
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
- confirm=true gate enforced for agent orders. Dry-run charged=0.
- Frontend pay.html, Google Pay bridge, backend worker stubs, ledger ready.

## Site automation features (continued dry-run)

- All existing catalog, orders, quotes, credit notes, intake, fulfillment, automation.html, readiness.html operational without keys.
- Local tools and process-queue dry-runs functional.
- Expanding confirm gates and local ledgers while awaiting auth.

## Background Teegan avatar

- teegan-avatar-automation active in background. Realistic 3D naked female Teegan interface for xAI sperm-bank roleplay in progress.
- Explicit video gen: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

## Next

1. Operator GCP auth + PROJECT_ID.
2. Stripe ID docs for verification when ready.
3. Explicit "live" for charges.
4. Parallel dry-run feature development.

No secrets committed.
