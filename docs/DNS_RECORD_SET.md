# DNS record set — aipharmadevelopments.com (GitHub Pages)

Domain: aipharmadevelopments.com
Pages source: windsorroyalapps/ai-pharma-developments (CNAME = aipharmadevelopments.com)

## GitHub Pages record set

CNAME (apex)   -> aipharmadevelopments.com
  (pages config `cname` = aipharmadevelopments.com, status `built`)

www CNAME      -> windsorroyalapps.github.io

## GitHub Pages A records (the "ip settings")

185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153

## Notes

- GitHub Pages hosts the content at https://aipharmadevelopments.com/ (https_enforced).
- The certificate for the apex and www is Approved (expires 2026-12-23).
- The recursive A/CNAME records live in Cloud DNS zone `aipharmadevelopments-com`
  on project aisexgod. They are the billable gate: without them the domain
  does not resolve to the four GitHub Pages IPs above.
