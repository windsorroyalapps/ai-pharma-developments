#!/usr/bin/env python3
"""Build careflow.html for the AI Pharma Developments site.

The page is generated rather than hand-written so the shared header, footer and brand
mark stay byte-identical to the other pages. Divergence in those regions is how a
marketing site ends up with a broken nav on one page and nobody notices.

The page-specific stylesheet is linked only from this page, so removing the page is a
matter of deleting careflow.html, css/careflow.css and this script, and reverting the nav.
The shared stylesheet is never edited, which keeps unreviewed content out of every other
page on the site.

Run from the repository root:  python3 tools/build-careflow-page.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCE_PAGE = ROOT / "trust.html"
OUTPUT = ROOT / "careflow.html"

# Reuse a sibling page as the source of truth for shared chrome.
trust = SOURCE_PAGE.read_text(encoding="utf-8")
header = re.search(r"  <header class=\"site-header\">.*?</header>", trust, re.S).group(0)
footer = re.search(r"  <footer class=\"site-footer\">.*?</footer>", trust, re.S).group(0)

# The new page goes in the nav after Trust, and is marked current while it is the page
# being viewed. Reuse the existing brand gradient id per page to avoid duplicate ids.
header = header.replace(
    '<a href="trust.html" aria-current="page">Trust</a>',
    '<a href="trust.html">Trust</a><a href="careflow.html" aria-current="page">CareFlow</a>',
)
header = header.replace("brand-gradient-trust", "brand-gradient-careflow")

# Footer: add a CareFlow column entry under Company so the page is reachable from any page.
footer = footer.replace(
    '<div class="footer-column"><h2>Company</h2><a href="about.html">About</a>',
    '<div class="footer-column"><h2>Company</h2><a href="careflow.html">CareFlow preview</a><a href="about.html">About</a>',
)

TITLE = "CareFlow Preview Status | AI Pharma Developments"
DESCRIPTION = (
    "CareFlow is a synthetic-data-only preview of an Australian-first, on-premises GP practice "
    "platform. It is under further development and regulatory approval and cannot hold real patient data."
)

STATUS_ROWS = [
    ("Data", "Synthetic only", "Real patient data is not authorised. The platform refuses clinical data mode until every required approval is current."),
    ("Electronic prescribing", "Not enabled", "Represented by a non-transmitting local harness. No provider contract and no conformance claim."),
    ("Regulatory approval", "In progress", "Not held."),
    ("Clinical safety case", "Not started", "Requires independent clinical review and a hazard analysis."),
    ("Privacy impact assessment", "Not completed", "Outstanding."),
    ("Independent penetration test", "Not commissioned", "Outstanding, including the identity-plane and worker roles."),
    ("Billing and payments", "Disabled by design", "Cannot be switched on in this release."),
]

NOT_YET = [
    ("Not for real patient data",
     "No real patient information should be entered, and none is authorised. Clinical, privacy, safety, "
     "terminology, accessibility, backup and incident-response approvals must each be recorded against "
     "registered evidence before real-data mode is permitted."),
    ("Not an e-prescribing system",
     "Electronic prescribing exists only as a local conformance harness. It cannot transmit a prescription, "
     "cannot reach a pharmacy, and makes no claim of conformance with any Australian ePrescribing framework. "
     "There is no national pharmacy connectivity."),
    ("Not approved for clinical use",
     "There is no regulatory approval, clinical safety case, independent penetration test or privacy impact "
     "assessment. Those are the next steps, not completed work."),
    ("Not a billing or claims system",
     "Billing, claims, card and EFTPOS processing are deliberately disabled and cannot be enabled."),
]

DEMONSTRATES = [
    ("Practice operations",
     "Multi-tenant scheduling with practitioner and room conflict protection, authorisation-required "
     "capacity overrides with immutable records, check-in, communication preferences and an append-only audit trail."),
    ("Clinical workflow boundaries",
     "Clinician-authored record drafts that remain inactive until a prescriber with a verified second factor "
     "signs them, purpose-specific consent records, and prescription drafts that produce watermarked, "
     "non-dispensing previews only."),
    ("Document safety",
     "Uploaded documents are quarantined and malware-scanned before anyone can read them, and a scanner "
     "failure keeps them locked rather than admitting them. Documents are encrypted with per-document keys "
     "wrapped by an independently managed key."),
    ("Separation of duties",
     "Six roles with enforced boundaries: a nurse cannot sign a clinical record, reception cannot open the "
     "clinical workspace, and release approvals require named authorised roles rather than a single administrator."),
]


def status_table() -> str:
    cells = []
    for name, state, detail in STATUS_ROWS:
        cells.append(
            f"        <div class=\"status-row\"><dt>{name}</dt>"
            f"<dd><span class=\"tag\">{state}</span><span>{detail}</span></dd></div>"
        )
    return "\n".join(cells)


def not_yet_grid() -> str:
    cards = []
    for heading, body in NOT_YET:
        cards.append(
            f"          <article class=\"detail-card\"><h3>{heading}</h3><p>{body}</p></article>"
        )
    return "\n".join(cards)


def demonstrates_grid() -> str:
    cards = []
    for heading, body in DEMONSTRATES:
        cards.append(
            f"          <article class=\"detail-card\"><h3>{heading}</h3><p>{body}</p></article>"
        )
    return "\n".join(cards)


PAGE = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{TITLE}</title>
  <meta name="description" content="{DESCRIPTION}">
  <meta name="theme-color" content="#06131f">
  <meta name="color-scheme" content="dark">
  <link rel="canonical" href="https://aipharmadevelopments.com/careflow.html">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/careflow.css">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{TITLE}">
  <meta property="og:description" content="Synthetic data only. Under further development and regulatory approval.">
  <meta property="og:url" content="https://aipharmadevelopments.com/careflow.html">
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
{header}

  <main id="main">
    <!-- The status banner is the first thing in the page. It is repeated as a heading and
         again in the footer so a visitor cannot miss it by skimming, and the state is
         always written out in words rather than signalled by colour alone. -->
    <div class="careflow-status-bar"><div class="container">
      <p><span class="careflow-status-pill">Synthetic data only</span><span class="careflow-status-text">Under further development and regulatory approval</span></p>
    </div></div>

    <section class="page-hero"><div class="container page-hero-grid"><div><div class="eyebrow"><span class="eyebrow-dot"></span>CareFlow preview status</div><h1>A preview, not a system for patient care.</h1><p class="lead">CareFlow is an early preview of a practice-operations platform for Australian general practice, hosted on premises at the clinic. Everything it does today runs on invented data. It is not a diagnostic system, not a prescribing system, and not a source of clinical truth.</p></div><aside class="page-hero-aside" aria-label="CareFlow status summary"><span>Current status</span><ul><li>Synthetic data only</li><li>Under further development</li><li>Regulatory approval in progress</li><li>Not for real patient care</li><li>No ePrescribing transmission</li></ul></aside></div></section>

    <section class="section">
      <div class="container content-grid">
        <aside class="sticky-aside" aria-label="CareFlow guide"><h2>On this page</h2><a href="#not-yet">What this is not</a><a href="#demonstrates">What it demonstrates</a><a href="#status">Development status</a><a href="#access">Requesting access</a></aside>
        <div class="prose-stack">
          <section class="prose-block" id="not-yet"><div class="eyebrow">Boundaries</div><h2>What this is not yet.</h2><p>We publish these limits deliberately. A preview that overstates its own readiness is worse than no preview, because a practice could make a clinical decision on the strength of a marketing claim.</p><div class="grid-2">
{not_yet_grid()}
          </div></section>

          <section class="prose-block" id="demonstrates"><div class="eyebrow">Scope</div><h2>What the preview does demonstrate.</h2><p>The value of the preview is that the safety boundaries are real and testable, not simulated. Each item below is enforced in code and covered by automated tests.</p><div class="grid-2">
{demonstrates_grid()}
          </div><div class="callout"><p><strong>Every role boundary is asserted, not assumed.</strong> Automated tests confirm that a nurse cannot sign a clinical record, that reception and audit roles cannot read clinical records, and that release approvals follow a role matrix instead of a single administrator permission.</p></div></section>

          <section class="prose-block" id="status"><div class="eyebrow">Status</div><h2>Development status.</h2><p>Each status below changes only when there is evidence for the change, not when there is an intention to change it.</p><dl class="status-table">
{status_table()}
          </dl><div class="callout"><p><strong>Why the status is public.</strong> Prospective users and reviewers need to know these limits before a demonstration, not after. Publishing them is the same principle as publishing a clinical safety case: the claim and its limits travel together.</p></div></section>

          <section class="prose-block" id="access"><div class="eyebrow">Access</div><h2>Requesting access to the preview.</h2><p>The preview is demonstrated to interested practices and reviewers under a demonstration agreement, on synthetic data only. Access is granted per organisation.</p><p>Commercial discussion about future availability is welcome, but payment is not taken for clinical use before the approvals listed above exist. If that timeline does not suit your practice, we would rather say so now than take a deposit against a capability we cannot yet deliver safely.</p><div class="hero-actions"><a class="btn btn-primary" href="support.html?topic=CareFlow%20preview#contact">Request a preview demonstration</a><a class="btn btn-secondary" href="trust.html#governance">Review governance approach</a></div></section>
        </div>
      </div>
    </section>

    <section class="section section-soft"><div class="container"><div class="cta-panel"><div class="cta-grid" aria-hidden="true"></div><div class="cta-content"><span class="eyebrow">See the boundaries for yourself</span><h2>Evaluate the preview against your own requirements.</h2><p>Bring your clinical, privacy, security and intended-use requirements and we will show exactly where the system stops, who is accountable for each decision, and what remains outstanding.</p><div class="hero-actions"><a class="btn btn-light" href="support.html?topic=CareFlow%20preview#contact">Start a preview review <span aria-hidden="true">↗</span></a><a class="btn btn-outline-light" href="trust.html">Read the trust principles</a></div></div></div></div></section>
  </main>

{footer}
  <script src="js/site.js"></script>
</body>
</html>
"""

OUTPUT.write_text(PAGE, encoding="utf-8")
print(f"wrote {OUTPUT.relative_to(ROOT)} ({len(PAGE)} bytes)")
