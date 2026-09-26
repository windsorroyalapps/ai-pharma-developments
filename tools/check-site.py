#!/usr/bin/env python3
"""Pre-publish checks for the site.

Run before pushing. The site is hand-edited static HTML with duplicated chrome, so the
failure modes are boring ones: a link to a file that does not exist, a duplicate id, a
heading level that skips, a missing alt, an unclosed tag. Those are all catchable without a
browser, and catching them here is much cheaper than catching them on a live domain.

    python3 tools/check-site.py
"""
import pathlib
import re
import sys
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = sorted(
    p for p in ROOT.glob("*.html") if p.name != "404.html"
)


class Structure(HTMLParser):
    """Collects the things a regex sweep misses."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.hrefs: list[str] = []
        self.headings: list[int] = []
        self.images_without_alt: list[str] = []
        self.has_lang = False
        self.has_title = False
        self.has_h1 = False
        self.has_main = False
        self.unclosed: list[str] = []
        self._stack: list[str] = []
        self.void = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "html":
            self.has_lang = bool(attributes.get("lang"))
        if tag == "title":
            self.has_title = True
        if "id" in attributes:
            self.ids.append(attributes["id"])
        if tag == "a" and "href" in attributes:
            self.hrefs.append(attributes["href"])
        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self.headings.append(int(tag[1]))
            if tag == "h1":
                self.has_h1 = True
        if tag == "img" and "alt" not in attributes:
            self.images_without_alt.append(attributes.get("src", "(no src)"))
        if tag == "main":
            self.has_main = True
        if tag not in self.void:
            self._stack.append(tag)

    def handle_endtag(self, tag):
        if tag in self.void:
            return
        if not self._stack:
            self.unclosed.append(f"stray </{tag}>")
            return
        if self._stack[-1] != tag:
            self.unclosed.append(f"expected </{self._stack[-1]}> but found </{tag}>")
            # Recover so one mistake does not cascade into noise.
            if tag in self._stack:
                while self._stack and self._stack.pop() != tag:
                    pass
            return
        self._stack.pop()


def main() -> int:
    problems: list[str] = []
    all_targets: set[str] = set()

    for page in PAGES:
        text = page.read_text(encoding="utf-8")
        parser = Structure()
        parser.feed(text)

        if not parser.has_lang:
            problems.append(f"{page.name}: <html> has no lang attribute")
        if not parser.has_title:
            problems.append(f"{page.name}: no <title>")
        if not parser.has_h1:
            problems.append(f"{page.name}: no <h1>")
        if not parser.has_main:
            problems.append(f"{page.name}: no <main> landmark")
        if parser.headings.count(1) != 1:
            problems.append(f"{page.name}: expected exactly one <h1>, found {parser.headings.count(1)}")
        for index in range(1, len(parser.headings)):
            if parser.headings[index] - parser.headings[index - 1] > 1:
                problems.append(f"{page.name}: heading level skips from h{parser.headings[index-1]} to h{parser.headings[index]}")
        duplicates = {value for value in parser.ids if parser.ids.count(value) > 1}
        if duplicates:
            problems.append(f"{page.name}: duplicate id(s) {sorted(duplicates)}")
        if parser.images_without_alt:
            problems.append(f"{page.name}: <img> without alt: {parser.images_without_alt}")
        if parser.unclosed:
            problems.append(f"{page.name}: {parser.unclosed[:3]}")
        if parser._stack:
            problems.append(f"{page.name}: unclosed tag(s) {parser._stack[:3]}")

        for href in parser.hrefs:
            if href.startswith(("http://", "https://", "mailto:", "tel:", "#", "data:")):
                continue
            target = href.split("#", 1)[0].split("?", 1)[0]
            if target:
                all_targets.add((page.name, target))
                if not (ROOT / target).exists():
                    problems.append(f"{page.name}: link to missing file {target}")

    # In-page anchors must resolve.
    for page in PAGES:
        text = page.read_text(encoding="utf-8")
        parser = Structure()
        parser.feed(text)
        for href in parser.hrefs:
            if href.startswith("#") and len(href) > 1 and href[1:] not in parser.ids:
                problems.append(f"{page.name}: anchor {href} has no matching id")

    print(f"pages checked: {len(PAGES)}")
    print(f"local links resolved: {len(all_targets)}")
    if problems:
        print(f"\n{len(problems)} problem(s):")
        for problem in problems:
            print(f"  - {problem}")
        return 1
    print("\nOK: structure, links, anchors, headings, ids and images all check out.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
