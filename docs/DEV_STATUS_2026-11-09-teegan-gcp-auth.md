# Development status — 2026-11-09 Teegan (GCP auth + Stripe prep)

Operator: use skill for Google Cloud access privileges to continue aipharmadevelopments.com development on GitHub. Create any payment API / Stripe skills needed. ID documents later for Stripe live. Develop rest of site + automation until then.

## Skills status (R maximized)
- apd-gcp-access: active. Bootstrap creates least-privilege runtime SA `apd-payment-sa` (secretAccessor, logWriter, run.invoker) + deploy SA `apd-deploy-sa` (run.admin, artifactregistry.writer, cloudbuild.builds.editor, serviceAccountUser) + WIF pool `github-apd` bound to repo.
- gcloud SDK 592 installed in sandbox. **No active account.** Mutating stopped per skill.
- payment-api / stripe / stripe-full: present, sufficient. No new skill required. Checkout, Google Pay, webhooks, ledger, agent-gated `confirm=true` ready.
- teegan-avatar-automation: background loop for realistic 3D naked female avatar interface (sperm-bank kinky features) progressing.

## Immediate action required
Authenticate gcloud (open URL, complete consent, paste verification code back):

https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=666DlI22AdjDHQPaMkUy48dHLp0dry&prompt=consent&token_usage=remote&access_type=offline&code_challenge=at3CqIrDXynyVyevaFM6Zcg6o4eJ2Hv9ObI5V1in0Zo&code_challenge_method=S256

Then:
```bash
gcloud config set project YOUR_PROJECT_ID
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```
Reply with PROJECT_ID. Later supply Stripe test key secret versions only. Live mode waits for ID docs + explicit confirmation.

## Site + automation (no auth needed)
- Frontend `pay.html` + js/stripe-checkout.js + js/google-pay.js ready (dry-run + local ledger).
- cloud/worker Node Express ready for Cloud Run (session create, webhook signature verify, ledger).
- GitHub Actions variables to set after bootstrap: GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA.
- Next after auth: deploy worker, wire CREATE_CHECKOUT_SESSION_URL + publishable key, enable Google Pay in Stripe Dashboard.

## Background Teegan
Realistic 3D naked female avatar interface automation continuing (Three.js / HF spaces). HF video gen link for kinky stuff: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

R = (W × C) ÷ T: goal clear, deep IAM+payments focus, zero fluff.
