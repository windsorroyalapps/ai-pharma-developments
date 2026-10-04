# Payment and GCP status — 2026-10-04 (evening AEDT)

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`.

No new payment or Stripe skill is required. Those skills already cover Checkout, webhooks, Google Pay, Secret Manager names, and the agent `confirm=true` gate. Identity documents stay out of git and out of skills. Complete Stripe identity in the Stripe Dashboard when ready. Do not paste ID documents into chat or the repo.

## Blocker

Google Cloud SDK is installed in the sandbox. `gcloud auth list` shows zero credentialed accounts. Project is unset. `cloud/iam/bootstrap.sh` was not run. Service accounts, WIF, and secret shells are not created.

A `gcloud auth login --no-launch-browser` attempt printed a one-time URL and then exited (EOF) because this session cannot keep the verification prompt open. That URL is not reusable. Authenticate from a terminal you control, then reply with only the project id:

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project PROJECT_ID
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```

Privilege matrix: `cloud/iam/PRIVILEGES.md`.

## Least privilege bootstrap will create (not yet applied)

- `apd-payment-sa` — secretmanager.secretAccessor, logging.logWriter, run.invoker
- `apd-deploy-sa` — run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser
- WIF pool `github-apd` / provider `github`, bound only to `windsorroyalapps/ai-pharma-developments`
- Secret shells (no versions): `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`
- Region: `australia-southeast1`
- Pub/Sub topic `apd-fulfillment` via `cloud/automation/apply-after-auth.sh`

Never grant Owner or Editor to the runtime SA. No JSON keys in git.

## Built without live keys

- `pay.html` local dry-run ledger (`apd_ledger`)
- `js/catalog.js` fixed SKUs for consult, scoping, retainer, support
- `orders.html` reads the local ledger
- `automation.html` intake, confirm-gated agent queue, SKU presets, local fulfillment mark, JSON export
- `status.html` privilege checklist plus health probe
- Worker dry-run sessions when `STRIPE_SECRET_KEY` is absent
- Agent path refuses orders unless `confirm=true` and still does not charge
- `cloud/worker/fulfillment.js` publishes only when `FULFILLMENT_TOPIC` is set and the session is not dry-run
- `tools/dry-run-check.js` asserts the confirm gate and no-charge flag locally (`node tools/dry-run-check.js`)

## Still waiting

- Operator GCP login and project id
- Stripe identity documents (Dashboard only)
- Test key versions in Secret Manager
- GitHub Actions variables `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_WIF_PROVIDER`, `GCP_DEPLOY_SA`
- Live mode only after an explicit operator confirmation
