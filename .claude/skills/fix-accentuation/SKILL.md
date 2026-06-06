---
name: fix-accentuation
description: >
  Corrige acentuação PT-BR no arquivo de slides sempre que um slide for
  modificado ou adicionado. Triggers when the user says "fix accentuation",
  "corrigir acentuação", "acentuação", or "accentuation".
---

# Fix PT-BR Accentuation Skill

Corrige palavras sem acento no arquivo `ossm-multi-cluster.html`.
Atua **apenas no texto visível** (conteúdo entre tags HTML), nunca em JavaScript, CSS, atributos HTML, URLs ou nomes de arquivo.

## Workflow

1. Buscar palavras sem acento:
   ```
   rg -in '\b(codigo|codigos|voce|nao|sessao|sessoes|verificacao|verificacoes|tambem|alem|ate|pagina|paginas|unico|unica|valido|valida|obrigatorio|obrigatoria|automatico|automatica|modulo|modulos|proximo|proxima|inicio|indice|indices|possivel|possiveis|necessario|necessaria|basico|basica|metodo|metodos|titulo|titulos|topico|topicos|especifico|especifica|estrategia|estrategias|pratica|praticas|tecnica|tecnicas|logica|logicas|analise|analises|arvore|arvores|numero|numeros|conteudo|conteudos|revisao|revisoes|critico|critica|diagnostico|diagnosticos|agentico|agentica|seguranca|producao|informacao|informacoes|aplicacao|aplicacoes|integracao|integracoes|solucao|solucoes|funcao|funcoes|execucao|configuracao|configuracoes|operacao|operacoes|referencia|referencias|experiencia|experiencias|consequencia|consequencias|apresentacao|eficiencia|frequencia|frequencias|instancia|instancias|dependencia|dependencias)\b' ossm-multi-cluster.html
   ```

2. Para cada ocorrência, verificar que está em texto visível

3. Aplicar correções com `Edit` — nunca `replace_all`

4. Verificar que `preventDefault` continua intacto (exatamente 7 ocorrências):
   ```
   grep -c 'preventDefault' ossm-multi-cluster.html
   ```

5. Reportar as correções feitas

## Rules

- Atuar APENAS no arquivo PT-BR (`ossm-multi-cluster.html`)
- Nunca modificar conteúdo dentro de `<script>` ou `<style>`
- Nunca modificar atributos HTML (`class`, `id`, `onclick`, `href`, `style`)
- Nunca usar `replace_all`
- Sempre verificar que `preventDefault` continua com exatamente 7 ocorrências
