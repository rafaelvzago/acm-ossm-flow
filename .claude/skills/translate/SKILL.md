---
name: translate
description: >
  Use when PT-BR slides were updated and EN needs to be synced,
  or vice versa. Translates visible text only, preserving HTML structure.
  Triggers when the user says "translate", "sync EN", "sync PT",
  "update English version", or "atualizar versão em inglês".
---

# Translate Skill

## What to translate

- Titles (h1, h2, h3)
- Paragraphs and text content
- List items (li)
- Table cells (th, td)
- Blockquotes
- Terminal bar titles (e.g. `claude ~ /fundamentos` → `claude ~ /fundamentals`)
- Prompts (e.g. `$ oc get smcp -A` stays the same)

## What NOT to translate

- CSS (everything inside `<style>`)
- JavaScript (everything inside `<script>`)
- HTML attributes (class, id, onclick, style, href)
- URLs and links
- Project names (OSSM, Istio, Kiali, Sail Operator, etc.)
- Command names (`oc get`, `kubectl`, etc.)
- File names (CLAUDE.md, AGENTS.md, settings.json, SKILL.md)
- `preventDefault` — this is a JavaScript method, NOT a Portuguese word
- ASCII art (keep identical)
- Code inside `<code>` tags (unless it's natural language shown to the audience)

## Workflow

1. Identify which slides changed (diff the files or ask the user)
2. Find the corresponding slide in the other language file
3. Translate only the visible text content
4. Verify section count matches between both files
5. Verify `preventDefault` count is exactly 7 in both files

## Common PT-BR → EN translations

| PT-BR | EN |
|-------|-----|
| Fundamentos | Fundamentals |
| Configuração | Configuration |
| Malha de Serviço | Service Mesh |
| Multi-Cluster | Multi-Cluster |
| Arquitetura | Architecture |
| Perguntas | Questions |
| Referências | References |
| Obrigado | Thank You |
| Próximos Passos | Next Steps |
