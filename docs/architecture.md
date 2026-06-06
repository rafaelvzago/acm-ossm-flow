# Arquitetura

## Decisões técnicas

### HTML puro, sem framework
Os slides são arquivos HTML auto-contidos. Sem React, sem build step, sem npm install. Abre no navegador e funciona. Isso foi uma escolha deliberada: a apresentação é sobre simplicidade no fluxo de trabalho, então o formato precisa ser simples também.

### Catppuccin Macchiato
Paleta de cores com 26 cores definidas como CSS variables (`--ctp-*`). Todas as cores do tema vêm dessas variáveis. Para mudar o tema, basta trocar os valores no `:root`.

### JetBrains Mono
Fonte monospaced via Google Fonts com fallback para `monospace`. Reforça o visual de terminal.

### Navegação
- Setas do teclado (esquerda/direita, cima/baixo)
- Espaço para avançar
- Home/End para primeiro/último
- Clique na metade direita/esquerda da tela
- Botões ◀ ▶ no rodapé central
- Links na agenda e rodapé

### Dois idiomas
PT-BR e EN são arquivos separados. Não usamos i18n dinâmico porque cada arquivo precisa funcionar offline e sem JavaScript complexo. A landing page (index.html) linka para ambos.

### GitHub Pages
O repo pode ser servido via GitHub Pages.

## Estrutura de um slide

```html
<section class="slide" id="sN">
  <div class="terminal-bar">
    <div class="terminal-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
    </div>
    <span class="terminal-title">claude ~ /path</span>
  </div>
  <div class="slide-content">
    <div class="prompt">$ comando</div>
    <h1>Título</h1>
    <h2>Subtítulo</h2>
    <!-- conteúdo -->
  </div>
</section>
```

## JavaScript

O JS no final do arquivo faz:
1. Conta todas as `<section class="slide">` automaticamente
2. Mostra/esconde slides com a classe `.active`
3. Injeta footer (⌂ ◀ ▶ 📖) em cada slide (exceto os 3 primeiros)
4. Expõe `goTo()`, `navPrev()`, `navNext()` globalmente
5. Detecta `#start` no hash para pular o seletor de idioma

`preventDefault` aparece 7 vezes no JS e não deve ser alterado.
