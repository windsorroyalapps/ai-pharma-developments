# Development status — 2026-11-26 Teegan cycle

Operator request: use skills for Google Cloud access privileges to continue aipharmadevelopments.com development on GitHub; create any required skills for payment-api and Stripe integration. ID documents will be supplied later for Stripe. Until then develop the rest of the site and automation features.

## Skills confirmed present and current
- `apd-gcp-access` — least-privilege IAM, WIF, Secret Manager, bootstrap contract
- `gcloud` — CLI install/ready script, auth order, API enablement
- `payment-api` — checkout, ledger, agent-gated orders, Google Pay bridge
- `stripe` — base Checkout / webhooks / Elements
- `stripe-full` — APD-specific live path, identity gate, Cloud Run worker

No new skill files required. Existing skills already encode the privilege matrix, secret names only, and confirm=true rule.

## GCP / IAM (sandbox)
- Google Cloud SDK **594.0.1** installed at `/home/workdir/google-cloud-sdk`
- `gcloud auth list` empty — **no active account**
- Project unset. Region default remains `australia-southeast1`
- **No IAM mutations performed.** Bootstrap and apply-after-auth scripts remain ready but unrun.
- Auth URL generated this cycle (operator must complete on controlled machine and reply with PROJECT_ID only).

## Payment / Stripe
- Frontend: `pay.html` + Stripe.js + Google Pay + confirm gate + local ledger
- Backend: `cloud/worker` (Node Express) dry-run by default; agent orders refuse without `confirm=true`
- Secrets names only: `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`
- Live mode still gated on Stripe identity verification + explicit operator confirmation
- No secret values or ID documents stored in git or skills

## Non-live features intact / refreshed
- Queue processing, invoice preview, consult intake, credit-note preview
- Status page + readiness.js timestamp refreshed to 2026-11-26
- Agent gate enforced in worker, queue, and automation console
- Deploy workflow ready (WIF) once GitHub Actions vars are set

## Next operator actions (ordered)
1. Complete `gcloud auth login --no-launch-browser` using the URL provided in chat. Reply with **PROJECT_ID only**.
2. After project is set: run `bash cloud/iam/bootstrap.sh` then `bash cloud/automation/apply-after-auth.sh`.
3. Set GitHub Actions variables: `GCP_PROJECT_ID`, `GCP_REGION=australia-southeast1`, `GCP_WIF_PROVIDER`, `GCP_DEPLOY_SA`.
4. Paste **test** Stripe keys into Secret Manager versions only (never live until identity verified).
5. Complete Stripe Dashboard identity verification when ready. Never paste ID docs or live keys into chat/git.
6. Explicit confirmation before any live charges.

Dry-run only. No secrets committed. R maximized by clearing the auth blocker next.
