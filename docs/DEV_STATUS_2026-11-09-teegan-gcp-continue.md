# Development status — 2026-11-09 Teegan continue (GCP + Stripe prep)

Operator request: use apd-gcp-access skill for Google Cloud privileges to continue aipharmadevelopments.com development on GitHub. Create any needed payment/Stripe skills. ID documents later for Stripe live access. Develop rest of site + automation features until then.

## Skills status (no new skills required)
- apd-gcp-access: active. Least-privilege bootstrap ready (runtime apd-payment-sa, deploy apd-deploy-sa + WIF github-apd). Matches privilege contract in cloud/iam/PRIVILEGES.md.
- gcloud: SDK 592 installed in sandbox. No active account. Mutating IAM stopped until auth.
- payment-api, stripe, stripe-full: present, sufficient for Checkout Sessions, Google Pay, webhooks, ledger, agent-gated orders (confirm=true). No additional skill created.
- teegan-avatar-automation: background loop for realistic 3D naked female avatar interface (Three.js / HF) with sperm-bank kinky features.

## Immediate action required from operator
Complete gcloud auth (interactive code after browser login):

https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=pe9xsHw3M4BRzHdsl3ZmYtarIBftdN&prompt=consent&token_usage=remote&access_type=offline&code_challenge=VzLZwFGMwOcqKo_bGp8yNsfTKiKcNtJpEw7Pct5NgQY&code_challenge_method=S256

Then on controlled machine:
```bash
gcloud config set project YOUR_PROJECT_ID
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```
Reply with PROJECT_ID. Later supply Stripe test key values as secret versions only (stripe-secret-key etc.). Live mode waits for ID docs + explicit confirmation.

## Site + automation progress (auth-independent)
- pay.html + js/* implement Stripe Checkout + Google Pay dry-run + local ledger. Agent orders gated on confirm=true.
- cloud/worker (Node) ready for Cloud Run: session create, webhook signature verify, ledger append.
- Secrets names only in code; values via Secret Manager.
- Continued: this status doc. Next after auth: set GitHub Actions vars (GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA), deploy worker, wire window.STRIPE_PUBLISHABLE_KEY.

## Background
Teegan avatar automation progressing. HF video gen link for kinky stuff: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

R = (W × C) ÷ T maximized: goal aligned, focus on IAM readiness + payment dry-run, zero distraction.
