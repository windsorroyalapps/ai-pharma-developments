# Operator auth — unblock GCP privileges

Sandbox state on 2026-10-16: Cloud SDK 589.0.0 installed. `gcloud auth list` shows no credentialed accounts. Project unset. IAM was not mutated. Bootstrap and apply-after-auth scripts not executed.

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

After bootstrap, report SA emails and WIF provider resource name.

## Stripe

Test secret versions only until Dashboard identity verification. Do not commit ID documents or secret key values. Skills: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`.

Dry-run features (pay.html ledger with AUD preview, automation.html confirm=true gate with refusal logging, worker health probe, consult intake local fallback) are ready and do not charge.