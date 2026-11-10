---
name: asd-ste100-adopt
description: Add reusable ASD-STE100 Issue 9 writing and review checks to a project without copying the protected dictionary.
---

# Use ASD-STE100 in a project

Use this skill when a project wants controlled technical English.
This skill works with any project or programming language.
Read [the Issue 9 reference map](../../../docs/asd-ste100-issue9.md) first.

## Before you change a project

1. Read the project's current writing rules.
2. Identify the documents, issue templates, pull requests, and agent instructions that need the rules.
3. Find the project's approved technical terms.
4. Get approval to add the review tool and its required files.
5. Record the version or commit SHA of this toolkit.
6. Use an authorized copy of ASD-STE100 Issue 9 for dictionary and full rule checks.

## Set up the review

1. Keep the shared checker in this repository.
2. Select a fixed toolkit revision. Do not use an unpinned remote script.
3. Run the checker with Node.js 20 or later.
4. Select the correct text type: `procedure` or `description`.
5. Use a project-specific technical glossary when the subject field needs it.
6. Keep authorized dictionary content outside a public repository.
7. Use the project's CI permissions. Do not give extra token access to the checker.
8. First run the checks in report-only mode.
9. Review the findings. Correct incorrect tool results or add clear exceptions.
10. Enable a CI failure rule only for checks that the project has accepted.

## Commands

Use these commands from a checked-out copy of this toolkit:

```sh
node scripts/ste-review.mjs --mode procedure path/to/procedure.md
node scripts/ste-review.mjs --mode description path/to/description.md
node --test tests/*.test.mjs
```

A result with no automated findings is **not** proof of ASD-STE100 compliance.
A project must also review approved meanings, parts of speech, and technical terms.

## Update project instructions

Add these requirements to the project:

- Use ASD-STE100 Issue 9 for new technical prose.
- Use approved technical terms from the project's own glossary.
- Keep API names, commands, identifiers, code blocks, and test output unchanged.
- Run applicable automated checks before the PR review.
- Record the toolkit version, source revision, and review results.
- Report the areas that need a manual review.
- Do not claim certification without complete review evidence.

## Evidence

Record the source edition and toolkit revision.
Record the files, text types, commands, and findings.
State which findings a person reviewed.
State which ASD-STE100 rules the tool did not check.

Use one of these states: **Not reviewed**, **Partial review**, or **Manual Issue 9 review**.
Do not say that a toolkit installation gives complete compliance.
