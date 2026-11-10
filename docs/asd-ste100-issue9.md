# ASD-STE100 Issue 9 reference map

* Source: **ASD-STE100 Simplified Technical English, Issue 9, January 2025**.
* Owner of the standard: Aerospace, Security and Defence Industries Association of Europe (ASD).
* Source location: Keep an authorized PDF copy outside this public repository.
* This text is an original implementation guide. It is **not** a copy of the source rules or dictionary.
* Tool status: **Partial automated review**. Do not claim certification or complete compliance.

## Standard structure

Part 1 contains the writing rules. Part 2 contains the controlled dictionary.
Issue 9 has 53 writing rules in nine sections.
The dictionary has approved words, parts of speech, approved meanings, and alternative constructions.
Technical nouns and technical verbs can come from approved terminology in a subject field.

## Review coverage

| Section | Source rule | Tool action | Review limit |
| --- | --- | --- | --- |
| Words | 1.1–1.3 | Optional local word-list warnings | A word list does not check approved meaning or part of speech |
| Technical nouns and verbs | 1.5–1.13 | Use the local terminology registry during manual review | Tool cannot approve a domain-specific term |
| Verb forms | 3.1–3.5 | No automatic result | Manual review necessary |
| Active voice | 3.6 | Possible passive voice warning | A heuristic can have false results |
| Sentence length | 4.1, 5.1, 6.3 | Flag more than 20 words in procedures and 25 in descriptions | Punctuation and quoted text can change the correct count |
| Complete words | 4.2 | Flag common contractions | Not a complete grammatical review |
| Paragraphs | 6.6 | Flag possible paragraphs with more than six sentences | Markdown lists and layout need manual review |
| Punctuation | 8.1 | Flag semicolons in prose | Tool does not verify all punctuation |
| Latin abbreviations | General recommendation 6 | Flag selected abbreviations | Recommendations are not mandatory writing rules |
| Other rules | 1–9 | No automatic result | Manual review necessary |

## Review procedure

1. Use an authorized copy of Issue 9.
2. Read the section and rule that apply to the document.
3. Use the approved dictionary to verify the meaning and part of speech of each word.
4. Check that the subject field approves all technical nouns and technical verbs.
5. Run the automated checks to find possible problems.
6. Review each finding in its original context.
7. Correct the text without a change in technical meaning.
8. Record the source edition, reviewer, date, and review result.

## Legal and source limits

The ASD PDF has its own copyright and distribution terms.
Do not add the PDF, dictionary tables, or large extracts to this repository.
Do not publish a generated copy of the approved word list without permission.
A user can keep authorized source material in a private location and supply a local word list at review time.
A reviewer must still verify context, meanings, parts of speech, and all relevant rules.
