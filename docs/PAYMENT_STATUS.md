# Payment and GCP status — 2026-10-03 (session)

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`.

No new payment or Stripe skill is required. Those skills already cover Checkout, webhooks, Google Pay, Secret Manager names, and the agent `confirm=true` gate.

## Blocker

This environment has the Google Cloud SDK installed under the agent home directory. `gcloud auth list` shows no credentialed accounts. Project is unset.

IAM was not mutated. `cloud/iam/bootstrap.sh` was not run. Do not treat service accounts, WIF, or secret shells as created.

A login URL from this sandbox is not reusable: the OAuth PKCE session ends when the CLI process exits. Authenticate from a terminal you control, or start a fresh login and paste the verification code in the same chat turn before the CLI exits.

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project PROJECT_ID
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```

## Least privilege the bootstrap will create (not yet applied)

- `apd-payment-sa` — secretmanager.secretAccessor, logging.logWriter, run.invoker
- `apd-deploy-sa` — run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser
- WIF pool `github-apd` / provider `github`, bound only to `windsorroyalapps/ai-pharma-developments`
- Secret shells (no versions): `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`
- Region: `australia-southeast1`

Never grant Owner or Editor to the runtime SA. No JSON keys in git. Do not commit ID documents.

## Built without live keys

- `pay.html` local dry-run ledger (`apd_ledger`)
- `orders.html` reads that ledger
- `automation.html` local intake and confirm-gated agent queue
- Worker dry-run sessions when `STRIPE_SECRET_KEY` is absent
- Agent path refuses orders unless `confirm=true` and still does not charge
- Post-auth script for topic `apd-fulfillment` (not applied)

## Still waiting

- Operator GCP login and project id
- Stripe identity documents (supply later; never commit them)
- Test key versions in Secret Manager
- GitHub Actions variables `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_WIF_PROVIDER`, `GCP_DEPLOY_SA`
- Live mode only after an explicit operator confirmation
