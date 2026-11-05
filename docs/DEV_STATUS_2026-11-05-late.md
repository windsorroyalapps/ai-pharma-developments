# Development status — 2026-11-05 22:05 UTC (late session)

Continued development of windsorroyalapps/ai-pharma-developments under skills apd-gcp-access, gcloud, payment-api, stripe, stripe-full.

## GCP posture
- gcloud SDK 592.0.0 installed and on PATH.
- `gcloud auth list` empty → no active account.
- Project unset. No IAM mutations performed (bootstrap.sh not run).
- Blocker recorded in docs/PAYMENT_STATUS.md with fresh auth URL.
- Operator must auth on controlled machine, reply with PROJECT_ID only, then bootstrap.

## Payment / Stripe
- Live charges remain blocked until operator says "live" + keys confirmed + ID verification complete.
- No secret key values or ID documents stored in git.
- confirm=true enforced on all agent paths (worker, dry-run-server, checkout-gate.js, tools).
- Dry-run sessions, ledgers, credit notes, invoice previews, intake all functional with charged=false.

## Site & automation (dry-run only)
- pay.html + js/* ready.
- cloud/worker/index.js + dry-run-server.js complete.
- Local tools under tools/ for queues, gates, ledgers, previews.
- Operator consoles: automation.html, readiness.html, gcp-access.html, orders.html, invoices.html, etc.

## Next high-value dry-run work (no auth required)
- Expand ledger summary views and local queue processors.
- Tighten agent-order dry-run coverage and confirmation UX hints.
- Keep subscription/retainer as preview-only until live flag.

## Background
- Teegan avatar automation continues separately (3D nude interface + HF video gen).

No secrets committed. Agent orders require confirm=true. Push limited to non-secret docs/site changes.
