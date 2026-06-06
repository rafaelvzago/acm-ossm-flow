---
name: update-prd
description: >
  Update docs/PRD.md to reflect current project state. Syncs slide count,
  content structure, repository tree, skills/commands table, and invariants.
  Triggers when the user says "update PRD", "sync PRD", "update requirements",
  or after structural changes to slides, skills, or commands.
---

# Update PRD Skill

## Workflow

1. **Read the current PRD**

2. **Gather actual state:**
   ```
   grep -c '<section class="slide"' ossm-multi-cluster.html
   grep -c '<section class="slide"' ossm-multi-cluster-en.html
   grep -oP '(?<=<h1[^>]*>)[^<]+' ossm-multi-cluster.html
   ls .claude/skills/
   ls .claude/commands/
   ```

3. **Compare each auto-updatable section and identify drift**

4. **Report drift**

5. **Update only divergent sections**

6. **Verify**

## Rules

- NEVER modify Overview, Problem, Goals, Non-goals, Target audience, or Success criteria
- NEVER modify Technical decisions unless the user explicitly asks
- NEVER modify Milestones unless the user says a milestone is complete
- Only update sections where actual drift is detected
