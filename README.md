# AI Pharma Developments

Responsive public website for **AI Pharma Developments**, focused on human-supervised AI for pharmaceutical discovery, clinical evidence, manufacturing quality, and patient support.

## Live URLs

- Website: https://aipharmadevelopments.com/
- Platform: https://aipharmadevelopments.com/platform.html
- Solutions: https://aipharmadevelopments.com/solutions.html
- Research: https://aipharmadevelopments.com/research.html
- Trust: https://aipharmadevelopments.com/trust.html
- Resources: https://aipharmadevelopments.com/resources.html
- Customer support: https://aipharmadevelopments.com/support.html
- Pay: https://aipharmadevelopments.com/pay.html
- GitHub Pages fallback: https://windsorroyalapps.github.io/ai-pharma-developments/

## Current site scope

- Responsive, accessible public website with mobile navigation
- Platform, solution, research, trust, resources, about, support pages
- Privacy, terms, 404, sitemap, robots
- Support form (mailto draft)
- SEO + Organization JSON-LD
- **Payments**: Stripe Checkout + Google Pay (via Stripe gateway)
  - Frontend: `pay.html`, `js/stripe-checkout.js`, `js/google-pay.js`
  - Backend: `cloud/worker` (Cloud Run) for session creation + signed webhooks
  - Secrets: Google Secret Manager (never committed)
  - Live mode gated on Stripe identity verification (ID docs)

## Technical structure

- Static HTML5 + shared CSS design system
- Progressive JS
- Cloud Run Node worker for payment automation
- No card data on origin when using Stripe Checkout / Elements

## Local preview

```bash
python3 -m http.server 4173 --directory .
```

Open http://127.0.0.1:4173/

## Payment worker (Cloud Run)

```bash
cd cloud/worker
# set STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET via Secret Manager
gcloud builds submit --tag REGION-docker.pkg.dev/PROJECT/apd-repo/apd-payment-worker:latest
gcloud run deploy apd-payment-worker --image ... --region ... --service-account apd-payment-sa@...
```

Then update `window.CREATE_CHECKOUT_SESSION_URL` and `window.STRIPE_PUBLISHABLE_KEY` in `pay.html`.

## Validation

```bash
node --check js/site.js js/stripe-checkout.js js/google-pay.js
```

## Skills / automation

- `gcp-access` skill: least-privilege IAM, WIF, Secret Manager, deploy posture
- `stripe-full` + `payment-api` + `stripe` skills: Checkout, webhooks, Google Pay, agent-gated orders
- Agent outbound orders require explicit `confirm=true`
