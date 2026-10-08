# Payment and GCP status — 2026-10-09 09:42 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required.

Identity documents stay out of git, skills, and chat. Live charges stay blocked until the operator says live and keys are confirmed.

## Blocker

This session does not have `gcloud` on PATH. Apt install of `google-cloud-cli` failed (`setgroups` / `setegid` not permitted). `/root/google-cloud-sdk` is absent. `gcloud auth list` cannot run, so there is no credentialed account and no project. IAM was not mutated. `cloud/iam/bootstrap.sh` and `cloud/automation/apply-after-auth.sh` were not run.

No service-account emails and no WIF provider were created. Do not invent a project id.

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

## Built this pass (dry-run only)

## Least privilege bootstrap will create (not yet applied)

- `apd-payment-sa` — secretmanager.secretAccessor, logging.logWriter, run.invoker
- `apd-deploy-sa` — run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser
- WIF pool `github-apd` / provider `github`, bound only to `windsorroyalapps/ai-pharma-developments`
- Secret shells (no versions): `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`
- Region: `australia-southeast1`
- Artifact Registry repo: `apd-repo`

Never grant Owner or Editor to the runtime SA. No JSON keys in git.

## GitHub Actions variables the operator must set after bootstrap

- `GCP_PROJECT_ID`
- `GCP_REGION` = `australia-southeast1`
- `GCP_WIF_PROVIDER`
- `GCP_DEPLOY_SA`

## Built without live keys

- Catalog, pay dry-run ledger, orders page with JSONL export and import
- Quote builder at `quotes.html`
- Credit-note preview at `adjustments.html` and `tools/credit-note-preview.js` (no Stripe refund)
- `js/checkout-gate.js` shared confirm gate. Agent source without `confirm=true` is refused. `charged` stays false.
- `pay.html` source select and confirm checkbox. Stripe and Google Pay both call the gate before a local ledger row.
- Local ledger summary counts confirmed and refused rows. Export still forces `charged: false`.
- `tools/checkout-gate-check.js` wired into site-check.
- Automation console queue with JSONL import/export and local settle (confirm=true required, no charge)
- Fulfillment desk at `fulfillment.html` (local queue, charged=false)
- Research pipeline board at `pipeline.html`
- Worker dry-run sessions when `STRIPE_SECRET_KEY` is absent
- Keyless server `cloud/worker/dry-run-server.js`
- Local ledger summary `tools/ledger-summary.js` (refuses files that contain secret patterns)

## Still waiting

- Operator GCP login and a real project id
- Stripe identity in Dashboard only
- Test key versions in Secret Manager via `cloud/iam/add-test-secrets.sh`
- Live mode only after an explicit operator confirmation
