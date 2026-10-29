# Development status — 2026-10-29 22:03 UTC

## GCP / IAM

- gcloud SDK 591.0.0 installed in sandbox. PATH includes google-cloud-sdk/bin.
- `gcloud auth list` empty. Project unset. Bootstrap not run. IAM not mutated.
- Operator must complete `gcloud auth login --no-launch-browser` on a trusted machine (sandbox cannot accept verification code due to EOF).
- After auth: `gcloud config set project PROJECT_ID`, `gcloud config set compute/region australia-southeast1`, then `bash cloud/iam/bootstrap.sh`.
- Reply with PROJECT_ID only. Do not paste codes or keys.
- Skills confirmed: apd-gcp-access, gcloud, payment-api, stripe, stripe-full. No new skills required for payment API or Stripe.

## Payment / Stripe

- Live mode blocked pending Stripe Dashboard identity verification (provide ID documents when ready) and explicit operator "live" confirmation.
- Dry-run features expanded; automation hooks, checkout-gate, ledger, queues ready. Charged always 0.
- Agent orders require confirm=true.
- `tools/ledger-summary.js` enhanced: event counts, any_charged_flag_seen safety exit, richer dry-run note.

## Site features for automation

- Catalog, orders, quotes, credit notes, intake, fulfillment dry-runs continue without live keys.
- Operator pages: readiness.html, gcp-access.html, automation.html.
- Local checks all pass: dry-run-check, checkout-gate-check, agent-order-dry-run.

## Teegan background

- Avatar automation skill active for realistic 3D naked female interface development (Three.js / HF spaces).
- HF video gen for kinky stuff: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

## Next

Provide PROJECT_ID after auth to run bootstrap.sh and enable deploy.
Continue dry-run expansion and site polish until auth lands.
