# Agent-gated orders

Any Grok/agent checkout against the payment worker MUST include:

```json
{
  "amount_cents": 10000,
  "currency": "aud",
  "description": "AI Pharma Developments services",
  "customer_email": "billing@client.com",
  "source": "agent",
  "confirm": true
}
```

`POST {CLOUD_RUN}/create-checkout-session`

If `source` is `agent` and `confirm` is not exactly `true`, the worker returns 403.

Do not create live charges until Secret Manager holds live keys and the operator says live.
Do not store identity documents in this repo.

`POST {CLOUD_RUN}/invoice-preview` uses the same gate and returns `charged: false`. It does not create a Stripe invoice.

`POST {CLOUD_RUN}/intake` with `source: "agent"` also requires `confirm: true`.

Local check: `node tools/consult-intake-check.js`
