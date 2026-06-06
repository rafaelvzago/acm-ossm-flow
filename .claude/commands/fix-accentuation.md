# /fix-accentuation

Corrige acentuação PT-BR nos slides. Busca palavras sem acento no texto visível e aplica as correções.

## Workflow

1. Buscar palavras sem acento no arquivo PT-BR:
   ```
   rg -in '\b(codigo|codigos|voce|nao|sessao|sessoes|secao|secoes|verificacao|verificacoes|tambem|alem|ate|pagina|paginas|unico|unica|valido|valida|obrigatorio|obrigatoria|automatico|automatica|modulo|modulos|proximo|proxima|inicio|indice|indices|possivel|possiveis|necessario|necessaria|basico|basica|metodo|metodos|titulo|titulos|topico|topicos|especifico|especifica|estrategia|estrategias|pratica|praticas|tecnica|tecnicas|logica|logicas|analise|analises|arvore|arvores|numero|numeros|conteudo|conteudos|revisao|revisoes|critico|critica|diagnostico|diagnosticos|agentico|agentica|seguranca|producao|informacao|informacoes|aplicacao|aplicacoes|integracao|integracoes|solucao|solucoes|funcao|funcoes|execucao|configuracao|configuracoes|operacao|operacoes|referencia|referencias|experiencia|experiencias|consequencia|consequencias|apresentacao|eficiencia|frequencia|frequencias|instancia|instancias|dependencia|dependencias)\b' ossm-multi-cluster.html
   ```

2. Para cada ocorrência, verificar que está em texto visível (não em `<script>`, `<style>`, atributos ou `<code>` com comandos)

3. Aplicar correções com `Edit` — nunca `replace_all`

4. Verificar integridade do JavaScript:
   ```
   grep -c 'preventDefault' ossm-multi-cluster.html
   ```
   Deve ser exatamente 7.

5. Reportar o que foi corrigido.

## Usage
```
/fix-accentuation
```
