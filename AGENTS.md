# Agent instructions

This repository provides reusable ASD-STE100 Issue 9 review tools.
These instructions apply to all coding agents.
Use the same checks with Codex, Copilot CLI, Claude, Cursor, or another agent.

## Skill source

The canonical skills are in `.github/skills/`.
The directories `.agents/skills/`, `.claude/skills/`, and `.cursor/skills/` have discovery pointers.
All pointers lead to the same canonical instructions.
Do not change a pointer into a different policy.

| Work | Canonical skill |
| --- | --- |
| Add this toolkit to another project | [Adoption](.github/skills/asd-ste100-adopt/SKILL.md) |
| Write technical documentation | [Authoring](.github/skills/asd-ste100-author/SKILL.md) |
| Review technical prose | [Review](.github/skills/asd-ste100-review/SKILL.md) |
| Maintain domain terms | [Terminology](.github/skills/asd-ste100-terminology/SKILL.md) |

## Rules

1. Use the official Issue 9 rules as the reference.
2. Keep the official dictionary and copyrighted PDF outside this public repository.
3. Run the selected local tests with Node.js.
4. Record the source revision, review method, and review limits.
5. Do not claim full compliance from partial checks.
6. Keep the toolkit independent of every consumer project.
7. Do not add agent-service dependencies or remote execution to the checker.
8. Use a pull request for changes. Do not bypass failed CI.

The full review also needs an authorized dictionary and a person who can check technical meanings.
