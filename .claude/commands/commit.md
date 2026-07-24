# /commit

Create a conventional commit for the current changes. Analyzes the working
tree, runs AGENTS.md mandatory checks, categorizes changes by type and scope,
drafts a message following the conventional commits spec, and commits after
user confirmation.

## Workflow

1. Run `git status` and `git diff` to understand all changes
2. Run mandatory pre-commit checks (balanced sections, preventDefault, accentuation)
3. Categorize by type (`feat`, `fix`, `docs`, `style`, `chore`, etc.) and scope
   (`slides`, `landing`, `docs`, `skills`, `commands`, `config`)
4. Draft a `type(scope): description` message and show preview
5. After confirmation, stage files individually and commit with
   `Co-Authored-By` trailer

## Usage

```
/commit
```
