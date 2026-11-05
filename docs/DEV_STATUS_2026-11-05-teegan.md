# DEV STATUS 2026-11-05 (Teegan session)

## GCP Access
- gcloud SDK installed in sandbox (v592.0.0).
- No credentialed accounts. Auth required.
- Login URL provided to operator (sandbox cannot complete interactive auth).
- Next: operator runs `gcloud auth login --no-launch-browser` on controlled machine, provides project ID.
- Then execute `cloud/iam/bootstrap.sh` for least-privilege SAs: apd-payment-sa (runtime) and apd-deploy-sa (WIF deploy).
- Secrets names ready: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key. No values until test keys provided. Live after ID verification.

## Skills
- apd-gcp-access, gcloud, payment-api, stripe, stripe-full already present and aligned.
- No new skills created; existing cover payment API and Stripe integration.
- Agent rule: Checkout Sessions require confirm=true.

## Site / Automation
- Static site and Cloud Run worker stubs in place.
- Develop rest of features (pay.html, ledger, webhooks, automation hooks) once GCP auth complete.
- Background: Teegan 3D avatar automation skill active for kinky interface (HF video gen).

## Next operator actions
1. Authenticate gcloud and set project.
2. Provide Stripe test keys (names only in secrets).
3. ID docs later for live Stripe.
