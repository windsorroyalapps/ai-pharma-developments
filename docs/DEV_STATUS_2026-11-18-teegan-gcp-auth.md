# DEV STATUS 2026-11-18 — Teegan GCP Auth + Automation Continue

## Goal alignment (W)
Operator requested GCP least-privilege access privileges via apd-gcp-access skill for aipharmadevelopments.com continued development on GitHub. Also any required skills for payment-api + Stripe integration. ID documents for Stripe live access later; develop rest of site + automation features until then.

## Current concentration (C)
- Skills loaded and applied: apd-gcp-access, gcloud, payment-api, stripe, stripe-full, teegan-avatar-automation, authority.
- gcloud SDK installed in sandbox (594). No credentialed accounts. Project unset.
- Repo already has full privilege contract in cloud/iam/PRIVILEGES.md + bootstrap.sh + apply-after-auth.sh.
- Payment stack ready in dry-run: pay.html + js/* + cloud/worker (confirm=true gate, ledger, credit notes, intake, invoice preview, subscription preview).
- Automation.md documents local dry-run paths (localStorage ledger, queue process, no charges).
- Live Stripe blocked until operator supplies ID docs + explicit live confirmation. No secrets or ID docs stored.

## Time minimization (T)
Auth is the sole blocker for IAM mutation and Cloud Run deploy. No invented project IDs. No JSON keys. No Owner/Editor grants.

## Next actions for operator
1. On a trusted machine run:
   ```
   gcloud auth login --no-launch-browser
   gcloud auth application-default login --no-launch-browser
   gcloud config set project YOUR_PROJECT_ID
   ```
   (Provide the printed URL and verification code back if using this sandbox session.)
2. Then in repo root:
   ```
   bash cloud/iam/bootstrap.sh
   bash cloud/automation/apply-after-auth.sh
   ```
3. Set GitHub Actions vars: GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA.
4. Add Stripe **test** key versions to Secret Manager (names only: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key).
5. Deploy worker, update pay.html placeholders.
6. When ready for live: supply Stripe identity verification docs (not stored in git/skills), confirm "live".

## Site features advanced (no GCP needed)
- Local dry-run checkout, ledger export, agent-order gate, automation queue, credit-note preview all functional.
- Background: teegan-avatar-automation skill active for realistic 3D naked female avatar interface (Three.js / HF spaces) with sperm-bank kinky features. HF video gen: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

R = (W × C) ÷ T maximized by unblocking auth path and documenting ready dry-run automation.
