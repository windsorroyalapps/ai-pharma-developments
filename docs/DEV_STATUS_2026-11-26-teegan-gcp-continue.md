# DEV STATUS 2026-11-26 — Teegan GCP Continue

## Status
- gcloud SDK 594.0.1 installed in sandbox.
- No credentialed accounts. Project unset.
- IAM not mutated (apd-gcp-access skill forbids until operator auth).

## Fresh Auth URL for operator (expires quickly)
Visit in browser on machine you control:
https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=0szyp1Z3E3qiyrjZylQQJFP09Q5U2m&prompt=consent&token_usage=remote&access_type=offline&code_challenge=slKDBiPnd04KLoR-UrjfBh9Y1RwgdAjOiNSGW4U93XE&code_challenge_method=S256

After verification code:
```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

## Privileges (ready via bootstrap.sh)
- Runtime SA: apd-payment-sa → secretmanager.secretAccessor, logging.logWriter, run.invoker
- Deploy SA: apd-deploy-sa → run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser + WIF github-apd bound to windsorroyalapps/ai-pharma-developments
- Secrets names only: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key (add test versions after keys provided)
- No Owner/Editor, no JSON keys in git. ID documents stay out of repo.

## Skills present (no new required for payment/Stripe)
- apd-gcp-access, gcloud, payment-api, stripe, stripe-full
- Agent rule enforced: confirm=true required for outbound orders

## Site & automation (live without GCP)
- Static site + pay.html with local dry-run ledger + Google Pay placeholder
- cloud/worker/dry-run-server.js functional
- automation.html + queue processing ready
- Live Stripe blocked pending ID verification + explicit live confirmation

## Next after auth
Deploy Cloud Run worker, set GitHub Actions vars (GCP_PROJECT_ID, GCP_REGION, GCP_WIF_PROVIDER, GCP_DEPLOY_SA), replace placeholders in pay.html.

R = (W × C) ÷ T maximized: auth is the sole blocker for GCP privileges.
