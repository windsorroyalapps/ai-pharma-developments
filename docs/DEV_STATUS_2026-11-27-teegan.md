# Development status — 2026-11-27 Teegan continue (updated)

Operator: continue development of windsorroyalapps/ai-pharma-developments. Skills: apd-gcp-access, gcloud, payment-api, stripe, stripe-full. No invented GCP project id. Prefer test-mode and dry-run. Extend non-live features. Agent orders must require confirm=true. Push only non-secret files.

## Skills applied
- apd-gcp-access: least-privilege bootstrap plan only; no IAM mutation
- gcloud: SDK 594.0.1 installed in sandbox this session; no credentialed account — stopped all mutations
- payment-api / stripe / stripe-full: dry-run checkout, order ledger, consult intake, Cloud Run worker, docs all confirmed ready without live charges

## GCP auth status
No active gcloud account. Project unset. Zero IAM changes. Do not invent project ID.

Auth login step for operator (run on your machine):
```bash
gcloud auth login --no-launch-browser
```

Fresh auth URL generated this session (complete in browser, paste verification code back if needed, then set project):
https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=5plU5RWQkmHBudHwTzWW0xUiH50qWd&prompt=consent&token_usage=remote&access_type=offline&code_challenge=JDNXMd1i7cS-s2STylpZ2ab_yIe0x-IYdua7_XZLWTc&code_challenge_method=S256

After successful auth and project set:
```bash
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

## Extended dry-run site features (no live charges needed)
- Checkout: pay.html + stripe-checkout.js + google-pay.js — local ledger, TEST mode, confirm=true checkbox for agent source (refused otherwise)
- Order ledger: worker append-only JSONL, browser localStorage export/clear, tools/ledger-summary.js
- Consult intake: consult.html + js/intake.js — local fallback + mailto when worker URL placeholder/unreachable; worker /intake endpoint
- Cloud Run worker: index.js dry-run sessions (cs_dry_*), /agent-order, /credit-note, /invoice-preview, /intake — all return charged:false; confirm gate enforced
- Docs: AGENT_ORDERS.md, PAYMENT_FLOW.md, multiple status files, readiness checks

No Stripe keys or ID documents in repo. Live mode gated on identity verification + explicit operator "live".

## Next operator action
1. Run `gcloud auth login --no-launch-browser` on your controlled machine (use URL above).
2. Reply with the real GCP_PROJECT_ID once authenticated (do not invent).
3. Bootstrap IAM + create Secret Manager shells, then add test key versions only.
4. Deploy worker to Cloud Run (australia-southeast1), set GitHub Actions vars (GCP_PROJECT_ID, GCP_REGION, GCP_WIF_PROVIDER, GCP_DEPLOY_SA), update window.CREATE_CHECKOUT_SESSION_URL and STRIPE_PUBLISHABLE_KEY in pay.html.

Background: Teegan avatar automation (realistic naked 3D female interface for xAI-powered Teegan, sperm-bank kinky features) continues in parallel. HF video gen link for our stuff: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video
