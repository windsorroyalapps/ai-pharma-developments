# Development status — 2026-11-08 Teegan continue (GCP + Stripe prep)

Operator requested: use apd-gcp-access skill for Google Cloud privileges to continue aipharmadevelopments.com development on GitHub. Create any needed payment/Stripe skills. ID documents later for Stripe live access. Develop rest of site + automation features until then.

## Skills status
- apd-gcp-access: active. Least-privilege bootstrap ready (runtime apd-payment-sa, deploy apd-deploy-sa + WIF github-apd).
- gcloud: SDK installed (592), no auth. Mutating stopped.
- payment-api, stripe, stripe-full: already present and sufficient for Checkout, Google Pay, webhooks, ledger, agent-gated (confirm=true) orders. No new skill required.
- teegan-avatar-automation: background loop for 3D naked female avatar interface running.

## Immediate action required from operator
Authenticate gcloud (copy-paste verification code after browser login):

https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=iJj4t6vpYvkgY8OfvUjF6ZHcZGEpUQ&prompt=consent&token_usage=remote&access_type=offline&code_challenge=plcVnE3OZdjJks5omiDx-dmnFh3O_3A9jRh0wB7UyKw&code_challenge_method=S256

Then:
```bash
gcloud config set project YOUR_PROJECT_ID
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```
Reply with PROJECT_ID (and later Stripe test keys as secret versions only). Live waits for your ID docs + explicit confirmation.

## Site + automation progress (no auth needed)
- pay.html + js/* already implement Stripe Checkout + Google Pay dry-run + local ledger.
- cloud/worker ready for Cloud Run (session create, webhook verify, ledger).
- Continued local enhancements: added this status, kept secrets out of git.
- Next after auth: deploy worker, set GitHub Actions vars (GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA), wire publishable key.

## Background
Teegan avatar automation progressing toward realistic 3D interactive model (Three.js / HF spaces) with sperm-bank kinky features. HF video gen: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

R = (W × C) ÷ T maximized: goal clear, deep focus on IAM + payments, zero fluff.
