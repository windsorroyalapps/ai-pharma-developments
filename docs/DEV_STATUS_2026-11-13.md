# Development status — 2026-11-13 Teegan cycle

Operator request: continue windsorroyalapps/ai-pharma-developments. Use skills apd-gcp-access, gcloud, payment-api, stripe, stripe-full. Do not invent GCP project id. If gcloud has no active account, do not mutate IAM and record that login is still required. Do not store Stripe live keys or identity documents. Build only non-live site and automation features: queue processing, invoice preview, consult intake, status page accuracy, and least-privilege docs. Agent checkout must refuse unless confirm=true. Commit small safe improvements to main if GitHub write works.

## GCP / IAM
- gcloud SDK 593.0.0 installed in sandbox. `gcloud auth list` empty. Project unset. No mutations performed. Login still required.
- Auth URL generated via `gcloud auth login --no-launch-browser` but sandbox cannot complete interactive code entry (EOF). Operator must complete on controlled machine and reply with PROJECT_ID only.
- Least-privilege contract unchanged and documented. Bootstrap scripts ready but unrun.

## Non-live features
- Queue processing: process-queue.js and dry-run-server /queue/process handle order, consult_intake, support_ticket, invoice_preview, subscription_preview, fulfillment. Agent source refuses without confirm===true. Charged always 0.
- Invoice preview: /invoice-preview and type=invoice_preview in queue. Never bills.
- Consult intake: consult.html + js/intake.js local fallback + /intake endpoint (confirm gate for agent). No PHI stored.
- Status page: status.html + readiness.js updated with current blockers and timestamp.
- Agent gate enforced in worker, queue, and automation console.

## Next operator actions
1. Run `gcloud auth login --no-launch-browser` on your machine. Reply with PROJECT_ID only.
2. Complete Stripe Dashboard identity verification when ready. Never paste ID docs or live keys into chat/git.
3. After project set: run bootstrap.sh then apply-after-auth.sh. Set GitHub Actions variables.
4. Explicit confirmation before any live charges.

No secrets committed. Dry-run only.
