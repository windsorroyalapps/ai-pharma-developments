# Google Cloud access privileges — AI Pharma Developments

Status 2026-10-09 13:11 AEDT: CLI present at `/root/google-cloud-sdk`. `gcloud auth list` shows no credentialed accounts. Project is unset. ADC is missing. IAM was not mutated. Do not invent a project id.

A `--no-launch-browser` URL printed in this sandbox dies with EOF before a verification code can be accepted. Authenticate on a machine you control, then reply with the project id only.

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

## Service accounts (created only by bootstrap after auth)

| Account | Roles |
|---|---|
| `apd-payment-sa@PROJECT.iam.gserviceaccount.com` | secretmanager.secretAccessor, logging.logWriter, run.invoker |
| `apd-deploy-sa@PROJECT.iam.gserviceaccount.com` | run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser |

Runtime SA must never be project Owner or Editor. No JSON keys in git. WIF pool `github-apd` binds only `windsorroyalapps/ai-pharma-developments`.

## Secrets (names only until test keys are pasted)

- `stripe-secret-key`
- `stripe-webhook-secret`
- `stripe-publishable-key`

Live key versions wait for Stripe Dashboard identity verification. Do not send ID documents into git, skills, or chat.

## GitHub Actions variables after bootstrap

- `GCP_PROJECT_ID`
- `GCP_REGION` = `australia-southeast1`
- `GCP_WIF_PROVIDER`
- `GCP_DEPLOY_SA`

Operator board: `readiness.html`.
