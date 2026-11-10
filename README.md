# ASD-STE100 technical writing toolkit

This repository provides **reusable ASD-STE100 writing guidance and review tools**.
Use the tools in any project or agent workflow.
The toolkit uses **ASD-STE100 Issue 9 (January 2025)** as its reference.

The repository includes:
- Original rule-reference notes for Issue 9.
- An offline tool that finds selected language problems in Markdown and text.
- Tests of the selected rules and their limits.
- Agent skills for authoring, reviewing, and managing technical terms.
- An optional shared technical-concept registry.

**Important:** The tools are not a full or official ASD-STE100 checker.
They do not certify compliance.
The protected Issue 9 PDF and dictionary are not published here.

## Start a review

Use Node.js 20 or later. No npm installation is necessary.

```sh
node scripts/ste-review.mjs --mode procedure examples/short-procedure.md
node scripts/ste-review.mjs --mode description README.md
node scripts/ste-review.mjs --json --mode description README.md
node --test tests/*.test.mjs
```

The CLI exits with code 1 for a detected error.
Warnings do not fail the command.
A tool finding can be a false positive.
Use the source standard to make the final decision.

### Select the text type

The default type is **description**.
Use `--mode procedure` for instructions.
In Markdown, use these optional markers to change the type within a file:

```text
<!-- ste:procedure -->
Remove the part.

<!-- ste:description -->
The part is on the support.
```

The tool ignores fenced code blocks, inline code, Markdown links, and headings.
It does not fully parse tables, quotations, or mixed layouts.

## Dictionary and project terms

Issue 9 includes an approved dictionary.
The dictionary also specifies the approved meanings and parts of speech.
The toolkit does not include that dictionary.

If you have an authorized local word list, you can supply it at review time:

```sh
node scripts/ste-review.mjs --lexicon /private/ste-word-list.json my-document.md
```

The local file uses this shape:

```json
{
  "approved": ["example_word"],
  "technicalTerms": ["example_term"]
}
```

The values above are **placeholders**, not approved ASD words.
The tool only gives word-level warnings from this file.
It cannot confirm the correct meaning or part of speech.
It cannot automatically approve a technical noun or verb.
Keep the local word list outside a public repository.

See [the Issue 9 source map](docs/asd-ste100-issue9.md) for the review scope.

## Reusable skills

The project provides three independent skill files:
- [ASD-STE100 author](.github/skills/asd-ste100-author/SKILL.md)
- [ASD-STE100 reviewer](.github/skills/asd-ste100-review/SKILL.md)
- [Technical terminology curator](.github/skills/asd-ste100-terminology/SKILL.md)

An agent can read the skill file before it writes or reviews a document.
These files do not install external software or grant permissions.
Keep the full PDF in an authorized private location.

## Shared technical terms

The optional `concepts/core.json` file contains original project-independent terms.
Use `node scripts/validate.mjs concepts/core.json` to check them.
Each consumer can maintain its own domain terms.
This registry is **not** a copy of the ASD-STE100 dictionary.

## Review result

Use these states:
- **Not reviewed:** No review took place.
- **Partial review:** Some automated checks ran.
- **Manual Issue 9 review:** A reviewer checked the applicable rules and dictionary against an authorized copy.

Do not report **ASD-STE100 compliant** unless the complete relevant review is documented.
Do not call a result an official ASD certification or endorsement.

## Copyright

ASD owns the copyright of the standard and its controlled dictionary.
This repository contains original implementation code, independent terms, and a short rule index.
It does not reproduce the source document or its dictionary.
Read the distribution and special-use rights in the official document before sharing it.
