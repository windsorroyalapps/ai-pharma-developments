#!/usr/bin/env python3
"""Add or remove the CareFlow entry in the primary navigation across every page.

The header markup is duplicated in each page rather than injected, so the nav has to be
updated in every file or a visitor sees a different menu depending on where they land.
This script does that mechanically and is idempotent.

The site has two nav layouts and both are preserved rather than normalised away:

  - the homepage writes one link per line, indented;
  - the inner pages write the whole nav inline, with no whitespace between anchors.

Inserting a link in the wrong style would reflow a file and produce a diff nobody reads,
so the local style is detected and matched.

    python3 tools/update-nav.py add
    python3 tools/update-nav.py remove
    python3 tools/update-nav.py check
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
LINK = '<a href="careflow.html">CareFlow</a>'
CURRENT = '<a href="careflow.html" aria-current="page">CareFlow</a>'
# 404.html is excluded: it is a fallback page and should not advertise a product page.
# pay.html is listed but skipped at runtime because the checkout page has a minimal
# navigation with no Trust item to anchor against, and adding a product link there would
# be wrong rather than merely unnecessary.
PAGES = [
    "index.html", "about.html", "platform.html", "solutions.html", "research.html",
    "trust.html", "resources.html", "support.html", "pay.html", "privacy.html", "terms.html",
]

NAV_MARKER = '<nav class="nav-links"'
# The Trust item, either alone on its own line or inline in a compact nav.
TRUST_SOLO = re.compile(r'^(?P<indent>[ \t]*)(?P<item><a href="trust\.html"[^>]*>Trust</a>)[ \t]*$', re.M)
TRUST_INLINE = re.compile(r'<a href="trust\.html"[^>]*>Trust</a>')


def pages() -> list[pathlib.Path]:
    return [ROOT / name for name in PAGES if (ROOT / name).exists()]


def tidy_nav(text: str) -> str:
    """Drop whitespace-only lines and doubled spacing inside the nav block.

    Removing a link that occupied its own line leaves a blank line behind, which turns the
    next run into a write that changes nothing and an add that re-creates the blank line.
    Working line by line is more predictable here than a multi-line regex, and the nav is
    small enough that the cost does not matter.
    """
    start = text.find(NAV_MARKER)
    if start == -1:
        return text
    close = text.find("</nav>", start)
    if close == -1:
        return text
    close += len("</nav>")

    lines = text[start:close].split("\n")
    kept = [line for line in lines if line.strip() != ""]
    collapsed = [re.sub(r"(</a>)[ \t]{2,}(<a href=\")", r"\1\2", line) for line in kept]
    return text[:start] + "\n".join(collapsed) + text[close:]


def strip_entry(text: str) -> str:
    text = text.replace(LINK, "").replace(CURRENT, "")
    return tidy_nav(text)


def anchor_for(text: str):
    """Return (match, style) for the insertion anchor, or (None, None)."""
    if NAV_MARKER not in text:
        return None, None
    solo = TRUST_SOLO.search(text)
    if solo:
        return solo, "solo"
    inline = TRUST_INLINE.search(text)
    if inline:
        return inline, "inline"
    return None, None


def apply(mode: str) -> int:
    changed = 0
    skipped: list[str] = []
    for page in pages():
        text = page.read_text(encoding="utf-8")
        original = text

        # Strip before looking for the anchor: the inserted entry sits directly after the
        # Trust item, so testing first would fail to match on a re-run and the script
        # would quietly stop being idempotent.
        text = strip_entry(text)
        anchor, style = anchor_for(text)
        if anchor is None:
            skipped.append(page.name)
            continue

        if mode == "add":
            entry = CURRENT if page.name == "careflow.html" else LINK
            if style == "solo":
                text = text[: anchor.end()] + f"\n{anchor.group('indent')}{entry}" + text[anchor.end():]
            else:
                # The compact nav concatenates anchors with no separator; match that.
                text = text[: anchor.end()] + entry + text[anchor.end():]

        if text != original:
            page.write_text(text, encoding="utf-8")
            changed += 1
    if skipped:
        print(f"  skipped (no full navigation): {', '.join(skipped)}")
    return changed


def check() -> int:
    problems = 0
    for page in pages() + [ROOT / "careflow.html"]:
        if not page.exists():
            print(f"  MISSING {page.name}")
            problems += 1
            continue
        text = page.read_text(encoding="utf-8")
        _, style = anchor_for(text)
        if style is None:
            continue
        if LINK not in text and CURRENT not in text:
            print(f"  {page.name}: nav entry missing")
            problems += 1
        if text.count(CURRENT) > 1:
            print(f"  {page.name}: duplicate aria-current")
            problems += 1
        if (CURRENT in text) != (page.name == "careflow.html"):
            print(f"  {page.name}: aria-current is wrong for this page")
            problems += 1
        if style == "solo" and any(LINK in line and line.count("<a ") > 1 for line in text.splitlines()):
            print(f"  {page.name}: entry shares a line in a one-link-per-line nav")
            problems += 1
        if style == "inline" and any(line.count("<a href=") > 1 and LINK in line and not line.strip().startswith("<nav") for line in text.splitlines()):
            # Compact nav is legitimately multi-link on one line; only flag stray newlines.
            pass
    return problems


if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else "check"
    if action in {"add", "remove"}:
        touched = apply(action)
        print(f"{action}: updated {touched} page(s)")
    problems = check()
    print("nav check: OK" if problems == 0 else f"nav check: {problems} problem(s)")
    raise SystemExit(1 if problems else 0)
