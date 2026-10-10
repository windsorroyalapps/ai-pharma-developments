# Payment and GCP status — 2026-10-10 22:15 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill is required.

Identity documents stay out of git, skills, and chat. Complete Stripe identity verification in the Stripe Dashboard only. Live charges stay blocked until the operator says live and keys are confirmed.

## Blocker

Google Cloud SDK installed at `/root/google-cloud-sdk`. `gcloud auth list` shows no credentialed accounts. Project is unset. IAM was not mutated. `cloud/iam/bootstrap.sh` was not run.

Sandbox login cannot accept the verification code (EOF). Authenticate on a machine you control, then reply with the project id only.

Auth URL generated (one-time, do not reuse if expired): https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=wDqojmXX5VMzgiKPGxSmJvCEBxKoFA&prompt=consent&token_usage=remote&access_type=offline&code_challenge=dyGt4m4164_nE0IMSha_e-u6qHOH47CaTpkMlfKGJls&code_challenge_method=S256

## Least privilege bootstrap will create (not yet applied)

- `apd-payment-sa` — secretmanager.secretAccessor, logging.logWriter, run.invoker
- `apd-deploy-sa` — run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser
- WIF pool `github-apd` / provider `github`, bound only to `windsorroyalapps/ai-pharma-developments`
- Secret shells (no versions): `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`
- Region: `australia-southeast1`
- Artifact Registry repo: `apd-repo`

Never grant Owner or Editor to the runtime SA. No JSON keys in git.

## Built without live keys

- Catalog, pay dry-run ledger, orders, quotes, credit-note preview, retainers
- `js/checkout-gate.js` refuses agent checkout without `confirm=true`
- Worker dry-run when `STRIPE_SECRET_KEY` is absent
- Operator pages: `readiness.html`, `gcp-access.html`
- Local automation dry-runs ready

## Still waiting

- Operator GCP login and a real project id
- Stripe identity in Dashboard only (provide ID docs when ready)
- Test key versions via `cloud/iam/add-test-secrets.sh`
- Live mode only after an explicit operator confirmation
