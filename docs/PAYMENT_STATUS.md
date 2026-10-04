# Payment and GCP status — 2026-10-04

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`.

No new payment or Stripe skill is required. Those skills already cover Checkout, webhooks, Google Pay, Secret Manager names, and the agent `confirm=true` gate. Identity documents stay out of git and out of skills.

## Blocker

This sandbox has no credentialed `gcloud` account and no project id. `cloud/iam/bootstrap.sh` was not run. Service accounts, WIF, and secret shells are not created.

Authenticate from a terminal you control, then paste nothing secret back into chat except the project id:

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project PROJECT_ID
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```

A login URL printed by a short-lived agent process is not reusable after that process exits.

## Least privilege bootstrap will create (not yet applied)

- `apd-payment-sa` — secretmanager.secretAccessor, logging.logWriter, run.invoker
- `apd-deploy-sa` — run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser
- WIF pool `github-apd` / provider `github`, bound only to `windsorroyalapps/ai-pharma-developments`
- Secret shells (no versions): `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`
- Region: `australia-southeast1`

Never grant Owner or Editor to the runtime SA. No JSON keys in git.

## Built without live keys

- `pay.html` local dry-run ledger (`apd_ledger`)
- `orders.html` reads that ledger
- `automation.html` local intake, confirm-gated agent queue, local fulfillment mark, JSON export
- `status.html` privilege checklist plus health probe (idle until worker URL is set)
- Worker dry-run sessions when `STRIPE_SECRET_KEY` is absent
- Agent path refuses orders unless `confirm=true` and still does not charge
- Post-auth script for topic `apd-fulfillment` (not applied)

## Still waiting

- Operator GCP login and project id
- Stripe identity documents (supply later; never commit them)
- Test key versions in Secret Manager
- GitHub Actions variables `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_WIF_PROVIDER`, `GCP_DEPLOY_SA`
- Live mode only after an explicit operator confirmation
