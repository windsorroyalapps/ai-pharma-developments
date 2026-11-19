# Development status — 2026-11-19 Teegan (GCP privileges + Stripe prep)

Operator request: use apd-gcp-access skill for Google Cloud privileges to continue aipharmadevelopments.com on GitHub; create any payment/Stripe skills required; ID documents later for Stripe live; develop rest of site + automation until then.

## Skills (no new skill required)

| Skill | Status |
|-------|--------|
| apd-gcp-access | Active — least-privilege bootstrap, WIF, Secret Manager names |
| gcloud | SDK 594 installed in sandbox; **no active account** |
| payment-api | Ready — Checkout, ledger, agent confirm=true gate |
| stripe | Ready — Elements/Checkout, webhooks, Google Pay bridge |
| stripe-full | Ready — full APD worker path, dry-run until live confirmed |

## GCP auth blocker (must resolve before IAM mutate)

Sandbox has no credentialed gcloud account. Do not invent PROJECT_ID.

1. Open this URL and complete Google sign-in:

```
https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=R7OfzLmtZTaeENuISjggkPgFMFGRnU&prompt=consent&token_usage=remote&access_type=offline&code_challenge=Ckl3OCOqhmrZs2Wa2fkQnTaBjSBoJSohyt_dMfYxVDY&code_challenge_method=S256
```

2. Paste the verification code back to the agent (or run locally):

```bash
export PATH="$HOME/google-cloud-sdk/bin:$PATH"
gcloud auth login --no-launch-browser   # paste code when prompted
gcloud auth application-default login --no-launch-browser
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region australia-southeast1
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
bash cloud/iam/print-github-vars.sh
```

3. Set GitHub Actions variables on the repo:
   - `GCP_PROJECT_ID`
   - `GCP_REGION` = `australia-southeast1`
   - `GCP_WIF_PROVIDER` (from print-github-vars.sh)
   - `GCP_DEPLOY_SA` = `apd-deploy-sa@PROJECT_ID.iam.gserviceaccount.com`

4. Stripe test keys only (after keys exist):

```bash
echo -n sk_test_... | gcloud secrets versions add stripe-secret-key --data-file=-
echo -n whsec_... | gcloud secrets versions add stripe-webhook-secret --data-file=-
echo -n pk_test_... | gcloud secrets versions add stripe-publishable-key --data-file=-
```

Live keys + identity verification (ID documents) wait for explicit operator confirmation. Never store ID docs in git or skills.

## Site + automation (already in main)

- `pay.html` + `js/stripe-checkout.js` + Google Pay + local ledger + `confirm=true` agent gate
- `cloud/worker` Express service: create-checkout-session, webhook, agent-order, credit-note, intake, invoice-preview, dry-run when no key
- `.github/workflows/deploy-worker.yml` — WIF deploy to Cloud Run when vars set
- `cloud/iam/bootstrap.sh` — SAs, APIs, secrets (empty), WIF pool github-apd
- Region locked to `australia-southeast1`

## Next after auth

1. Deploy worker via workflow_dispatch or push under `cloud/worker/**`
2. Wire `window.STRIPE_PUBLISHABLE_KEY` + `CREATE_CHECKOUT_SESSION_URL` on pay.html (or inject from worker)
3. Stripe Dashboard: enable Google Pay, create webhook → Cloud Run `/webhook`
4. Test card 4242 4242 4242 4242
5. Live only after ID verification + `STRIPE_LIVE_OK=1` + operator "live" word

## Background

Teegan avatar automation continues (3D realistic interface, HF video gen). HF: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

R = (W × C) ÷ T — goal locked, concentration on IAM/payments, zero distraction text.
