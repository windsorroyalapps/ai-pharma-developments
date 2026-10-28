# Development status — 2026-10-28

## GCP / IAM

- Skills: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full` loaded. No new payment skills needed.
- Sandbox: Google Cloud SDK 591.0.0 installed at `/root/google-cloud-sdk`. `gcloud` on PATH for this session.
- No active account. `gcloud auth list` empty. Project unset. IAM not mutated. Bootstrap not executed.
- Operator must complete `gcloud auth login --no-launch-browser` on a trusted machine (or paste verification code if interactive here), then supply PROJECT_ID only.
- Blockers remain in `docs/PAYMENT_STATUS.md` and `docs/NEXT_OPERATOR_ACTIONS.md`.
- Auth URL generated this session; complete on your machine then reply with PROJECT_ID.

## Dry-run extensions this session

- Confirmed payment/Stripe skills sufficient; no additional skill created.
- Continue expanding local dry-run features (queues, quotes, credit notes, intake, fulfillment, automation.html) without live keys.
- Site features ready for further automation development.
- No Stripe keys, ID documents, or service-account JSON committed.

## Still blocked

Operator authenticates, provides project id, completes Stripe identity verification with ID docs, then explicitly authorizes live mode.

Continue local dry-run development until then.

## Future improvement

After auth + project: run `cloud/iam/bootstrap.sh` + `cloud/automation/apply-after-auth.sh`, set GitHub Actions vars, store test key versions in Secret Manager.
