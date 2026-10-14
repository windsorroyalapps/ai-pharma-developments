# Development status — 2026-10-14

## GCP access
- Sandbox has gcloud installed but no credentials.
- Operator must run `gcloud auth login --no-launch-browser` on a controlled machine, then set project and run `bash cloud/iam/bootstrap.sh`.
- Least-privilege SAs, WIF, and secret shells are ready in `cloud/iam/bootstrap.sh`.

## Payments / Stripe
- Skills `payment-api`, `stripe`, `stripe-full` already present. No new skill required.
- Frontend `pay.html` + `js/stripe-checkout.js` + Google Pay ready for test mode.
- Worker `cloud/worker` implements Checkout session + webhook with `confirm=true` gate.
- Live keys blocked until Stripe identity verification (ID docs supplied by operator later).

## Site features ready for automation
- Catalog, orders, quotes, credit notes, intake, fulfillment dry-runs.
- Local ledgers, agent order simulators, dry-run server.
- Continue expanding automation hooks without live charges.

Next: operator provides project ID after auth, then bootstrap. Stripe test keys can be added to Secret Manager before ID verification.
