# DEV STATUS 2026-11-11 — Teegan continue GCP + automation

gcloud SDK installed in sandbox. No active account. Auth required before any IAM mutate.

## Auth URL (complete in browser, paste code back if prompted)
https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=32555940559.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsdk.cloud.google.com%2Fauthcode.html&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsqlservice.login+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&state=jt8ukm0zFfSKUR3sMM1P6AoCgnpNzU&prompt=consent&token_usage=remote&access_type=offline&code_challenge=XBexQ0oFh09n4WTfakIuEwMiti1dIFSB3mfpCQKP7dU&code_challenge_method=S256

After auth + PROJECT_ID:
bash cloud/iam/bootstrap.sh
bash cloud/automation/apply-after-auth.sh

Stripe skills ready (payment-api, stripe, stripe-full). Live keys after ID verification.

Site automation features: dry-run worker, ledger, fulfillment stubs ready. Developing further agent-gated orders and GCP hooks.

HF kinky video gen: https://huggingface.co/spaces/Heartsync/NSFW-Uncensored-video
