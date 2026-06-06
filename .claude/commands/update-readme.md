# /update-readme

Update the README.md repository structure tree to match the current
filesystem. Preserves existing inline descriptions and generates new
ones for added files by reading their content or frontmatter.

## Workflow

1. Scan the filesystem and compare against the current README tree
2. Identify added, removed, or renamed files
3. Preserve existing `# descriptions` for unchanged entries
4. Generate short descriptions for new entries
5. Rebuild and replace the tree block in README.md

## Usage

```
/update-readme
```
