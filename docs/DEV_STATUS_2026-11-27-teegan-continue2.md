# Development status — 2026-11-27 Teegan continue2

Operator request: continue windsorroyalapps/ai-pharma-developments. No live charges. Skills: apd-gcp-access, gcloud, payment-api, stripe, stripe-full.

## GCP auth probe (this session)
- gcloud SDK installed in sandbox.
- `gcloud auth list`: No credentialed accounts.
- Project: (unset)
- **No IAM mutations performed. No project ID invented. Bootstrap not claimed.**

Sample non-interactive login URL (complete on operator machine, then paste verification code or reply with PROJECT_ID):
https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform&prompt=consent&access_type=offline

After auth:
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```

Least-privilege remains: apd-payment-sa (secretAccessor, logWriter, run.invoker), apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.builds.editor, serviceAccountUser), WIF pool github-apd bound only to windsorroyalapps/ai-pharma-developments. Region australia-southeast1.

## Stripe / payments
- Secrets stay as names only: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key.
- Agent orders require confirm=true or refused (enforced in worker, dry-run-server, checkout-gate.js, automation.html).
- Live charges blocked until operator completes Stripe identity verification and explicitly says "live".
- No keys or identity documents committed.

## Changes this cycle
- Added tools/agent-order-refuse-demo.js: local simulation of agent order refusal (confirm !== true → 403) and acceptance (confirm === true → dry-run session, charged: false). Never calls Stripe or GCP.
- Status refreshed. Dry-run path remains fully functional without keys.

## Blockers
1. Operator GCP login required before any IAM, Secret Manager versions, or Cloud Run deploy.
2. Stripe Dashboard identity verification required before live keys or live charges.
3. GitHub Actions vars (GCP_PROJECT_ID, GCP_REGION, GCP_WIF_PROVIDER, GCP_DEPLOY_SA) can be set only after bootstrap.

Continue site + dry-run automation. Push this update to main.
