# Payment and GCP status — 2026-11-27 09:12 AEDT (Teegan cycle)

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill required for payment API or Stripe.

Identity documents stay out of git. Complete Stripe ID verification in Dashboard. Live charges blocked until operator says "live" and keys confirmed.

## Blocker

Sandbox: gcloud SDK 594.0.1 installed this session. `gcloud auth list` returns no credentialed accounts. Project unset. IAM not mutated. `cloud/iam/bootstrap.sh` not run. No project ID invented.

**Authenticate now (operator machine):**
```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
```

Sample auth URL from this sandbox (non-interactive EOF expected):
https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform&state=...&prompt=consent&access_type=offline&code_challenge=...

After auth succeeds, reply with PROJECT_ID only, then run:
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

## Built / improved this cycle (dry-run only)

- Confirmed gcloud present but unauthenticated; blocker recorded and refreshed with install status.
- Dry-run server (`cloud/worker/dry-run-server.js`) gained GET `/stats` for richer ledger breakdown (quotes, credit notes, intakes, support, refused). Still charged: false always.
- Automation console (`automation.html`) added local credit-note preview form (SKU + amount + reason). Agent source requires confirm=true. Never charges or refunds.
- No secrets or ID documents stored. Live charges still blocked.

## Still needs operator

1. gcloud auth login (no-launch-browser) on a machine that can complete the flow. Reply with PROJECT_ID only.
2. Stripe Dashboard: finish identity verification. Paste test keys only into Secret Manager (names: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key). Never commit values.
3. After bootstrap: set GitHub Actions vars GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA.
4. Explicit "live" confirmation before any live charges. Agent orders always require confirm=true.

Continue expanding static site + dry-run ledger + automation console without live keys or IAM mutations.
