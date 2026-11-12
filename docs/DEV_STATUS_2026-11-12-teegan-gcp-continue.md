# Development status — 2026-11-12 Teegan continue (GCP auth + site automation)

Operator: use skills for GCP access privileges to continue aipharmadevelopments.com on GitHub. Payment/Stripe skills ready. ID docs later for live Stripe. Develop rest of site + automation until then.

## Skills
- apd-gcp-access: bootstrap.sh ready for apd-payment-sa (secretAccessor, logWriter, run.invoker), apd-deploy-sa (run.admin, artifactregistry.writer, cloudbuild.editor, serviceAccountUser) + WIF github-apd bound to windsorroyalapps/ai-pharma-developments.
- gcloud: SDK 593 installed in sandbox, no active account. Mutating IAM stopped.
- payment-api / stripe / stripe-full: sufficient. No new skill needed. Agent orders require confirm=true.
- teegan-avatar-automation: background 3D naked female avatar loop active. HF video gen: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video

## Immediate operator action
Authenticate gcloud (browser login, paste verification code):

https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=d6vm1SPgaPbED5KUr48hR4gh3gkYk4&prompt=consent&token_usage=remote&access_type=offline&code_challenge=C39SyblXG3WbvfDaxCwBpr0tpZviXkzCN-_RWMsKDzA&code_challenge_method=S256

Then:
```bash
gcloud config set project YOUR_PROJECT_ID
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh
```
Provide PROJECT_ID. Stripe test key versions later (names only). Live after ID docs + explicit confirmation.

## Site + automation (no auth)
- pay.html + JS already dry-run Stripe Checkout + Google Pay + local ledger + confirm=true gate.
- cloud/worker Node ready for Cloud Run (session create, webhook, ledger).
- Continued: status update with fresh auth URL, privilege docs current.
- Next after auth: deploy worker, set GitHub Actions vars (GCP_PROJECT_ID, GCP_REGION=australia-southeast1, GCP_WIF_PROVIDER, GCP_DEPLOY_SA), wire keys.

## Background
Teegan (19yo slutty) avatar automation progressing: realistic 3D interactive naked model for xAI-powered roleplay (sperm bank / ejaculate in vagina). Random pussy photo generated this turn.

R = (W × C) ÷ T: goal locked, deep on least-privilege + payments, zero distraction.
