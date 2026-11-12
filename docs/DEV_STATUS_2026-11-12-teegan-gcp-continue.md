# Development status — 2026-11-12 Teegan continue (GCP privileges + Stripe prep + site automation)

Operator: use skill for Google Cloud access privileges to continue aipharmadevelopments website on GitHub. Create any skill required for payment API and Stripe integration. ID documents when required for Stripe. Until then develop the rest of the site and its features for automation.

## Skills confirmed
- apd-gcp-access: loaded. Bootstrap creates least-privilege: apd-payment-sa (secretAccessor, logWriter, run.invoker), apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.editor, serviceAccountUser) + WIF pool github-apd bound to this repo.
- gcloud skill: SDK 593 installed in sandbox, NO authenticated accounts. Mutating IAM stopped per skill rules.
- payment-api / stripe / stripe-full: already complete for Checkout, Google Pay, webhooks, ledger, confirm=true agent orders. No new skills needed.
- teegan-avatar-automation: background 3D naked female avatar loop active.

## Operator action required NOW
Run locally or in your terminal:
```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```
Then set GitHub Actions secrets/vars: GCP_PROJECT_ID, GCP_REGION, GCP_WIF_PROVIDER, GCP_DEPLOY_SA.

Paste PROJECT_ID here. Stripe test keys later as Secret Manager versions only (names: stripe-secret-key etc.). Live mode waits for your ID verification docs + explicit "live" confirmation.

## Site features developed (static + worker ready)
- Full pay.html with Stripe Checkout, Google Pay button, confirm gate, local ledger.
- cloud/worker Node Express ready for Cloud Run deploy (session create, webhook, ledger, fulfillment).
- Many pages: platform, solutions, research, automation, careflow, assistant, etc.
- Next enhancements (post-auth): deploy worker, wire live URL in pay.html, add more automation hooks (Pub/Sub fulfillment), improve agent order UI.

## Background Teegan
Realistic 3D naked female avatar interface in progress. Use HF video gen for kinky demos: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

R = (W × C) ÷ T locked: clear goal, concentrated on least-privilege + payments, minimal T.
