# Credit notes (dry-run)

No Stripe refund is created. No live charge.

```bash
node tools/credit-note-preview.js consult-30 --cents 5000 --reason "overlap"
node tools/credit-note-preview.js consult-30 --agent
node tools/credit-note-preview.js consult-30 --agent --confirm
```

The agent form exits 2 until `--confirm` is present. Amount must be an integer from 100 through the catalog SKU amount, AUD only.

Browser page: `adjustments.html` stores drafts in `localStorage` key `apd_credit_notes`. Confirm is required when the agent box is checked.

Worker `POST /credit-note` (and the keyless dry-run server) appends a ledger row with `refunded: false` and `stripe_refund: false`. It does not call `stripe.refunds`.
