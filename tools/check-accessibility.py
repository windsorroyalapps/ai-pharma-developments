#!/usr/bin/env python3
"""Run axe-core over the site's HTML, including the new careflow page.

axe resolves against jsdom, so colour contrast is reported as "incomplete" rather than
checked, and focus order and screen-reader behaviour are not assessed at all. This is a
floor, not a WCAG conformance result, and the output says so.

    python3 tools/check-accessibility.py
"""
import json
import pathlib
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
PLATFORM = pathlib.Path("/home/dhh/Work/gp-practice-platform")
PAGES = ["index.html", "trust.html", "careflow.html", "assistant.html"]

RUNNER = r"""
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire(path.join(process.env.PLATFORM_ROOT, "package.json"));
const { JSDOM } = require("jsdom");

const root = process.argv[2];
const pages = JSON.parse(process.argv[3]);
const axeSource = fs.readFileSync(path.join(process.env.PLATFORM_ROOT, "node_modules/axe-core/axe.js"), "utf8");

const out = [];

async function auditOne(name) {
  const html = fs.readFileSync(path.join(root, name), "utf8");
  const dom = new JSDOM(html, { url: "https://aipharmadevelopments.com/" + name, runScripts: "outside-only", pretendToBeVisual: true });
  const { window } = dom;
  if (typeof window.HTMLCanvasElement !== "undefined") {
    window.HTMLCanvasElement.prototype.getContext = () => ({
      measureText: () => ({ width: 0 }), fillRect() {}, clearRect() {},
      getImageData: () => ({ data: new Uint8ClampedArray(4) }), putImageData() {},
      createImageData: () => [], setTransform() {}, drawImage() {}, save() {},
      fillText() {}, restore() {}, beginPath() {}, moveTo() {}, lineTo() {},
      closePath() {}, stroke() {}, translate() {}, scale() {}, rotate() {}, arc() {}, fill() {},
    });
  }
  const native = window.getComputedStyle.bind(window);
  window.getComputedStyle = (element) => native(element);
  const result = await window.eval(`
    (async () => {
      const factory = new Function("module", "exports", ${JSON.stringify(axeSource)} + "; return module.exports;");
      const module = { exports: {} };
      factory(module, module.exports);
      return await module.exports.run(document, {
        runOnly: { type: "tag", values: ["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa","best-practice"] },
        rules: { "color-contrast": { enabled: false } },
        resultTypes: ["violations", "incomplete", "passes"],
      });
    })()
  `);
  return {
    page: name,
    passes: result.passes.length,
    violations: result.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")) })),
    incomplete: [...new Set(result.incomplete.map((i) => i.id))],
  };
}

for (const name of pages) {
  out.push(await auditOne(name));
}
process.stdout.write(JSON.stringify(out));
"""


def main() -> int:
    if not (PLATFORM / "node_modules" / "axe-core").exists():
        print(f"axe-core not found under {PLATFORM}. Nothing audited.")
        return 2
    with tempfile.NamedTemporaryFile("w", suffix=".mjs", delete=False) as handle:
        handle.write(RUNNER)
        runner = handle.name
    try:
        completed = subprocess.run(
            ["node", runner, str(ROOT), json.dumps(PAGES)],
            capture_output=True,
            text=True,
            env={**dict(__import__("os").environ), "PLATFORM_ROOT": str(PLATFORM)},
        )
    finally:
        pathlib.Path(runner).unlink(missing_ok=True)

    if completed.returncode != 0:
        print(completed.stdout)
        print(completed.stderr, file=sys.stderr)
        return 2

    report = json.loads(completed.stdout.strip().splitlines()[-1])
    serious = 0
    for entry in report:
        print(f"\n{entry['page']}  ({entry['passes']} passes)")
        if entry["incomplete"]:
            print(f"  incomplete in jsdom: {', '.join(entry['incomplete'])}")
        if not entry["violations"]:
            print("  violations: 0")
        for violation in entry["violations"]:
            serious += 1 if violation["impact"] in {"serious", "critical"} else 0
            print(f"  [{violation['impact'] or 'unknown'}] {violation['id']}: {violation['help']} ({violation['nodes']} node(s))")
            for target in violation["targets"]:
                print(f"      {target}")
    print()
    if serious:
        print(f"FAILED: {serious} serious or critical violation(s).")
        return 1
    print("OK: no serious or critical automated violations.")
    print("Not a conformance result: contrast, focus order, screen-reader behaviour and reflow are not assessable here.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
