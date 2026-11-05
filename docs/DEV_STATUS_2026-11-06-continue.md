# Development status — 2026-11-06 continue

gcloud: present, no credentialed accounts. Project unset. No IAM mutations. Login still required.

## Changes this pass (non-live only)
- Updated js/readiness.js with fresh checked_at (2026-11-06T09:17:00+11:00) and accurate blockers: no auth, project unset, secrets missing, Stripe ID verification pending. Confirmed confirm=true gate.
- Appended current sandbox status note to cloud/iam/PRIVILEGES.md (least-privilege docs). Login required before bootstrap.
- Updated status.html lead to record that gcloud login is still required.
- Confirmed process-queue.js still refuses agent items without confirm=true, handles consult_intake and invoice_preview as dry-run (charged: false).
- No Stripe live keys, no identity documents stored.

## Operator next steps
1. On a machine you control:
   ```bash
   gcloud auth login --no-launch-browser
   gcloud auth application-default login --no-launch-browser
   gcloud config set project YOUR_PROJECT_ID
   gcloud config set compute/region australia-southeast1
   ```
2. Reply with PROJECT_ID only.
3. Then run:
   ```bash
   bash cloud/iam/bootstrap.sh
   bash cloud/automation/apply-after-auth.sh
   bash cloud/iam/print-github-vars.sh
   ```
4. Add Stripe test key versions to Secret Manager (names only). Live keys after ID verification and explicit "live" confirmation.
5. Set GitHub Actions variables.

Agent checkout continues to refuse unless confirm=true. All features remain dry-run.
