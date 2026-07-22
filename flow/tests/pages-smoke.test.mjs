import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "out");

test("Pages export includes home, painel, and CNAME", () => {
  assert.ok(existsSync(join(root, "index.html")), "out/index.html");
  assert.ok(existsSync(join(root, "painel", "index.html")), "out/painel/index.html");
  assert.ok(existsSync(join(root, "CNAME")), "out/CNAME");
  assert.match(readFileSync(join(root, "CNAME"), "utf8"), /ossm\.rafaelvzago\.com/);
  assert.match(
    readFileSync(join(root, "painel", "index.html"), "utf8"),
    /Arquitetura resiliente/,
  );
});
