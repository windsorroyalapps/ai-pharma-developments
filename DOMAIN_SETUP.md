# Register + wire aipharmadevelopments.com

## Status
- GitHub Pages custom domain set to `aipharmadevelopments.com`
- Repo `CNAME` committed
- Google Cloud billing accounts on this login are **closed**, so automatic Cloud Domains registration is blocked until billing is reopened

## Register the domain
Pick one:

### Option A — Google Cloud Domains (aisexgod)
1. Reopen/activate billing: https://console.cloud.google.com/billing
2. Link billing to project `aisexgod`
3. Register: https://console.cloud.google.com/net-services/domains/registrations/new?project=aisexgod
4. Use Google DNS or custom DNS with records below

### Option B — Google Domains / Squarespace
https://domains.google.com/registrar/search?searchTerm=aipharmadevelopments.com

### Option C — Any registrar
Buy `aipharmadevelopments.com`, then set DNS:

**A (apex):**
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

**CNAME:**
- www → windsorroyalapps.github.io

## After DNS propagates
GitHub will show domain verified and issue HTTPS cert automatically.
