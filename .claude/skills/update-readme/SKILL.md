---
name: update-readme
description: >
  Update the README.md repository structure tree to match the current
  filesystem. Preserves existing descriptions and generates new ones
  for added files. Triggers when the user says "update readme",
  "sync readme", "update docs", "atualizar readme", or "update structure".
---

# Update README Skill

## Workflow

1. **Scan the filesystem:**
   ```
   find . -not -path './.git/*' -not -name '.git' | sort
   ```

2. **Read the current README** and extract the tree block

3. **Compare tree vs filesystem** — identify added, removed, unchanged

4. **Preserve existing descriptions** for unchanged entries

5. **Generate descriptions for new entries**

6. **Rebuild the tree** following these rules:
   - Root: `ossm-multi-cluster/`
   - Use `├──` for all entries except the last, which uses `└──`
   - Align all `#` comments to the same column
   - Each description is a short phrase (under ~50 chars)

7. **Replace the tree in README**

## Exclusions

Never include: `.git/`, `.claude/settings.local.json`, `memory/`, `node_modules/`, `.claude/plans/`

## Rules

- NEVER modify content outside the `## Repository structure` code fence
- NEVER modify LICENSE
- Sort commands and skills alphabetically
