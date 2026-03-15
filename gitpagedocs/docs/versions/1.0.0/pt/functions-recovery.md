# Funcao Recovery

O modo recovery restaura links e payloads gerados anteriormente.

## Entradas suportadas

- payloads com `#d=` e `?d=`
- payloads legados `#data=` e `?data=`
- marcadores comprimidos com prefixo de tipo

## O que o recovery faz

- Faz parse do marcador e detecta tipo
- Descomprime payload string ou binario
- Reconstrui estado de conteudo renderizavel
- Permite download ou abertura direta no visualizador correto

## Casos comuns

- Corrigir links copiados com erro
- Migrar links antigos para aliases novos
- Reabrir payloads em paginas de render especificas
