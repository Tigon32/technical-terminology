#!/usr/bin/env node
// Validate project concepts. This tool does not check ASD-STE100 compliance.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function validate(groups) {
  const errors = [];
  const entries = new Map();
  const names = new Map();

  for (const group of groups) {
    if (!/^[a-z][a-z0-9-]*$/.test(group?.namespace ?? "")) {
      errors.push("Invalid namespace");
      continue;
    }
    if (!/^\d+\.\d+\.\d+$/.test(group.version ?? "")) {
      errors.push("Invalid version in " + group.namespace);
    }
    if (!Array.isArray(group.concepts) || group.concepts.length === 0) {
      errors.push("Missing concepts in " + group.namespace);
      continue;
    }
    for (const concept of group.concepts) {
      const id = concept?.id;
      if (typeof id !== "string" || !id.startsWith(group.namespace + ":")) {
        errors.push("Invalid concept ID: " + String(id));
        continue;
      }
      if (entries.has(id)) errors.push("Duplicate concept ID: " + id);
      if (typeof concept.term !== "string" || concept.term.trim().length < 2) {
        errors.push("Missing term: " + id);
      }
      if (typeof concept.definition !== "string" || concept.definition.trim().length < 10) {
        errors.push("Missing definition: " + id);
      }
      if (!["technical-noun", "technical-verb"].includes(concept.kind)) {
        errors.push("Invalid concept kind: " + id);
      }
      entries.set(id, concept);
      for (const label of [concept.term, ...(concept.aliases ?? [])]) {
        if (typeof label !== "string" || !label.trim()) {
          errors.push("Empty label: " + id);
          continue;
        }
        const key = label.toLowerCase().trim();
        const owner = names.get(key);
        if (owner && owner !== id) errors.push("Ambiguous label: " + label);
        names.set(key, id);
      }
    }
  }

  for (const [id, concept] of entries) {
    const refs = [...(concept.related ?? []), ...(concept.broader ? [concept.broader] : [])];
    if (new Set(refs).size !== refs.length) errors.push("Repeated relation: " + id);
    for (const ref of refs) {
      if (ref === id) errors.push("Self relation: " + id);
      if (!entries.has(ref)) errors.push("Unknown reference: " + ref + " in " + id);
      if (id.startsWith("core:") && !ref.startsWith("core:")) {
        errors.push("Core cannot depend on a domain: " + id);
      }
    }
    const seen = new Set([id]);
    let parent = concept.broader;
    while (parent && entries.has(parent)) {
      if (seen.has(parent)) {
        errors.push("Parent cycle: " + id);
        break;
      }
      seen.add(parent);
      parent = entries.get(parent).broader;
    }
  }

  return errors;
}

export function load(files) {
  return files.map(file => JSON.parse(readFileSync(resolve(file), "utf8")));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("Usage: node scripts/validate.mjs concepts/core.json [domain.json ...]");
    process.exitCode = 2;
  } else {
    try {
      const groups = load(files);
      const errors = validate(groups);
      for (const error of errors) console.error(error);
      if (errors.length) process.exitCode = 1;
      else console.log("Validated " + groups.reduce((n, group) => n + group.concepts.length, 0) + " concepts.");
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
