#!/usr/bin/env python3
"""Add or remove the CareFlow link in the footer Company column, and keep sitemap.xml in step.

The footer is duplicated per page like the header, so the same argument applies: update it
everywhere or the page is unreachable from most of the site.

    python3 tools/update-footer-and-sitemap.py add
    python3 tools/update-footer-and-sitemap.py remove
    python3 tools/update-footer-and-sitemap.py check
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
FOOTER_LINK = '<a href="careflow.html">CareFlow preview</a>'
# The footer appears in two styles: the homepage writes one link per line, the inner pages
# write the column inline. Anchoring on the About link is safe because the Company column
# always lists it first, and the local style is detected so the diff stays reviewable.
COMPANY_SOLO = re.compile(
    r'^(?P<indent>[ \t]*)<h2>Company</h2>\s*\n(?P<indent2>[ \t]*)(<a href="about\.html">About</a>)[ \t]*$', re.M
)
COMPANY_INLINE = re.compile(r'<h2>Company</h2>(<a href="about\.html">About</a>)')
SITEMAP_ENTRY = (
    "  <url><loc>https://aipharmadevelopments.com/careflow.html</loc>"
    "<lastmod>2026-09-27</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n"
)
SITEMAP = ROOT / "sitemap.xml"
# pay.html has no footer navigation, 404.html is a fallback page.
PAGES = [
    "index.html", "about.html", "platform.html", "solutions.html", "research.html",
    "trust.html", "resources.html", "support.html", "privacy.html", "terms.html", "careflow.html",
]


def pages() -> list[pathlib.Path]:
    return [ROOT / name for name in PAGES if (ROOT / name).exists()]


def tidy_footer(text: str) -> str:
    """Drop whitespace-only lines left behind inside the footer by a removal."""
    start = text.find('<footer')
    if start == -1:
        return text
    close = text.find("</footer>", start)
    if close == -1:
        return text
    close += len("</footer>")
    block = text[start:close]
    kept = [line for line in block.split("\n") if line.strip() != ""]
    return text[:start] + "\n".join(kept) + text[close:]


def apply(mode: str) -> int:
    changed = 0
    skipped: list[str] = []
    for page in pages():
        text = page.read_text(encoding="utf-8")
        original = text
        # Strip any existing link BEFORE looking for the anchor. The inserted link sits
        # between the heading and the About anchor, so testing first would fail to match
        # on a re-run and the script would silently stop being idempotent.
        had_link = FOOTER_LINK in text
        text = text.replace(FOOTER_LINK, "")
        text = tidy_footer(text)

        solo = COMPANY_SOLO.search(text)
        inline = COMPANY_INLINE.search(text) if solo is None else None
        if solo is None and inline is None:
            if had_link:
                raise SystemExit(f"{page.name} has a CareFlow footer link but no Company column to remove it from")
            skipped.append(page.name)
            continue

        if mode == "add":
            if solo is not None:
                text = text[: solo.end("indent2")] + FOOTER_LINK + "\n" + solo.group("indent2") + text[solo.end("indent2"):]
            else:
                text = text[: inline.start(1)] + FOOTER_LINK + text[inline.start(1):]
        if text != original:
            page.write_text(text, encoding="utf-8")
            changed += 1

    sitemap = SITEMAP.read_text(encoding="utf-8")
    original_sitemap = sitemap
    sitemap = sitemap.replace(SITEMAP_ENTRY, "")
    if mode == "add" and "careflow.html" not in sitemap:
        # Insert before </urlset> so the ordering stays predictable.
        sitemap = sitemap.replace("</urlset>", SITEMAP_ENTRY + "</urlset>")
    if sitemap != original_sitemap:
        SITEMAP.write_text(sitemap, encoding="utf-8")
        print("  sitemap.xml updated")
    if skipped:
        print(f"  skipped (no footer navigation): {', '.join(skipped)}")
    return changed


def check() -> int:
    problems = 0
    for page in pages():
        text = page.read_text(encoding="utf-8")
        if COMPANY_SOLO.search(text) is None and COMPANY_INLINE.search(text) is None:
            continue
        if text.count(FOOTER_LINK) != 1:
            print(f"  {page.name}: expected exactly one footer link, found {text.count(FOOTER_LINK)}")
            problems += 1
    sitemap = SITEMAP.read_text(encoding="utf-8")
    if sitemap.count("careflow.html") != 1:
        print(f"  sitemap.xml: expected one careflow.html entry, found {sitemap.count('careflow.html')}")
        problems += 1
    # The sitemap must remain well-formed XML after the edit.
    try:
        import xml.etree.ElementTree as ElementTree
        ElementTree.fromstring(sitemap)
    except ElementTree.ParseError as error:
        print(f"  sitemap.xml is not well-formed XML: {error}")
        problems += 1
    return problems


if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else "check"
    if action in {"add", "remove"}:
        touched = apply(action)
        print(f"{action}: updated {touched} page(s)")
    problems = check()
    print("footer/sitemap check: OK" if problems == 0 else f"footer/sitemap check: {problems} problem(s)")
    raise SystemExit(1 if problems else 0)
