# Payment and GCP status — 2026-10-07 23:20 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required. Payment and Stripe skills already cover Checkout, webhooks, Google Pay, ledger, and the `confirm=true` agent gate.

Identity documents stay out of git, skills, and chat. Complete Stripe identity in the Stripe Dashboard when ready. Test keys can be added before live verification. Live charges stay blocked until you say live and keys are confirmed.

## Blocker

Google Cloud SDK  is installed in this session. `gcloud auth list` has zero credentialed accounts. Project is unset. A `--no-launch-browser` login printed a URL and died on EOF, so that URL and PKCE challenge are dead. Do not reuse it. IAM was not mutated. Do not treat any service account, WIF pool, or secret as created.

Run login on a machine you control, then reply with only the project id:

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

Privilege matrix: `cloud/iam/PRIVILEGES.md`.

## Least privilege bootstrap will create (not yet applied)

- `apd-payment-sa` — secretmanager.secretAccessor, logging.logWriter, run.invoker
- `apd-deploy-sa` — run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser
- WIF pool `github-apd` / provider `github`, bound only to `windsorroyalapps/ai-pharma-developments`
- Secret shells (no versions): `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`
- Region: `australia-southeast1`

Never grant Owner or Editor to the runtime SA. No JSON keys in git.

## Built without live keys

- Catalog, pay dry-run ledger, orders page with JSONL export
- Automation console queue (confirm=true required, no charge)
- Research pipeline board at `pipeline.html` (browser only, billing hold does not charge)
- Worker dry-run sessions when `STRIPE_SECRET_KEY` is absent
- `GET /healthz` and `GET /ready` report key mode without echoing secrets; `live_charges` stays false
- Checkout rejects non-AUD currency and request bodies that contain `sk_`, `pk_live_`, or `whsec_`
- `tools/stripe-test-readiness.js` fails CI if live key material is committed or the confirm gate is missing
- `tools/invoice-preview.js` prints a local AUD invoice from catalog SKUs and never charges
- `cloud/iam/add-test-secrets.sh` refuses `sk_live_` / `pk_live_`
- Weekday automation `apd-site-automation` continues site work and will not bind IAM until an account exists

## Still waiting

- Operator GCP login and project id
- Stripe identity in Dashboard only
- Test key versions in Secret Manager
- GitHub Actions variables `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_WIF_PROVIDER`, `GCP_DEPLOY_SA`
- Live mode only after an explicit operator confirmation
