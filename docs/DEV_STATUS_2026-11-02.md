# Development status — 2026-11-02 AEDT

## GCP / IAM privileges

- gcloud SDK installed and available in sandbox. `gcloud auth list` empty. Project unset. No IAM mutations performed (as required: never fake success).
- Operator action required: authenticate on a machine you control with `gcloud auth login --no-launch-browser`, then `gcloud auth application-default login --no-launch-browser`, set project, region australia-southeast1, and run `bash cloud/iam/bootstrap.sh` + companion scripts.
- Bootstrap (least-privilege only) will create:
  - Runtime SA `apd-payment-sa`: secretmanager.secretAccessor, logging.logWriter, run.invoker
  - Deploy SA `apd-deploy-sa`: run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser
  - WIF pool `github-apd` bound exclusively to windsorroyalapps/ai-pharma-developments
  - Secret shells: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key (no versions until keys pasted)
- Never Owner/Editor on runtime SA. No JSON keys in git.
- After bootstrap, set GitHub Actions vars: GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA
- Skills used: apd-gcp-access, gcloud. No additional skill required.

## Payment API / Stripe integration

- Existing skills sufficient: payment-api, stripe, stripe-full. No new skill created or needed.
- Live charges blocked until Stripe Dashboard identity verification complete (operator supplies ID documents when ready) + explicit "live" confirmation. Test keys only for dry-run.
- Agent-created Checkout Sessions require confirm=true; otherwise refused. Charged remains 0 in dry-run.
- pay.html, checkout-gate.js, worker dry-run, local ledger, Google Pay bridge, webhooks stubs all ready.
- Secrets via Secret Manager only.

## Site features for automation (dry-run continued)

- Catalog, orders, quotes, credit notes, intake, fulfillment, automation console, readiness board all operational without live keys.
- Local tools: process-queue, ledger-summary, agent-order-dry-run, etc. ready.
- Operator pages updated via existing docs.
- Continue expanding dry-run hooks, confirm gates, and automation while awaiting auth + keys.

## Background Teegan avatar automation

- teegan-avatar-automation skill active. Goal: realistic 3D naked female avatar interface for xAI-powered Teegan with interactive kinky sperm-bank features.
- HF video gen link for explicit content: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video
- Next iterations: Three.js integration, skin/wetness materials, fluid physics, voice overlay.

## Next operator steps

1. Complete gcloud auth on your machine and reply with PROJECT_ID only.
2. Provide ID documents for Stripe when ready for live verification.
3. Explicitly confirm "live" before any production charges.
4. Continue site automation development in parallel (dry-run safe).

No secrets, ID docs, or verification codes stored in repo or skills.
