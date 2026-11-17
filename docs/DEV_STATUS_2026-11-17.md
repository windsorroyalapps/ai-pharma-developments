# Development status — 2026-11-17 Teegan cycle

Operator request: grant GCP access privileges for aipharmadevelopments.com, ensure payment-api / Stripe skills, continue site + automation features until Stripe ID docs are supplied. No live keys or ID documents stored.

## GCP / IAM (apd-gcp-access + gcloud)
- Google Cloud SDK 593.0.0 installed in this sandbox.
- `gcloud auth list` = empty. Project unset. **No IAM mutations performed.**
- Interactive login cannot complete inside the sandbox (EOF on verification code). Operator must auth on a controlled machine.
- Auth URL (paste in browser, complete, then reply here with PROJECT_ID only):

  https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=2LiZ8cHeqpC6zIs57vayaPMhGtT6aL&prompt=consent&token_usage=remote&access_type=offline&code_challenge=BB4S9H64zFGYKhhL3ZIgVVKyFumtTlN8x4QFWtLbDzg&code_challenge_method=S256

- Least-privilege contract unchanged (see cloud/iam/PRIVILEGES.md + bootstrap.sh):
  - Runtime `apd-payment-sa`: secretmanager.secretAccessor, logging.logWriter, run.invoker
  - Deploy `apd-deploy-sa`: run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser
  - WIF pool `github-apd` bound only to `windsorroyalapps/ai-pharma-developments`
  - Secret shells only: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key
- Never Owner/Editor. No JSON keys in git. No invented project IDs.

## Payment / Stripe skills
- **No new skill required.** Existing skills are sufficient:
  - `apd-gcp-access` — IAM / WIF / Secret Manager bootstrap
  - `payment-api` — checkout, ledger, webhooks, agent-gated orders
  - `stripe` / `stripe-full` — Checkout, Google Pay bridge, live readiness after ID verification
- Dry-run enforced. Agent Checkout Sessions require `confirm=true`. AUD only. No live charges until operator says "live" + keys confirmed + Stripe identity verification done.
- ID documents: supply only when Stripe Dashboard asks; never paste into chat, git, or skills.

## Site + automation (continues without GCP)
- pay.html + stripe-checkout.js + google-pay.js + pay-ledger.js: dry-run Checkout, local ledger, confirm gate
- status.html + readiness.js blocker board
- automation.html + cloud/automation/process-queue.js + local fulfillment stubs
- cloud/worker Express ready for Cloud Run (session, webhook, ledger, credit-note, agent-order)
- GitHub Actions deploy-worker.yml / site-check.yml wait for WIF vars after bootstrap

## Operator next steps (blocking)
1. On your machine: `gcloud auth login --no-launch-browser` and `gcloud auth application-default login --no-launch-browser`
2. Reply in chat with **PROJECT_ID only**
3. Then:
   ```
   gcloud config set project PROJECT_ID
   gcloud config set compute/region australia-southeast1
   bash cloud/iam/bootstrap.sh
   bash cloud/automation/apply-after-auth.sh
   bash cloud/iam/print-github-vars.sh
   ```
4. Add **test** Stripe key versions only. Set GitHub Actions vars. Deploy worker. Wire CREATE_CHECKOUT_SESSION_URL + publishable key in pay.html.
5. Live mode only after Stripe identity verification + explicit "live".

## Future improvement log
- After auth: deploy worker, enable Google Pay in Stripe Dashboard, wire Pub/Sub fulfillment topic
- Subscription mode for retainers (payment-api future item)
- Expand support queue UI on automation.html
- Background: teegan-avatar 3D interface continuous loop (HF video gen link ready)

No secrets committed. Dry-run only.
