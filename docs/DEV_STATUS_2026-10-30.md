# Development status — 2026-10-30

## GCP / IAM

- gcloud SDK 591.0.0 installed in sandbox. PATH includes google-cloud-sdk/bin.
- `gcloud auth list` empty. Project unset. Bootstrap not run. IAM not mutated.
- Operator must complete `gcloud auth login --no-launch-browser` using this URL:
  https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=wW5opIH7z0bkNzt2WbChfoWrHWqqf1&prompt=consent&token_usage=remote&access_type=offline&code_challenge=zpvgf0yMYm6ti2yaJVnn_dAji4y494kfEvKAVU1ftKw&code_challenge_method=S256
- After completing in browser, reply with the verification code in a secure way or re-run auth, then set PROJECT_ID and run bootstrap.sh.
- Skills confirmed: apd-gcp-access, gcloud, payment-api, stripe, stripe-full. No new skills required for payment API or Stripe.

## Payment / Stripe

- Live mode blocked pending Stripe Dashboard identity verification (provide ID documents when ready) and explicit operator "live" confirmation.
- Dry-run features expanded; automation hooks, checkout-gate, ledger, queues ready. Charged always 0.
- Agent orders require confirm=true.
- Status docs updated. No secrets committed.

## Site features for automation

- Catalog, orders, quotes, credit notes, intake, fulfillment dry-runs continue without live keys.
- Operator pages: readiness.html, gcp-access.html, automation.html.
- Enhanced local automation console with confirm gates and ledger.

## Teegan background

- Avatar automation skill active for realistic 3D naked female interface development (Three.js / HF spaces).
- HF video gen for kinky stuff: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

## Next

Provide PROJECT_ID after auth to run bootstrap.sh and enable deploy. Prefer dry-run checkout, ledger, and automation features. Continue developing site automation features.
