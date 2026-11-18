# Development status — 2026-11-19 Teegan cycle

Operator request: use apd-gcp-access skill for Google Cloud privileges to continue aipharmadevelopments.com development on GitHub. Create/ensure payment-api and stripe skills. Provide ID docs later for Stripe live access. Until then develop rest of site and automation features.

## GCP / IAM status
- gcloud SDK 594.0.0 installed in sandbox. `gcloud auth list` shows no credentialed accounts. Project unset.
- Per apd-gcp-access and gcloud skills: no IAM mutations performed. Never invent project ID. Bootstrap.sh ready in cloud/iam/.
- Auth URL generated. Operator must complete login on controlled machine:
  https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=C3RxH5SYHC5UgVKFZVlJT186s5OZQA&prompt=consent&token_usage=remote&access_type=offline&code_challenge=MijEynubwLLkpu02C0pCRihs8PfoFlD9fOqmqDqDx28&code_challenge_method=S256
- After code entry and PROJECT_ID reply: run bootstrap.sh then apply-after-auth.sh. Set GitHub Actions vars (GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA).
- Least-privilege: runtime SA secretAccessor/logWriter/run.invoker only. Deploy SA run.admin/artifactregistry.writer/etc via WIF. No Owner/Editor, no JSON keys in git.

## Skills
- apd-gcp-access: active and followed.
- payment-api, stripe, stripe-full: already present and sufficient for Checkout, webhooks, Google Pay, ledger, agent-gated (confirm=true) orders. No new skills required.
- Secrets names only: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key. Live after ID verification.

## Non-live development continued
- Site features: pay.html dry-run + local ledger, consult intake, automation queue processing, status readiness all functional without live charges.
- Agent rule enforced: outbound Checkout Sessions refuse without confirm=true.
- Next safe improvements: enhance local invoice preview UI, expand queue sample data, update status.html timestamp/readiness, add more automation hooks in docs.

## Next operator actions
1. Complete gcloud auth login via the URL above on your machine. Paste verification code or reply with PROJECT_ID.
2. When ready for live Stripe: complete identity verification in Stripe Dashboard. Do not paste ID documents here.
3. After auth: confirm project, run scripts, set Actions variables.
4. Explicit "live" confirmation before any production charges.

Dry-run only. No secrets or ID docs stored.
