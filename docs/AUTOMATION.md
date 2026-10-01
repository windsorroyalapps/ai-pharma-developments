# Site + payment automation

## Already in repo
- Static site on GitHub Pages / custom domain aipharmadevelopments.com
- Stripe Checkout + Google Pay frontend (`pay.html`)
- Cloud Run worker (`cloud/worker`) — sessions, signed webhooks, agent `confirm=true` gate
- IAM bootstrap: `cloud/iam/bootstrap.sh` + `docs/GCP_ACCESS.md`
- Consult intake: `consult.html` (mailto until worker intake is live)
- Skills: `gcloud`, `stripe`, `stripe-full`, `payment-api`, `apd-gcp-access`

## Privileges this session cannot apply alone
Sandbox has **no gcloud auth**. Operator must run:

```bash
gcloud auth login --no-launch-browser
gcloud config set project YOUR_PROJECT_ID
bash cloud/iam/bootstrap.sh
```

GitHub Actions variables:
- `GCP_PROJECT_ID`
- `GCP_REGION` = `australia-southeast1`
- `GCP_WIF_PROVIDER` = `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-apd/providers/github`
- `GCP_DEPLOY_SA` = `apd-deploy-sa@PROJECT_ID.iam.gserviceaccount.com`

## Stripe live
Do **not** send ID documents into git. Complete Stripe Dashboard identity verification, then store keys in Secret Manager only.

## Agent rule
Outbound charges from any agent require `confirm=true` in `/create-checkout-session`.
