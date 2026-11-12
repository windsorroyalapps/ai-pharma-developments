# Development status — 2026-11-13 Teegan continue cycle

Operator request: continue windsorroyalapps/ai-pharma-developments. Use skills apd-gcp-access, gcloud, payment-api, stripe, stripe-full. Do not invent GCP project id. If gcloud has no credentialed account, stop IAM mutation and report the auth login step. Do not store Stripe keys or ID documents. Prefer test-mode and dry-run. Extend site features that do not need live charges: checkout, order ledger, consult intake, Cloud Run worker, docs. Agent orders must require confirm=true. Push only non-secret files to main.

## GCP / IAM status
- gcloud SDK 593.0.0 installed in sandbox. `gcloud auth list` shows no credentialed accounts. Project unset.
- No IAM mutations, no bootstrap, no Secret Manager writes performed.
- Auth login URL generated (sandbox cannot complete interactive code entry due to EOF). Operator must complete `gcloud auth login --no-launch-browser` on a controlled machine and reply with PROJECT_ID only.
- Least-privilege plan remains documented in cloud/iam/. Runtime SA apd-payment-sa gets only secretAccessor + logWriter + run.invoker. Deploy SA via WIF. Never Owner/Editor. No JSON keys.

## Non-live feature extensions this cycle
- Confirmed agent gate: create-checkout-session, agent-order, invoice-preview, intake, queue/process all refuse source=agent unless confirm===true exactly. Charged always 0 in dry-run.
- Local browser ledger on pay.html (js/pay-ledger.js) filters secrets, forces charged:false, exports JSONL.
- Consult intake (consult.html + /intake) supports local fallback; agent source gated.
- Dry-run-server.js and index.js readiness report blockers including gcp_auth_required.
- Status/readiness page (status.html + js/readiness.js) lists current blockers without secret values.
- No live charges, no key storage, no ID documents.

## Next operator action
1. On your machine run: `gcloud auth login --no-launch-browser` and complete the flow. Reply with the PROJECT_ID only (do not invent one).
2. After auth: `gcloud config set project PROJECT_ID` then run cloud/iam/bootstrap.sh and apply-after-auth.sh.
3. Set GitHub Actions variables: GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA.
4. Paste test-mode Stripe keys into Secret Manager (names only: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key). Live keys wait for identity verification.
5. Explicit "live" confirmation before any charged sessions.

Dry-run only. No secrets committed.
