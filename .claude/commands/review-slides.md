# /review-slides

Review the presentation slides for consistency and correctness.

## Workflow

1. Count sections in both PT-BR and EN files:
   ```
   grep -c '<section class="slide"' ossm-multi-cluster.html
   grep -c '<section class="slide"' ossm-multi-cluster-en.html
   ```
   Both must be equal.

2. Verify sections are balanced (open == close):
   ```
   grep -c '</section>' ossm-multi-cluster.html
   grep -c '</section>' ossm-multi-cluster-en.html
   ```

3. Verify `preventDefault` is intact (exactly 7 occurrences per file):
   ```
   grep -c 'preventDefault' ossm-multi-cluster.html
   grep -c 'preventDefault' ossm-multi-cluster-en.html
   ```

4. Check for unaccented Portuguese words in the PT-BR file:
   ```
   rg '\b(codigo|voce|nao|sessao|verificacao)\b' ossm-multi-cluster.html
   ```

5. Verify agenda goTo() indices match actual slide positions:
   - List all `<section class="slide"` with line numbers
   - Compare against goTo() values in the agenda

6. Report findings.

## Usage
```
/review-slides
```
