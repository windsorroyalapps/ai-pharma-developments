# Payment and GCP status — 2026-10-08 15:11 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required. Those skills already cover least-privilege IAM, Checkout, webhooks, Google Pay, ledger, and the `confirm=true` agent gate.

Identity documents stay out of git, skills, and chat. Complete Stripe identity in the Stripe Dashboard when ready. Test keys can be added before live verification. Live charges stay blocked until you say live and keys are confirmed.

## Blocker

Google Cloud SDK is installed in the agent session. `gcloud auth list` has zero credentialed accounts. Project is unset. A `--no-launch-browser` login printed a URL and died on EOF because this session cannot accept the verification code. That URL and PKCE challenge are dead. Do not reuse it. IAM was not mutated. Do not treat any service account, WIF pool, or secret as created.

Run login on a machine you control, paste the verification code into that same process, then reply with only the project id:

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

After the worker is deployed:

```bash
WORKER_URL=https://apd-payment-worker-xxxx.a.run.app bash cloud/automation/create-scheduler.sh
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
- Quote builder at `quotes.html` and `node cloud/automation/build-quote.js`
- Automation console queue (confirm=true required, no charge)
- Research pipeline board at `pipeline.html`
- Worker dry-run sessions when `STRIPE_SECRET_KEY` is absent
- `node tools/stripe-test-readiness.js` checks site and worker paths without calling Stripe
- Consult intake posts to the worker `/intake` when `window.INTAKE_URL` is set, otherwise mailto
- Daily agent automation `apd-site-dev` continues this path until GCP login exists

## Still waiting

- Operator GCP login and project id
- Stripe identity in Dashboard only
- Test key versions in Secret Manager
- GitHub Actions variables `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_WIF_PROVIDER`, `GCP_DEPLOY_SA`
- Live mode only after an explicit operator confirmation
