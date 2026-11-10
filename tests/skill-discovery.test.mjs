import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const names = ["asd-ste100-adopt", "asd-ste100-author", "asd-ste100-review", "asd-ste100-terminology"];
const roots = [".agents/skills", ".claude/skills", ".cursor/skills"];

test("each skill has one canonical source", () => {
  for (const name of names) {
    const main = ".github/skills/" + name + "/SKILL.md";
    assert.ok(existsSync(main), main);
    const text = readFileSync(main, "utf8");
    assert.match(text, new RegExp("^---\\nname: " + name + "\\n"));
    assert.ok(text.length > 200, main);
  }
});

test("all discovery pointers link to canonical skills", () => {
  for (const name of names) {
    for (const root of roots) {
      const path = root + "/" + name + "/SKILL.md";
      assert.ok(existsSync(path), path);
      const text = readFileSync(path, "utf8");
      assert.match(text, new RegExp("^---\\nname: " + name + "\\n"));
      assert.ok(text.includes("../../../.github/skills/" + name + "/SKILL.md"), path);
    }
  }
});

test("agent entry points and shared rules exist", () => {
  for(const path of ["AGENTS.md", "CLAUDE.md", ".github/copilot-instructions.md"]) {
    assert.ok(existsSync(path), path);
  }
  assert.ok(readFileSync("CLAUDE.md", "utf8").includes("AGENTS.md"));
  assert.ok(readFileSync(".github/copilot-instructions.md", "utf8").includes("AGENTS.md"));
});
