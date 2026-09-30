# Next operator actions (cannot be finished in the unauthenticated sandbox)

Repo already contains IAM bootstrap, Cloud Run worker, Stripe/Google Pay frontend, and WIF wiring.

## Blockers this session

1. `gcloud` is not installed/authenticated in the agent sandbox.
2. Stripe live mode waits on Dashboard identity verification. Do not upload ID docs to GitHub.
3. GitHub Actions deploy no-ops until repo variables exist.

## Run locally (one sitting)

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project YOUR_PROJECT_ID
cd /path/to/ai-pharma-developments
bash cloud/iam/bootstrap.sh
```

Then set Actions variables `GCP_PROJECT_ID`, `GCP_REGION=australia-southeast1`, `GCP_WIF_PROVIDER`, `GCP_DEPLOY_SA` as documented in `docs/GCP_ACCESS.md`.

Add **test** Stripe secret versions:

```bash
echo -n 'sk_test_...' | gcloud secrets versions add stripe-secret-key --data-file=-
echo -n 'whsec_...' | gcloud secrets versions add stripe-webhook-secret --data-file=-
echo -n 'pk_test_...' | gcloud secrets versions add stripe-publishable-key --data-file=-
```

Deploy worker (or push `cloud/worker/**` to trigger `.github/workflows/deploy-worker.yml`).
Paste Cloud Run URL into `pay.html` as `window.CREATE_CHECKOUT_SESSION_URL` and set `window.STRIPE_PUBLISHABLE_KEY` to the **publishable** test key only.

## After ID verification

Switch Secret Manager to live keys only when you explicitly say live. Keep agent orders gated on `confirm=true`.
