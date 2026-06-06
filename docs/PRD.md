# PRD: OpenShift Service Mesh Multi-Cluster — Presentation

## Overview

Self-contained HTML slide deck used by Rafael Zago (Senior Software Automation Engineer, Red Hat) in talks about OpenShift Service Mesh in multi-cluster environments. The presentation covers OSSM architecture, configuration, and best practices for multi-cluster setups.

**License:** Apache 2.0

## Problem

Engineers working with OpenShift Service Mesh need practical guidance on setting up and managing multi-cluster service mesh deployments. Existing documentation is scattered across multiple sources and lacks a concise, presentable format.

## Goals

1. Provide a ready-to-present slide deck covering OSSM multi-cluster setup and architecture
2. Support PT-BR and EN audiences with synchronized content
3. Work offline, without build tools, and load instantly from GitHub Pages
4. Serve as a living reference that can be updated as OSSM evolves

## Non-goals

- Interactive demos or live coding environments
- Mobile-optimized presentation (functional, but optimized for 16:9 projector/screen)
- Framework-based slide system (Reveal.js, Slidev, etc.)

## Target audience

- OpenShift/Kubernetes engineers working with service mesh
- Platform engineers evaluating multi-cluster networking solutions
- Conference and meetup attendees (PT-BR and EN)

## Technical decisions

| Decision | Rationale |
|----------|-----------|
| Pure HTML, no framework | Zero dependencies, instant load, works offline, no build step |
| CSS embedded in each file | Each HTML file is fully self-contained |
| Catppuccin Macchiato palette | Terminal-native aesthetic via 26 CSS variables (`--ctp-*`) |
| JetBrains Mono via Google Fonts | Monospace font reinforcing terminal look, with `monospace` fallback |
| Two separate HTML files | PT-BR and EN are independent — no i18n runtime, works offline |

## Content structure (10 slides per language)

### Slide 0 — Language Selector
### Slide 1 — Title
### Slide 2 — Agenda
### Slide 3 — Part 1 Divider: Fundamentals
### Slide 4 — What is Service Mesh
### Slide 5 — Multi-Cluster Architecture
### Slide 6 — Part 2 Divider: Configuration
### Slide 7 — Configuration and Setup
### Slide 8 — Q&A / Thank You
### Slide 9 — References

## Invariants

These must hold true after every edit:

1. **Balanced sections**: `<section class="slide">` count == `</section>` count in both files
2. **Synced slide count**: PT-BR and EN have the same number of slides
3. **preventDefault intact**: exactly 7 occurrences per slide file (JavaScript navigation)
4. **Correct PT-BR accents**: no unaccented words like `codigo`, `voce`, `nao`, etc.
5. **Agenda goTo() indices**: match actual slide positions after any reorder
6. **Protected files**: LICENSE must never be modified (enforced by hooks + permissions)

## Skills and commands

| Name | Type | Purpose |
|------|------|---------|
| `commit` | Skill | Conventional commit with pre-commit checks |
| `fix-accentuation` | Skill | Correct PT-BR accentuation in slides |
| `translate` | Skill | Sync visible text between PT-BR and EN |
| `update-readme` | Skill | Sync README structure tree with filesystem |
| `update-slides` | Skill | Add, remove, or move slides with goTo() recalculation |
| `update-prd` | Skill | Sync PRD with current project state |
| `/commit` | Command | Create conventional commits |
| `/fix-accentuation` | Command | Fix PT-BR accents in slides |
| `/review-slides` | Command | Verify all invariants |
| `/update-readme` | Command | Sync README structure |
| `/update-prd` | Command | Sync PRD |

## Milestones

- [x] M0: Initial slide deck scaffold (10 skeleton slides PT-BR + EN)
- [x] M1: Landing page with language selector
- [x] M2: Claude Code integration (skills, commands, agents, hooks)
- [ ] M3: Full slide content for OSSM multi-cluster
- [ ] M4: GitHub Pages deployment
- [ ] M5: Speaker notes or companion blog post
