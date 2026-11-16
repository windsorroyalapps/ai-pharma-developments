# Development status — 2026-11-16 Teegan cycle

Operator request: use apd-gcp-access skill for GCP privileges on aipharmadevelopments, create/use payment-api + stripe skills, develop site automation features until Stripe ID docs provided. No live keys or ID docs stored.

## GCP / IAM (apd-gcp-access + gcloud)
- gcloud SDK 593.0.0 installed in sandbox. `gcloud auth list` empty. Project unset. No mutations performed. Login still required.
- Auth URL generated via `gcloud auth login --no-launch-browser` but sandbox cannot complete interactive code entry (EOF). Operator must complete on controlled machine and reply with PROJECT_ID only.
- Least-privilege contract unchanged: apd-payment-sa (secretAccessor, logWriter, run.invoker), apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.editor, serviceAccountUser), WIF github-apd bound only to this repo. Bootstrap.sh and apply-after-auth.sh ready but unrun.
- Secrets names only: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key. Test key versions after operator pastes. Live after ID verification + explicit confirm.

## Payment / Stripe skills
- payment-api, stripe, stripe-full skills active. Dry-run enforced. Agent orders require confirm=true. Currency AUD only. No live charges.
- Worker (cloud/worker/index.js) handles create-checkout-session (dry if no key), webhook, intake, invoice-preview, credit-note, agent-order, ledger. Pub/Sub fulfillment stub ready.

## Site features (non-live)
- pay.html + stripe-checkout.js + google-pay.js + pay-ledger.js: dry-run Checkout, local ledger, confirm gate.
- status.html + readiness.js: blockers listed, timestamped.
- automation.html, consult.html, careflow.html, assistant.html present. Queue processing in cloud/automation/process-queue.js.
- GitHub Actions deploy-worker.yml and site-check.yml ready for WIF once vars set.

## Next operator actions
1. Run `gcloud auth login --no-launch-browser` on your machine. Complete and reply with PROJECT_ID only (no keys).
2. When ready for live: complete Stripe identity verification (supply ID docs privately). Never paste into chat or git.
3. After project set: bash cloud/iam/bootstrap.sh && bash cloud/automation/apply-after-auth.sh. Set GitHub Actions vars: GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA.
4. Explicit "live" confirmation before any real charges.

No secrets committed. Dry-run only. Avatar automation background loop active per teegan-avatar skill.
