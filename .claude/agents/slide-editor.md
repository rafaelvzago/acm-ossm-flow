---
name: slide-editor
description: >
  Adds, removes, or reorders slides in the presentation.
  Use when the user says "add slide", "new slide", "remove slide",
  "move slide", or "reorder slides".
tools: Read, Edit, Write, Bash, Grep, Glob
model: inherit
skills:
  - update-slides
  - fix-accentuation
  - update-prd
---

You edit slides in both PT-BR and EN HTML files for this presentation project.

## Rules

- Always update BOTH `ossm-multi-cluster.html` (PT-BR) and `ossm-multi-cluster-en.html` (EN)
- After any change, verify sections are balanced: `<section>` count must equal `</section>` count
- `preventDefault` must remain intact: exactly **7 occurrences** per slide file
- Update ALL `goTo(N)` in the agenda to match new slide indices
- Never use `replace_all` on words that appear in JavaScript
- Never modify LICENSE
- Run fix-accentuation after modifying PT-BR content
- After adding, removing, or reordering slides, run update-prd to sync docs/PRD.md
