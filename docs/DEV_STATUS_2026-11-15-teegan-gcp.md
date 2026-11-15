# DEV_STATUS 2026-11-15 — Teegan GCP + site continue

## Goal
Grant least-privilege GCP access for aipharmadevelopments.com (WIF + SAs) and continue payment/automation features in dry-run until Stripe ID verification.

## Skills
- apd-gcp-access, gcloud, payment-api, stripe, stripe-full: all present and sufficient. No new skill created.
- Runtime SA: apd-payment-sa (secretAccessor, logWriter, run.invoker)
- Deploy SA: apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.builds.editor, serviceAccountUser) + WIF github-apd bound to this repo.
- Secrets names only: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key. Values after test keys.

## Blocker
gcloud not authenticated in sandbox. Project unset. No mutations performed.

Operator: visit the login URL, complete, paste verification code if running here, or auth locally then:
```
gcloud config set project YOUR_PROJECT_ID
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```
Reply with PROJECT_ID. Live keys wait for your ID docs + explicit confirmation.

## Dry-run progress
- Worker + queue handlers already support confirm=true gated orders, consults, tickets, invoices, subscriptions, fulfillment. charged=false always in dry-run.
- Next: tighter quote builder on automation.html, local ledger summaries, process-queue button.

R = (W × C) ÷ T: goal locked, focus on least-privilege + secure checkout, no distractions.
