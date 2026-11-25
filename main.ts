// long-roast-remake-entry: writes one satirical sentence to $MAKEFUN_OUTPUT_DIR/entry.txt
// (fallback /output). Gate per RULES.txt: UTF-8 text, 1-320 characters counted in
// code points, not only whitespace, exactly one sentence.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "They voted unanimously to regulate artificial intelligence, then asked the intern to print the bill, scan the printout, and email it back so they could finally turn it into a PDF.";

function gate(text: string): string | null {
  const chars = [...text].length;
  if (chars < 1 || chars > 320) return `length ${chars} outside 1-320`;
  if (!text.trim()) return "only whitespace";
  if (text !== text.trim()) return "leading/trailing whitespace";
  if ((text.match(/\./g) || []).length !== 1 || !text.endsWith(".")) {
    return "not exactly one sentence";
  }
  if (Buffer.byteLength(text, "utf8") !== chars) {
    // Non-ASCII present: re-encode to confirm valid UTF-8 round-trip.
    if (Buffer.from(text, "utf8").toString("utf8") !== text) return "not valid UTF-8";
  }
  return null;
}

const problem = gate(ENTRY);
if (problem) {
  console.error(`gate failed: ${problem}`);
  process.exit(1);
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
console.log(`wrote entry.txt (${[...ENTRY].length} characters)`);
