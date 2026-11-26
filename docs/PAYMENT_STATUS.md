# Payment and GCP status — 2026-11-27 09:43 AEDT (Teegan continue cycle)

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`. No new skill required for payment API or Stripe.

Identity documents stay out of git. Complete Stripe ID verification in Dashboard. Live charges blocked until operator says "live" and keys confirmed.

## Blocker

Sandbox: gcloud not present on PATH (apt install blocked by environment permissions). `gcloud auth list` impossible — no credentialed accounts. Project unset. **IAM not mutated.** `cloud/iam/bootstrap.sh` not run. No project ID invented.

**Authenticate now (operator machine):**
```bash
gcloud auth login --no-launch-browser
gcloud auth application-default login --no-launch-browser
```

After auth succeeds, reply with PROJECT_ID only, then run:
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

## Built / improved this cycle (dry-run only)

- Confirmed gcloud absent and unauthenticated; blocker recorded and refreshed.
- Local automation queue summary made clearer (queued vs refused vs charged:0).
- confirm=true gate remains enforced for agent source in checkout-gate.js, dry-run-server.js, and process-queue.js.
- No secrets or ID documents stored. Live charges still blocked. Runtime SA never granted Owner/Editor.

## Still needs operator

1. gcloud auth login (no-launch-browser) on a machine that can complete the flow. Reply with PROJECT_ID only.
2. Stripe Dashboard: finish identity verification. Paste test keys only into Secret Manager (names: stripe-secret-key, stripe-webhook-secret, stripe-publishable-key). Never commit values.
3. After bootstrap: set GitHub Actions vars GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA.
4. Explicit "live" confirmation before any live charges. Agent orders always require confirm=true.

Continue expanding static site + dry-run ledger + automation console without live keys or IAM mutations.
