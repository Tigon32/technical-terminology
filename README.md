# Technical terminology

This repository stores shared technical concepts.

Each concept has a stable ID, one preferred term, and one definition.
A concept can also have aliases and relations to other concepts.

Projects can keep domain-specific terms in separate files.
Use a versioned release of the shared concepts when you validate a domain extension.

## Files

- `concepts/core.json`: Shared engineering concepts.
- `schema.json`: Data format for concept files.
- `scripts/validate.mjs`: Term and relation checks.
- `tests/validate.test.mjs`: Positive and negative validation tests.

## Validate the registry

```sh
node scripts/validate.mjs concepts/core.json
node --test tests/*.test.mjs
```

To validate a domain extension, add its file to the validation command.
The domain file can be in a different repository.

## Rules for changes

1. Give each concept a stable ID and one preferred term.
2. Use one clear definition for each concept.
3. Do not change the meaning of an existing ID.
4. Add a new ID if the meaning changes.
5. Do not add an alias that can refer to two concepts.
6. Verify all concept relations before merge.
7. Keep shared definitions independent of any consumer project.
8. Record the source and version of each published registry.

## ASD-STE100

ASD-STE100 Issue 9 is a writing reference.
This repository does not reproduce the ASD-STE100 dictionary.
Project-authored definitions are not automatically approved dictionary words.
A full compliance claim needs a documented review of the applicable rules and dictionary.

**Writing review state:** STE-aligned draft. Full dictionary review not done.
