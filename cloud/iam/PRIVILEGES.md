# GCP privilege contract

Do not grant Owner or Editor to runtime or deploy service accounts. No JSON keys in git. Identity documents stay out of this repo.

Region: `australia-southeast1`
WIF pool: `github-apd`
WIF provider: `github`
Attribute condition: `assertion.repository=='windsorroyalapps/ai-pharma-developments'`

## Runtime: apd-payment-sa

Project roles:

- roles/secretmanager.secretAccessor
- roles/logging.logWriter
- roles/run.invoker

Secret-level accessor on:

- stripe-secret-key
- stripe-webhook-secret
- stripe-publishable-key

Pub/Sub publisher on topic `apd-fulfillment` (applied by `cloud/automation/apply-after-auth.sh`, after bootstrap).

## Deploy: apd-deploy-sa

Project roles:

- roles/run.admin
- roles/artifactregistry.writer
- roles/cloudbuild.builds.editor
- roles/iam.serviceAccountUser

Workload Identity User on the deploy SA, member:

`principalSet://iam.googleapis.com/projects/PROJECT_ID/locations/global/workloadIdentityPools/github-apd/attribute.repository/windsorroyalapps/ai-pharma-developments`

## GitHub Actions variables

- GCP_PROJECT_ID
- GCP_REGION = australia-southeast1
- GCP_WIF_PROVIDER = projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-apd/providers/github
- GCP_DEPLOY_SA = apd-deploy-sa@PROJECT_ID.iam.gserviceaccount.com

## Apply order

1. `gcloud auth login --no-launch-browser`
2. `gcloud auth application-default login --no-launch-browser`
3. `gcloud config set project PROJECT_ID`
4. `bash cloud/iam/bootstrap.sh`
5. `bash cloud/automation/apply-after-auth.sh`
6. Add Stripe test key versions only. Live keys wait for Stripe identity verification and an explicit live confirmation.
