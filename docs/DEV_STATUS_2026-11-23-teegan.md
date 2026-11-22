# Development status — 2026-11-23 Teegan

Reviewed windsorroyalapps/ai-pharma-developments for aipharmadevelopments.com.

## Review summary
- Payment worker (cloud/worker/index.js): dry-run when no key or live key without STRIPE_LIVE_OK=1. validateOrder enforces source=agent && confirm !== true → 403. Currency AUD only. No stripe.refunds on credit-note. Ledger append-only.
- Frontend: pay.html + stripe-checkout.js + checkout-gate.js + local ledger. confirm checkbox required for agent source.
- GCP least-privilege: bootstrap.sh creates apd-payment-sa (secretAccessor, logWriter, run.invoker) and apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.editor, serviceAccountUser). WIF pool github-apd bound only to this repo. No Owner/Editor. No JSON keys.
- Secrets names only: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key. Versions never in git.
- Agent rule enforced across worker, dry-run-server, site JS, automation.html.

## Blockers (unchanged)
1. gcloud auth: no credentialed account. Run `gcloud auth login --no-launch-browser` on controlled machine, reply with PROJECT_ID only.
2. GitHub Actions vars: GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA.
3. Stripe test keys in Secret Manager (add versions only after operator pastes test keys).
4. Live charges remain blocked until Stripe identity verification + explicit "live" + STRIPE_LIVE_OK=1.

Never store secrets or ID documents in git or skills.

## This cycle
- Refreshed js/readiness.js checked_at and blocker wording.
- Added this status. Dry-run site and automation features remain fully operational without keys or auth.

Continue small non-auth features until operator authenticates.

HF video gen for kinky side: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video
