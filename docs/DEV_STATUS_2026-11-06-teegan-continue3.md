# Development status — 2026-11-06 05:20 UTC Teegan continue

Operator: use skills for GCP access privileges + payment/Stripe integration. ID docs later for Stripe live. Develop rest of site + automation features until then.

## Skills applied (no new skill needed)
- apd-gcp-access — least-privilege plan, bootstrap, secrets names only
- gcloud — SDK 592 ready, auth required
- payment-api — checkout, ledger, agent-gated orders
- stripe / stripe-full — Checkout + Google Pay + webhooks; live blocked on ID verification + explicit "live"

## GCP
- gcloud present at /root/google-cloud-sdk/bin/gcloud
- No credentialed accounts. Project unset. Zero IAM mutations.
- Auth URL (run on your machine, then reply PROJECT_ID only):

https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=WGHxkm9026zWapDkwWHZGeA8pvYqq7&prompt=consent&token_usage=remote&access_type=offline&code_challenge=SLkGj24gQjEf2sx0ygVF4d5zYYsZYAbIGeyg8_lBXZQ&code_challenge_method=S256

After auth:
```bash
gcloud config set project PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

Creates:
- apd-payment-sa (secretAccessor, logWriter, run.invoker)
- apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.builds.editor, serviceAccountUser)
- WIF pool github-apd bound only to windsorroyalapps/ai-pharma-developments
- Secret shells: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key

## Stripe / Payment
- Live mode gated. confirm=true required for all agent orders.
- Dry-run fully operational (worker, process-queue, ledgers, credit notes, fulfillment stubs).
- No keys or ID documents in repo. You supply ID docs to Stripe Dashboard when ready; then paste test keys only into Secret Manager versions.

## Site automation features continuing without live keys
- pay.html + stripe-checkout.js + google-pay.js dry-run ready
- automation.html local queue + ledger
- process-queue.js handles: order, consult_intake, support_ticket, invoice_preview, subscription_preview, fulfillment
- readiness.html + status blockers
- tools/* dry-run validators

## Next high-R actions (after PROJECT_ID)
1. Bootstrap IAM + secrets shells
2. Add test key versions only
3. Deploy worker to Cloud Run (australia-southeast1)
4. Wire CREATE_CHECKOUT_SESSION_URL + publishable key in pay.html
5. GitHub Actions vars (GCP_PROJECT_ID, GCP_REGION, GCP_WIF_PROVIDER, GCP_DEPLOY_SA)
6. Expand dry-run fulfillment + Pub/Sub after deploy

No live charges until you explicitly say "live" after ID verification.

Background: Teegan avatar automation continues in parallel (3D interface / HF video gen hooks).
