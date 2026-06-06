# OpenShift Service Mesh Multi-Cluster

Presentation material for talks about OpenShift Service Mesh in multi-cluster environments.

**Author:** Rafael Zago · Senior Software Automation Engineer · Red Hat

## What's inside

- Bilingual slides (PT-BR + EN) about OSSM multi-cluster setup and architecture
- Terminal-styled presentation with Catppuccin Macchiato theme
- Complete Claude Code agent configuration for maintaining the project

## Run locally

```bash
git clone git@github.com:rafaelvzago/ossm-multi-cluster.git
cd ossm-multi-cluster
python3 -m http.server 8080
# open http://localhost:8080
```

## Repository structure

```
ossm-multi-cluster/
├── CLAUDE.md                       # project conventions (auto-read by agent)
├── AGENTS.md                       # agent rules and pre-commit checks
├── CONTRIBUTING.md                 # how to contribute (humans + agents)
├── README.md                       # this file
├── index.html                      # landing page with language selector
├── ossm-multi-cluster.html         # slides PT-BR (10 slides)
├── ossm-multi-cluster-en.html      # slides EN (10 slides)
├── docs/
│   ├── architecture.md             # technical decisions
│   └── PRD.md                      # product requirements document
├── .claude/
│   ├── settings.json               # permissions and hooks
│   ├── agents/
│   │   ├── accentuation-fixer.md   # fixes PT-BR accents
│   │   ├── committer.md            # conventional commits
│   │   ├── prd-updater.md          # syncs PRD with project
│   │   ├── readme-updater.md       # syncs README structure
│   │   ├── slide-editor.md         # adds/removes slides
│   │   └── translator.md          # syncs PT-BR and EN
│   ├── commands/
│   │   ├── commit.md               # /commit command
│   │   ├── fix-accentuation.md     # /fix-accentuation command
│   │   ├── review-slides.md        # /review-slides command
│   │   ├── update-prd.md           # /update-prd command
│   │   └── update-readme.md        # /update-readme command
│   └── skills/
│       ├── commit/SKILL.md         # conventional commit workflow
│       ├── fix-accentuation/SKILL.md # PT-BR accent correction
│       ├── translate/SKILL.md      # PT-BR ↔ EN translation
│       ├── update-prd/SKILL.md     # PRD sync workflow
│       ├── update-readme/SKILL.md  # README structure sync
│       └── update-slides/SKILL.md  # slide management
└── LICENSE                         # Apache 2.0
```

## License

Apache 2.0
