// Membuat ulang file CSV di sheet-template/ dari data/demo-content.js.
// Jalankan: node scripts/build-sheet-template.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(rootDir, "data", "demo-content.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(src, sandbox);
const content = sandbox.window.DEMO_CONTENT;

const outDir = path.join(rootDir, "sheet-template");
fs.mkdirSync(outDir, { recursive: true });

function cell(v) {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

for (const [tab, rows] of Object.entries(content)) {
  const cols = [];
  rows.forEach((r) => Object.keys(r).forEach((k) => { if (!cols.includes(k)) cols.push(k); }));
  const lines = [cols.join(",")].concat(rows.map((r) => cols.map((c) => cell(r[c])).join(",")));
  fs.writeFileSync(path.join(outDir, tab + ".csv"), lines.join("\n") + "\n");
  console.log("sheet-template/" + tab + ".csv", rows.length, "baris");
}
