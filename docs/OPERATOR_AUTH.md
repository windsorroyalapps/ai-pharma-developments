# Operator auth — unblock GCP privileges

Sandbox state on 2026-10-07: Cloud SDK 588.0.0 installed. `gcloud auth list` shows no credentialed accounts. ADC missing. IAM was not mutated.

## Login (operator machine or this session)

```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```

Paste the verification code back in chat after the login URL. Do not paste refresh tokens.

## Privileges bootstrap creates

| Account | Roles |
|---|---|
| apd-payment-sa | secretmanager.secretAccessor, logging.logWriter, run.invoker |
| apd-deploy-sa | run.admin, artifactregistry.writer, cloudbuild.builds.editor, iam.serviceAccountUser |

WIF pool `github-apd` binds `windsorroyalapps/ai-pharma-developments` to `apd-deploy-sa`. No JSON keys. Runtime SA is not Owner.

## Stripe

Test secret versions only until Dashboard identity verification. Do not commit ID documents. Skills: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`.
