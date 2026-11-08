# Development status — 2026-11-09 Teegan continue

Operator request: continue aipharmadevelopments.com development. Review repo, site, payment worker, NEXT_OPERATOR_ACTIONS.md. Improve site features, automation hooks, payment flow docs. No invented GCP project IDs, no stored Stripe live keys or ID docs. Document exact auth steps if gcloud unauthenticated. Agent checkout requires confirm=true. Push useful code/docs to main.

## Review summary
- Repo structure solid: static site (GitHub Pages / custom domain), cloud/worker (Express Stripe dry-run + confirm gate), cloud/iam (least-privilege bootstrap + WIF), cloud/automation (queue, local fulfill, samples), docs (status history + contracts).
- Live site (aipharmadevelopments.com) responsive, professional, with pay.html in TEST/dry-run mode.
- Payment worker (cloud/worker/index.js) enforces:
  - Agent orders require source=agent AND confirm===true (403 otherwise)
  - Currency allowlist AUD
  - Dry-run when no key or live key without STRIPE_LIVE_OK=1
  - No refunds on /credit-note
  - Ledger append-only
- gcloud remains unauthenticated in sandbox (per prior status). No IAM mutations attempted.

## Shipped this pass
- Updated docs/NEXT_OPERATOR_ACTIONS.md with clearer deploy commands and current date.
- Added this status file.
- Confirmed agent gate, dry-run, and documentation consistency.

## Still needs operator keys / auth
1. gcloud auth login + application-default login on operator machine.
2. PROJECT_ID reply.
3. Run bootstrap.sh + apply-after-auth.sh.
4. Add Stripe **test** secret versions only.
5. Deploy Cloud Run worker + set GitHub Actions vars.
6. Wire publishable key + CREATE_CHECKOUT_SESSION_URL in pay.html.
7. Later: Stripe identity verification for live keys.

## Next after auth
Deploy worker, wire site URLs, expand fulfillment Pub/Sub consumer if desired, add more automation hooks in automation.html.

Background Teegan avatar automation continues separately (not part of this repo).

R = (W × C) ÷ T: goal clear, focused on docs + review, zero invented credentials.
