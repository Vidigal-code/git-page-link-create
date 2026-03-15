# Funcao Render

A camada de render abre links gerados no `/create` e decodifica payloads.

## Rotas principais

- `/r` e `/ra` para renderizacao generica compacta
- `/render` e `/render-all` como variantes completas
- `/render/image`, `/render/pdf`, `/render/video`, `/render/audio`, `/render/office` para visualizadores especificos

## Como funciona

1. Le payload da hash/query (`#d=` ou `?d=`)
2. Detecta marcador de tipo
3. Descomprime e decodifica conteudo
4. Envia para o visualizador correto
5. Exibe em modo padrao ou fullscreen

## Compatibilidade

- Mantem suporte para marcadores legados (`#data=` e `?data=`)
- Suporta modo compartilhado com `?z=1` e `?z=0`
- Funciona com recovery de deep links via `404`
