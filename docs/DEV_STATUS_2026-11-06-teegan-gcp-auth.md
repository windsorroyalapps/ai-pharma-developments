# DEV STATUS 2026-11-06 — Teegan GCP Auth Gate

## Status
- gcloud SDK installed in sandbox.
- No credentialed accounts. Project unset.
- IAM not mutated (skill forbids until auth).

## Auth URL for operator (expires quickly)
Visit in browser on machine you control:
https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=lphlICEdT4q5WY8RqwtpAxcUFqCgeM&prompt=consent&token_usage=remote&access_type=offline&code_challenge=IA9bNlcwCtT20W2c0epnFBRgrB-CKWi4oq61sxwrW_4&code_challenge_method=S256

After code, paste verification code back or run on local machine:
```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

## Privileges (post-auth via bootstrap)
- Runtime: apd-payment-sa → secretmanager.secretAccessor, logging.logWriter, run.invoker
- Deploy: apd-deploy-sa → run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser + WIF github-apd bound to this repo
- Secrets names: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key (add test versions only after keys pasted)

## Skills present (no new ones required)
- apd-gcp-access, gcloud, payment-api, stripe, stripe-full
- Agent rule: confirm=true required for outbound orders

## Site ready without GCP
Static site + pay.html local dry-run + automation.html queue + dry-run-server.js all functional.
Live Stripe blocked pending ID verification.

## Next after auth
Deploy worker, set GH Actions vars, replace placeholders in pay.html.

R = (W × C) ÷ T maximized: auth is the sole blocker.