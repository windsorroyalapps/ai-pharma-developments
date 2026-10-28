# Development status — 2026-10-28 (updated)

## GCP / IAM

- Skills: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full` confirmed loaded. No new skills required.
- Sandbox has no authenticated gcloud (install blocked by permissions; previous status noted SDK but current session clean). No active account. Project unset. IAM not mutated. Bootstrap not executed.
- Operator must run `gcloud auth login --no-launch-browser` on a trusted machine you control, then reply with PROJECT_ID only. Do not paste verification codes, keys, or ID docs here.
- After auth + PROJECT_ID: execute `bash cloud/iam/bootstrap.sh` then `bash cloud/automation/apply-after-auth.sh`.

## Payment / Stripe

- Existing skills sufficient for Checkout, webhooks, Google Pay, ledger, agent-gated orders (confirm=true required).
- Live mode blocked until you supply ID documents for Stripe identity verification and explicitly authorize "live".
- Continue dry-run development of site features: automation.html, queues, quotes, credit notes, intake, fulfillment.

## Next

Expand local dry-run hooks and confirm=true gates. Site ready for further automation without live keys.

## Future improvement

Once PROJECT_ID provided and auth complete: store test Stripe key versions in Secret Manager, set GitHub Actions vars (GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA), deploy worker.
