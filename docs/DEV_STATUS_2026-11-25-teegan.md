# Development status — 2026-11-25 Teegan cycle

Operator request: use apd-gcp-access skill for Google Cloud privileges to continue aipharmadevelopments.com development on GitHub. Ensure payment-api and stripe skills. Provide ID docs later for Stripe live access. Until then develop rest of site and automation features.

## GCP / IAM status (apd-gcp-access + gcloud)
- Google Cloud SDK 594.0.1 installed in sandbox.
- `gcloud auth list` empty. Project unset. **No IAM mutations performed.**
- Fresh auth URL generated via `gcloud auth login --no-launch-browser`.
- Operator must complete login on controlled machine, paste verification code if needed, then set PROJECT_ID and run `bash cloud/iam/bootstrap.sh`.
- Privileges planned: apd-payment-sa (secretmanager.secretAccessor, logging.logWriter, run.invoker), apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser + WIF).
- Secrets names only: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key. No values or ID docs stored.

## Skills confirmed
- apd-gcp-access, gcloud, payment-api, stripe, stripe-full all present and aligned.
- Agent rule enforced: Checkout Sessions require confirm=true.

## Site / automation status
- Static site + pay.html + js/stripe-checkout.js + cloud/worker (dry-run + live gated) + cloud/iam/bootstrap.sh + cloud/automation ready.
- Placeholders remain: YOUR-CLOUD-RUN-URL and pk_test_placeholder in pay.html until deploy.
- Dry-run features (local ledger, confirm gate, automation queue) operational without charges.
- No live keys until Stripe identity verification complete.

## Next after privileges
- Run bootstrap.sh after PROJECT_ID set.
- Deploy Cloud Run worker via WIF.
- Replace placeholders in pay.html.
- Extend ledger to Firestore, add Pub/Sub fulfillment.
- Wait for operator-supplied Stripe ID documents before any live-mode work.

Never invent project IDs. Never store ID documents or secret key values in git or skills.
