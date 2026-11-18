# DEV STATUS — 2026-11-18 (Teegan GCP Auth)

## Goal
Grant least-privilege GCP access for aipharmadevelopments.com continued development (Cloud Run payment worker + WIF deploy) and advance site automation features pending Stripe identity verification.

## Current sandbox state
- gcloud SDK installed and on PATH.
- `gcloud auth list`: No credentialed accounts.
- Project: unset.
- IAM not mutated (per skill: never invent PROJECT_ID or fake binds).
- Bootstrap script `cloud/iam/bootstrap.sh` and `cloud/automation/apply-after-auth.sh` ready but unexecuted.

## Auth URL for operator (this session)
https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=SeT8PDQnlMHq82QuWZsnpVRJIBgmhL&prompt=consent&token_usage=remote&access_type=offline&code_challenge=s-0GaQ9R3fB9zcgtOFMv6kW2TjJr-TzDFXg88eBAdNI&code_challenge_method=S256

Paste the verification code from the browser back into this chat. Do not paste refresh tokens or keys.

## After auth + PROJECT_ID set
1. `gcloud config set project PROJECT_ID`
2. `gcloud config set compute/region australia-southeast1`
3. `bash cloud/iam/bootstrap.sh`
4. `bash cloud/automation/apply-after-auth.sh`
5. Report SA emails + WIF provider resource name.
6. Add Stripe **test** key versions to Secret Manager only (live waits for ID docs).

## Site / automation status (ready, no charges)
- Frontend dry-run ledger on pay.html (AUD preview, localStorage).
- Agent order gate: confirm=true required; refusal logging present.
- Worker health probe and consult intake local fallback ready.
- Skills already present: apd-gcp-access, gcloud, payment-api, stripe, stripe-full.
- No new skills required at this time.

## Next after privileges
- Deploy Cloud Run worker with WIF.
- Replace YOUR-CLOUD-RUN-URL and pk_test_placeholder in pay.html.
- Continue automation features (ledger to Firestore, Pub/Sub fulfillment, Scheduler health).
- Wait for operator-supplied Stripe ID documents before any live-mode work.

## Safety
No Owner/Editor on runtime SA. No JSON keys. No ID documents in git. Dry-run only until explicit live confirmation.
