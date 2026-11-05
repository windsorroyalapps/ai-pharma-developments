# Payment and GCP status — 2026-11-05 22:05 UTC

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill required for payment API or Stripe.

Identity documents stay out of git. Complete Stripe ID verification in Dashboard. Live charges blocked until operator says "live" and keys confirmed.

## Blocker

Sandbox: gcloud installed (SDK 592.0.0). No active account. Project unset. IAM not mutated. bootstrap.sh not run.

**Authenticate now (operator machine):**
```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
```

Or open this URL, complete sign-in, then paste only the verification code back (never secrets or ID docs):

https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=NuswnAqBFvQXn91Yyso2uRkufnpjob&prompt=consent&token_usage=remote&access_type=offline&code_challenge=eDb6bsTHiVOTYLgcn5IjaNdLT3VmNXa7kPwrPH2hMOw&code_challenge_method=S256

After auth succeeds, reply with PROJECT_ID only, then run:
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

## Built in dry-run (continue developing)
- Confirm=true gates on all agent orders (`/agent-order`, intake, checkout)
- Local JSONL ledgers, catalog, quotes, credit notes, fulfillment stubs
- Worker dry-run mode + `cloud/worker/dry-run-server.js`
- Operator pages: pay.html, readiness.html, automation.html, gcp-access.html
- Tools: agent-order-dry-run, checkout-gate-check, ledger-summary, etc.

Continue expanding automation features without live keys or GCP mutations.
