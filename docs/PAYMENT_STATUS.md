# Payment and GCP status — 2026-10-02

Skills in use: `apd-gcp-access`, `gcloud`, `payment-api`, `stripe`, `stripe-full`.

## Blocker

Sandbox gcloud is installed. `gcloud auth list` shows no credentialed accounts. Project is unset.

IAM was not mutated. Do not treat bootstrap as done.

Operator next step:

```bash
gcloud auth login --no-launch-browser
```

Paste the verification code in chat. Then:

```bash
gcloud config set project PROJECT_ID
bash cloud/iam/bootstrap.sh
```

## Built without live keys

- `pay.html` local dry-run ledger (`apd_ledger`)
- `orders.html` reads that ledger
- Worker dry-run sessions when `STRIPE_SECRET_KEY` is absent
- Agent path refuses orders unless `confirm=true` and still does not charge

## Still waiting

- Stripe identity documents (operator will supply later; never commit them)
- Test key versions in Secret Manager
- GitHub Actions variables `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_WIF_PROVIDER`, `GCP_DEPLOY_SA`
- Live mode explicit confirmation
