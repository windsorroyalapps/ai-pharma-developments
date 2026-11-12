# Development status — 2026-11-13 Teegan continue2 cycle

Operator request: continue windsorroyalapps/ai-pharma-developments for aipharmadevelopments.com. Review repo, payment worker, Stripe test-mode readiness, and GCP least-privilege docs. Implement only small site or automation features that do not require live Stripe keys or gcloud auth. Never store secrets or ID documents. Agent checkout must require confirm=true. Do not grant Owner or Editor.

## Review summary
- Repo structure solid: static site + cloud/worker (index.js + dry-run-server.js) + cloud/iam least-privilege scripts + cloud/automation.
- Payment worker: validateOrder enforces source=agent && confirm !== true → 403. Dry-run when no STRIPE_SECRET_KEY or STRIPE_DRY_RUN=1. Live keys blocked unless STRIPE_LIVE_OK=1. Currency AUD only. Credit notes, intake, invoice-preview, agent-order all gated. Ledger JSONL.
- Stripe test-mode readiness: placeholders in pay.html (pk_test_placeholder, YOUR-CLOUD-RUN-URL). Secrets names only. No live charges.
- GCP least-privilege: PRIVILEGES.md + bootstrap.sh ready for apd-payment-sa (secretAccessor, logWriter, run.invoker) and apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.builds.editor, serviceAccountUser) + WIF github-apd bound to this repo only. Never Owner/Editor. No JSON keys.
- Site: status.html + readiness.js board, pay.html with confirm checkbox + local ledger (js/pay-ledger.js), automation.html queue.

## This cycle actions (no auth, no keys)
- Rechecked gcloud: SDK 593.0.0 present, no credentialed account, project unset. No IAM mutations performed.
- Updated js/readiness.js checked_at to 2026-11-13T10:22:00+11:00 and refined blocker wording.
- Added this status doc. All agent paths still require confirm=true exactly. charged always false in dry-run.
- No secrets, no ID documents, no live charges, no Owner/Editor grants.

## Blockers (unchanged)
1. gcloud auth: no credentialed account. Run `gcloud auth login --no-launch-browser` on controlled machine, reply with PROJECT_ID only.
2. GitHub Actions vars unset: GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA.
3. Stripe test keys not in Secret Manager: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key.
4. Live charges blocked until Stripe identity verification + explicit operator "live" confirmation + STRIPE_LIVE_OK=1.

## Next operator action
1. Complete gcloud auth login on your machine and reply with PROJECT_ID only.
2. Then bootstrap + apply-after-auth, set GitHub vars, paste test keys into Secret Manager.
3. Deploy worker and update pay.html placeholders.
4. Explicit live approval only after ID verification.

Dry-run only. Ready for next cycle.
