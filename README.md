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
- GitHub Pages fallback: https://windsorroyalapps.github.io/ai-pharma-developments/

## Current site scope

- Responsive, accessible public website with a mobile navigation menu
- Platform, solution, research, trust, resources, about, and support pages
- Privacy notice, terms, custom 404 page, sitemap, and robots file
- Support enquiry form that opens a user-reviewed email draft
- SEO metadata, canonical URLs, social metadata, and Organization JSON-LD
- Illustrative content only; no unsupported customer, clinical, or performance claims
- Payment integration deliberately deferred to the final phase

## Technical structure

- Static HTML5
- Shared CSS design system in `css/styles.css`
- Progressive-enhancement JavaScript in `js/site.js`
- No runtime framework, analytics tracker, or application server
- No payment integration changes are included in the current site-development phase

## Local preview

```bash
python3 -m http.server 4173 --directory .
```

Open http://127.0.0.1:4173/

## Validation

```bash
node --check js/site.js
chromium --headless=new --disable-gpu --no-sandbox --dump-dom http://127.0.0.1:4173/
```

The production support form uses a `mailto:` workflow and should not be used for sensitive or regulated data.
