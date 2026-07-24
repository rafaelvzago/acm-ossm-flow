---
name: commit
description: >
  Create a conventional commit for staged or unstaged changes.
  Analyzes the diff, categorizes by type and scope, runs AGENTS.md
  mandatory checks, drafts the message, and commits after user confirmation.
  Triggers when the user says "commit", "conventional commit",
  "save changes", "commitar", or "criar commit".
---

# Conventional Commit Skill

## Workflow

1. **Inspect the working tree** — run all four in parallel:
   ```
   git status
   git diff --staged
   git diff
   git log --oneline -5
   ```
   Summarize: which files are modified, untracked, or already staged.

2. **Filter protected files.** If `LICENSE` appears in the
   changed files, exclude it from all subsequent steps and warn:
   > "LICENSE is protected and will not be committed."

3. **Run AGENTS.md mandatory pre-commit checks.** All must pass before
   committing. If any check fails, fix the issue first and re-run.

   a. Balanced sections in both slide files:
   ```
   grep -c '<section class="slide"' ossm-multi-cluster.html
   grep -c '</section>' ossm-multi-cluster.html
   grep -c '<section class="slide"' ossm-multi-cluster-en.html
   grep -c '</section>' ossm-multi-cluster-en.html
   ```
   All 4 values must be equal.

   b. `preventDefault` intact (exactly 7 per file):
   ```
   grep -c 'preventDefault' ossm-multi-cluster.html
   grep -c 'preventDefault' ossm-multi-cluster-en.html
   ```

   c. No unaccented PT-BR words:
   ```
   rg '\b(codigo|voce|nao|sessao|verificacao|implementacao|automacao|seguranca)\b' ossm-multi-cluster.html
   ```
   Must return zero results.

   d. Both slide files have the same number of slides.

   Skip checks a-d if no slide files were modified.

4. **Categorize changes** by commit type:

   | Type       | When to use                                              |
   |------------|----------------------------------------------------------|
   | `feat`     | New slide, new page, new major content                   |
   | `fix`      | Broken navigation, wrong goTo indices, typos that change meaning |
   | `docs`     | README.md, CONTRIBUTING.md, AGENTS.md, CLAUDE.md         |
   | `style`    | CSS-only changes (colors, spacing, fonts, visual tweaks) |
   | `refactor` | Restructure HTML/JS without changing behavior            |
   | `chore`    | Skills, commands, settings, config, tooling              |

5. **Determine scope** from the files changed:

   | Scope      | Files                                                     |
   |------------|-----------------------------------------------------------|
   | `slides`   | ossm-multi-cluster.html, ossm-multi-cluster-en.html       |
   | `landing`  | index.html                                                |
   | `docs`     | README.md, CONTRIBUTING.md, AGENTS.md, CLAUDE.md          |
   | `skills`   | .claude/skills/**                                         |
   | `commands` | .claude/commands/**                                       |
   | `config`   | .claude/settings.json, .claude/settings.local.json        |

   If changes span multiple scopes, either omit the scope or ask the user.

6. **Draft the commit message** using this format:
   ```
   type(scope): description

   Optional body explaining why, not what.

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

   First-line rules:
   - Imperative mood ("add", not "added" or "adds")
   - Lowercase after the colon
   - No period at the end
   - Under 72 characters total

7. **Stage and commit.** Stage files individually by name. Create the commit using a HEREDOC.

8. **Post-commit verification:** `git log --oneline -1` and `git status`.

## Rules

- NEVER stage `LICENSE`
- NEVER run `git push` — even if the user asks (per AGENTS.md)
- NEVER amend a previous commit unless the user explicitly says "amend"
- NEVER use `--no-verify` or skip hooks
- NEVER use `git add .` or `git add -A` — always stage files by name
- Always use imperative mood in the description
- Keep the subject line under 72 characters
- Always include the `Co-Authored-By: Claude <noreply@anthropic.com>` trailer
