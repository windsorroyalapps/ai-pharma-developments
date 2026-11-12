# Payment and GCP status — 2026-11-13 09:20 AEDT

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill required for payment API or Stripe.

Identity documents stay out of git. Complete Stripe ID verification in Dashboard. Live charges blocked until operator says "live" and keys confirmed.

## Blocker (this cycle)

Sandbox: gcloud SDK installed. `gcloud auth list` returns `[]`. No credentialed account. Project unset. IAM not mutated. `cloud/iam/bootstrap.sh` and `cloud/automation/apply-after-auth.sh` not run. No project ID invented. No SA emails or WIF provider available.

**Authenticate now (operator machine):**
```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
```
Paste the verification code back if running interactively, or complete on a machine with a browser.

After auth succeeds and project is set:
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

Expected outputs after bootstrap: runtime SA `apd-payment-sa@PROJECT.iam.gserviceaccount.com`, deploy SA `apd-deploy-sa@...`, WIF provider resource name.

## Built / improved in dry-run (this cycle)
- pay.html local ledger: stronger dry-run banner, forced charged:false, export includes dry_run flag
- automation.html: added "Show local dry-run status" button; health probe messages now include version and auth_blocker note; confirm=true gate unchanged and still refuses unchecked agent orders
- worker readiness: version bumped to 1.0.2-dry, auth_blocker: true, note updated
- consult intake fallback: explicit dry_run flag and clearer local view text
- All agent paths continue to require confirm=true; no live charges created

Continue expanding automation features without live keys or GCP mutations. Secrets remain names only: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key.

Still waiting on:
1. Operator GCP login + project set
2. Stripe Dashboard identity verification for live keys (test keys can be added earlier to Secret Manager)
