# Development status — 2026-11-13 Teegan continue3 (dry-run + auth blocker + ledger polish)

## GCP access blocker
- gcloud SDK present in sandbox.
- `gcloud auth list` → no credentialed accounts. Project unset.
- Did **not** mutate IAM. Did **not** invent PROJECT_ID. Did **not** run `cloud/iam/bootstrap.sh` or `cloud/automation/apply-after-auth.sh`.
- Operator must complete auth on a controlled machine with `gcloud auth login --no-launch-browser`.

Login URL (one-time):
https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=IoW7Qm9jzXGVYHVA7d9wTFx7UGtDVM&prompt=consent&token_usage=remote&access_type=offline&code_challenge=yQ-lIY9ibAbaQRvcf_st80ojKXSxO46-jsmu20cbzv8&code_challenge_method=S256

After login, set project (`gcloud config set project PROJECT_ID`) and reply with the project ID only. Then bootstrap can run. Least-privilege SAs and WIF ready (runtime SA never Owner/Editor).

## Stripe / payments
- No live charges. Dry-run enforced everywhere. Secrets remain names only.
- Agent orders require `confirm=true` or refused.
- Never commit keys or identity documents.

## Dry-run site features
- Checkout `confirm=true` gate mandatory for agent-sourced orders.
- Local ledger (`js/pay-ledger.js`) enhanced: agent vs website split in summary, confirmation dialog on clear, always forces `charged: false` / `dry_run: true`.
- Automation pages, local queue, quote builder, intake, fulfillment dry-run all operational. No live charges possible.

## Next
1. Operator completes gcloud auth and provides PROJECT_ID.
2. Run bootstrap + apply-after-auth; record SA emails and WIF provider.
3. Stripe identity verification before any live keys.
4. Explicit confirmation before live charges.

Dry-run only until those steps.
