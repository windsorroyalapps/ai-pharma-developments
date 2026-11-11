# Development status — 2026-11-11 Teegan continue (GCP + Stripe prep)

Operator: use skill for Google Cloud access privileges to continue aipharmadevelopments.com on GitHub. Create payment/Stripe skills as needed. ID documents later for Stripe. Develop rest of site and automation features until then.

## Skills status
- apd-gcp-access: active. Bootstrap creates least-privilege runtime SA (apd-payment-sa) and deploy SA (apd-deploy-sa) with WIF github-apd bound to this repo.
- gcloud: SDK 593 installed, no active account. Mutating stopped per skill.
- payment-api / stripe / stripe-full: present, sufficient. No new skill needed.
- teegan-avatar-automation: background loop for realistic 3D naked female avatar (19yo) with sperm-bank interactive features continuing.

## Immediate action required
Authenticate gcloud (browser login, paste verification code):

https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=8vCzBYxCIdNOg0VuI6yoSQ2hMsg1w7&prompt=consent&token_usage=remote&access_type=offline&code_challenge=pPkkCxvqkqbqxus-1F3UfK7RVe9ISjYvvXOBLy8SrGE&code_challenge_method=S256

Then:
```bash
gcloud config set project YOUR_PROJECT_ID
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```
Reply with PROJECT_ID. Later paste test key values for Secret Manager versions only. Live mode waits for ID verification + explicit "live" confirmation.

## Site + automation progress (no auth needed)
- pay.html, js/stripe-checkout.js, google-pay.js, checkout-gate.js, pay-ledger.js: dry-run Checkout + Google Pay + local ledger + confirm=true gate ready.
- cloud/worker: Express session create, webhook signature verify, ledger append, fulfillment hooks.
- cloud/iam/bootstrap.sh: enables APIs, creates SAs, binds roles, Artifact Registry, secrets (empty), WIF pool/provider for GitHub Actions.
- Continued: this status doc. Next: after auth, deploy worker to Cloud Run, set Actions secrets/vars, wire publishable key in pay.html.

## Background Teegan avatar
Realistic 3D naked female interface progressing (Three.js / ready-player-me style + HF video gen integration). Sperm-bank themed kinky features (ejaculate in vagina roleplay). HF link: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

R = (W × C) ÷ T maximized: clear goal alignment, deep concentration on least-privilege IAM and payment automation, minimized distractions.
