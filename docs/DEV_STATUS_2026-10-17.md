# Development status — 2026-10-17

## GCP access
- Sandbox now has Google Cloud SDK installed (v589). No active credentials.
- Operator must authenticate on a controlled machine with `gcloud auth login --no-launch-browser`, set project, then run bootstrap.
- Least-privilege SAs (`apd-payment-sa`, `apd-deploy-sa`), WIF pool `github-apd`, and secret shells ready in `cloud/iam/bootstrap.sh`.
- No IAM mutations performed here.

## Payments / Stripe
- Skills `payment-api`, `stripe`, `stripe-full` already present. No new skill required.
- Frontend checkout + Google Pay + worker ready for test mode.
- Live keys blocked until Stripe identity verification. Provide ID documents when ready; do not store them in git.

## Site features for automation
- Catalog, orders, quotes, credit notes, intake, fulfillment, local ledgers, dry-run servers all present.
- Continue expanding agent-gated automation and dry-run hooks without live charges.
- Any agent Checkout must send `confirm=true`.

Next: reply with GCP project ID after auth. Test Stripe keys can be added to Secret Manager before full verification.
