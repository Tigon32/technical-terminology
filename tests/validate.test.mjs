import test from "node:test";
import assert from "node:assert/strict";
import { load, validate } from "../scripts/validate.mjs";

const source = load(["concepts/core.json"]);
const clone = () => structuredClone(source);

test("shared core passes the registry checks", () => {
  assert.deepEqual(validate(source), []);
});
test("repeated concept IDs fail", () => {
  const groups = clone();
  groups[0].concepts.push(structuredClone(groups[0].concepts[0]));
  assert.ok(validate(groups).some(error => error.includes("Duplicate concept ID")));
});
test("unknown concept references fail", () => {
  const groups = clone();
  groups[0].concepts[0].related = ["core:missing-concept"];
  assert.ok(validate(groups).some(error => error.includes("Unknown reference")));
});
test("ambiguous aliases fail", () => {
  const groups = clone();
  groups[0].concepts[1].aliases = [groups[0].concepts[0].term];
  assert.ok(validate(groups).some(error => error.includes("Ambiguous label")));
});
test("core concepts cannot depend on project concepts", () => {
  const groups = clone();
  groups.push({
    namespace: "example", version: "0.1.0", source: "test",
    concepts: [{id:"example:item",term:"domain item",definition:"An item that exists only in the test domain.",kind:"technical-noun"}]
  });
  groups[0].concepts[0].related = ["example:item"];
  assert.ok(validate(groups).some(error => error.includes("Core cannot depend")));
});
test("cycles in broader relations fail", () => {
  const groups = clone();
  const [a,b] = groups[0].concepts;
  a.broader = b.id;
  b.broader = a.id;
  assert.ok(validate(groups).some(error => error.includes("Parent cycle")));
});
test("domain concepts can depend on shared concepts", () => {
  const groups = clone();
  groups.push({
    namespace:"example",version:"0.1.0",source:"test",
    concepts:[{id:"example:item",term:"domain item",definition:"A test item with a shared parent.",kind:"technical-noun",broader:"core:interface"}]
  });
  assert.deepEqual(validate(groups), []);
});
