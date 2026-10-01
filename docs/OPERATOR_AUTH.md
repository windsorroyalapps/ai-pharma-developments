# Operator auth — blocked until Google login

Session check (2026-10-01): gcloud installed in the agent environment. `gcloud auth list` returned **no credentialed accounts**. Project property unset. IAM was not mutated. No secret versions were added.

## What you do next

1. Open a terminal where you can complete Google login (this agent cannot finish the browser step alone).
2. Run:

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud projects list
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
```

3. Paste the verification code back in chat if you want the agent to finish bootstrap. Do not paste ID documents, live Stripe keys, or service-account JSON.

Bootstrap (already in `cloud/iam/bootstrap.sh`) creates least-privilege identities only:

- `apd-payment-sa` — `secretmanager.secretAccessor`, `logging.logWriter`, `run.invoker`
- `apd-deploy-sa` — `run.admin`, `artifactregistry.writer`, `cloudbuild.builds.editor`, `iam.serviceAccountUser`
- Workload Identity pool `github-apd` bound to `windsorroyalapps/ai-pharma-developments`
- Empty secret shells: `stripe-secret-key`, `stripe-webhook-secret`, `stripe-publishable-key`

Never Owner/Editor on the runtime account. No JSON keys in git.

## GitHub Actions variables (after bootstrap)

- `GCP_PROJECT_ID`
- `GCP_REGION` = `australia-southeast1`
- `GCP_WIF_PROVIDER` = `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-apd/providers/github`
- `GCP_DEPLOY_SA` = `apd-deploy-sa@PROJECT_ID.iam.gserviceaccount.com`

Workflow `.github/workflows/deploy-worker.yml` no-ops until `GCP_PROJECT_ID` is set.

## Stripe

Test keys only until Dashboard identity verification is complete. Live charges stay off. Skills already present: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. Do not duplicate them.
