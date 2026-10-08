/**
 * Append-only dry-run ledger. Never writes secret values.
 * charged is forced false until the operator enables live mode.
 */
const fs = require('fs');
const path = require('path');

const SECRET = /sk_(live|test)_|pk_(live|test)_|whsec_|BEGIN PRIVATE KEY/;

function redact(value) {
  const text = JSON.stringify(value == null ? {} : value);
  if (SECRET.test(text)) return { redacted: true, reason: 'secret_pattern' };
  return value;
}

function append(event, payload) {
  const body = redact(payload || {});
  const row = Object.assign({ event, ts: new Date().toISOString() }, body, { charged: false });
  const line = JSON.stringify(row);
  console.log(line);
  const dir = process.env.APD_LEDGER_DIR;
  if (dir) {
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, 'worker.jsonl'), line + '\n');
  }
  return row;
}

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((line) => {
    try { return JSON.parse(line); } catch (err) { return { event: 'parse_error', charged: false }; }
  });
}

function summarizeDir(dir) {
  const root = dir || process.env.APD_LEDGER_DIR;
  if (!root || !fs.existsSync(root)) {
    return { files: 0, rows: 0, queued: 0, refused: 0, charged: 0, live_charges: false };
  }
  const files = fs.readdirSync(root).filter((name) => name.endsWith('.jsonl'));
  const rows = files.flatMap((name) => readJsonl(path.join(root, name)));
  return {
    dir: root,
    files: files.length,
    rows: rows.length,
    queued: rows.filter((row) => row.ok === true || row.status === 'queued' || row.event === 'dry_run_session').length,
    refused: rows.filter((row) => row.status === 'refused' || row.ok === false).length,
    charged: 0,
    live_charges: false,
  };
}

module.exports = { append, summarizeDir, readJsonl };
