#!/usr/bin/env python3
"""Single source of truth for the public contact address.

The site is hand-edited static HTML with the footer and nav duplicated across every
page, so the contact address used to drift (a personal Gmail address was published
across 16 files). This script makes one value canonical and rewrites every
occurrence, so changing the contact address is a one-line edit plus a run.

    python3 tools/set-contact-email.py --set hello@aipharmadevelopments.com
    python3 tools/set-contact-email.py --check

--check exits non-zero if any page publishes a different address, which is what
tools/check-site.py calls in CI.
"""
import argparse
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

# The canonical public contact address. Change here, then run --set.
CANONICAL = "hello@aipharmadevelopments.com"

# Personal addresses that must never be published on a public site again.
FORBIDDEN = ("troy.windsor1989@gmail.com",)

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")

# Placeholder addresses that are legitimately not ours: examples in form fields,
# docs, and test fixtures.
ALLOWED_OTHERS = {
    "you@company.com",
    "ops@example.com",
    "billing@client.com",
}


def site_files() -> list[pathlib.Path]:
    out: list[pathlib.Path] = []
    for pattern in ("*.html", "js/*.js", "css/*.css", "docs/*.md", "*.md", "*.xml", "*.txt"):
        out.extend(p for p in ROOT.glob(pattern) if p.is_file())
    return sorted(out)


def addresses(path: pathlib.Path) -> set[str]:
    found = set()
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        for m in EMAIL_RE.findall(line):
            low = m.lower()
            if low.endswith(".gserviceaccount.com"):
                continue  # service-account placeholders in docs
            if low in ALLOWED_OTHERS:
                continue
            found.add(low)
    return found


def rewrite(path: pathlib.Path, target: str) -> int:
    text = path.read_text(encoding="utf-8")
    count = sum(text.count(old) for old in FORBIDDEN)
    for old in FORBIDDEN:
        text = text.replace(old, target)
    if count:
        path.write_text(text, encoding="utf-8")
    return count


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--set", dest="target", help="rewrite every personal address to this one")
    ap.add_argument("--check", action="store_true", help="verify the canonical address is the only one published")
    args = ap.parse_args()

    files = site_files()

    if args.target:
        total = 0
        for path in files:
            n = rewrite(path, args.target)
            if n:
                print(f"  {path.relative_to(ROOT)}: {n} replacement(s)")
                total += n
        print(f"rewrote {total} occurrence(s) across {len(files)} file(s) -> {args.target}")
        if total == 0:
            print("nothing to rewrite (already clean)")
        # fall through to the check so a --set always ends with a verified state
        args.check = True

    if args.check:
        print(f"checking published contact address against {CANONICAL} ...")
        bad = []
        for path in files:
            for addr in addresses(path):
                if addr != CANONICAL:
                    bad.append((path.relative_to(ROOT), addr))
        if bad:
            print("FAIL: pages publish a non-canonical address:")
            for path, addr in bad:
                print(f"  {path}: {addr}")
            return 1
        print(f"OK: only {CANONICAL} is published")
        return 0

    return 0


if __name__ == "__main__":
    sys.exit(main())