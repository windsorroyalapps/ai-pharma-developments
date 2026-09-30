# Operator checklist — GCP privileges + Stripe (no live charges yet)

This sandbox cannot finish IAM because `gcloud auth` is not present. You run the privileged steps once.

## 1. Auth + project

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project YOUR_PROJECT_ID
bash cloud/iam/bootstrap.sh
```

Creates:
- Runtime SA `apd-payment-sa` (Secret Manager accessor, logging, run.invoker)
- Deploy SA `apd-deploy-sa` (Run admin, Artifact Registry, Cloud Build, SA user)
- WIF pool `github-apd` bound to `windsorroyalapps/ai-pharma-developments`
- Empty secrets: `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`

## 2. GitHub Actions variables (repo Settings → Variables)

- `GCP_PROJECT_ID`
- `GCP_REGION` = `australia-southeast1`
- `GCP_WIF_PROVIDER` = `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-apd/providers/github`
- `GCP_DEPLOY_SA` = `apd-deploy-sa@PROJECT_ID.iam.gserviceaccount.com`

Then run workflow `deploy-payment-worker` (or push under `cloud/worker/**`).

## 3. Stripe test keys (before ID docs)

Dashboard → Developers → API keys (test mode).

```bash
echo -n 'sk_test_...' | gcloud secrets versions add stripe-secret-key --data-file=-
echo -n 'whsec_...' | gcloud secrets versions add stripe-webhook-secret --data-file=-
echo -n 'pk_test_...' | gcloud secrets versions add stripe-publishable-key --data-file=-
```

Set `window.STRIPE_PUBLISHABLE_KEY` and `window.CREATE_CHECKOUT_SESSION_URL` in `pay.html` after Cloud Run URL exists.

Enable Google Pay in Stripe Dashboard → Settings → Payment methods.

## 4. Live mode (blocked until you verify identity)

Do **not** put ID documents in git, chat logs you do not control, or this repo.
Complete Stripe identity verification in the Dashboard. Only then store `sk_live_` / `pk_live_` in Secret Manager and say "live" explicitly.

## Skills already on operator machine

- `gcloud` — IAM, Run, secrets, APIs
- `payment-api` — checkout + ledger + agent gate
- `stripe` / `stripe-full` — Checkout, webhooks, Google Pay, invoices

No extra skill file required for those stacks.
