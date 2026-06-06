# Contributing

## Para humanos

1. Fork o repositório
2. Crie uma branch: `git checkout -b minha-mudanca`
3. Faça suas alterações nos HTMLs
4. Verifique que as sections estão balanceadas:
   ```bash
   grep -c '<section class="slide"' ossm-multi-cluster.html
   grep -c '</section>' ossm-multi-cluster.html
   ```
5. Se alterou o PT-BR, atualize o EN também (e vice-versa)
6. Abra um PR com descrição do que mudou

## Para agentes

- Leia CLAUDE.md e AGENTS.md antes de começar
- Use as skills em `.claude/skills/` quando aplicável
- Sempre verifique sections balanceadas após edições
- Nunca modifique LICENSE
- Mantenha `preventDefault` intacto no JavaScript (7 ocorrências)

## Estrutura dos slides

Cada slide é uma `<section class="slide">` com:
- `.terminal-bar` (barra com bolinhas coloridas)
- `.slide-content` (conteúdo do slide)

A navegação é controlada pelo JavaScript no final do arquivo.
Os `goTo(N)` na agenda precisam ser recalculados quando slides são adicionados ou removidos.

## Licença

Apache 2.0. Veja LICENSE.
