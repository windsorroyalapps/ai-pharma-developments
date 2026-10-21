# Development status — 2026-10-21

## GCP access
- Google Cloud SDK 590.0.0 installed in sandbox.
- No active credentials. Project unset.
- Auth login URL generated (sandbox EOF expected). Operator must complete auth on controlled machine, set project ID, then run `cloud/iam/bootstrap.sh`.
- Least-privilege SAs, WIF, secret shells defined. No mutations performed.

## Payments / Stripe
- Skills `payment-api`, `stripe`, `stripe-full` present. No new skill created.
- Dry-run flows, ledgers, agent gates (`confirm=true`), Google Pay stubs ready.
- Live keys blocked until Stripe Dashboard identity verification. Provide ID documents when ready; do not store in git or chat.

## Site features for automation
- Catalog, orders, quotes, credit notes, intake, fulfillment, local ledgers, dry-run servers operational.
- Continue expanding agent-gated automation without live charges.
- Any agent Checkout Session must include `confirm=true` or be refused.

Next: reply with GCP project ID after auth on your machine. Test Stripe keys can be added via `cloud/iam/add-test-secrets.sh`.
