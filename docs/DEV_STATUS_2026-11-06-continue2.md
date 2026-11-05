# Development status — 2026-11-06 continue 2

gcloud: SDK 592 installed in sandbox. No credentialed accounts. Project unset. No IAM mutations performed. bootstrap.sh not run.

## Changes this pass (non-live, dry-run only)
- Extended `cloud/automation/process-queue.js` with `support_ticket` type (email + subject required; always charged: false; agent items still require confirm=true).
- Added sample support_ticket item to `cloud/automation/sample-queue.json`.
- Updated dry-run worker health response to advertise support_ticket capability.
- All agent orders continue to require confirm=true. No live charges. No Stripe keys or ID documents stored.

## Operator next steps
1. Authenticate on a machine you control:
   ```bash
   gcloud auth login --no-launch-browser
   gcloud auth application-default login --no-launch-browser
   gcloud config set project YOUR_PROJECT_ID
   gcloud config set compute/region australia-southeast1
   ```
2. Reply with PROJECT_ID only (do not paste verification code, keys, or ID docs).
3. Then:
   ```bash
   bash cloud/iam/bootstrap.sh
   bash cloud/automation/apply-after-auth.sh
   bash cloud/iam/print-github-vars.sh
   ```
4. Add Stripe test key versions to Secret Manager (names only). Live keys after ID verification and explicit "live" confirmation.
5. Set GitHub Actions variables: GCP_PROJECT_ID, GCP_REGION, GCP_WIF_PROVIDER, GCP_DEPLOY_SA.

Continue expanding dry-run features (checkout, ledger, consult intake, Cloud Run worker, docs) until auth and project are available.
