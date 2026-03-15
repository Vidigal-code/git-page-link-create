# Funcion Render

La capa render abre enlaces generados en `/create` y decodifica payloads.

## Rutas principales

- `/r` y `/ra` para render generico compacto
- `/render` y `/render-all` como variantes completas
- `/render/image`, `/render/pdf`, `/render/video`, `/render/audio`, `/render/office` para visores especificos

## Como funciona

1. Lee payload desde hash/query (`#d=` o `?d=`)
2. Detecta marcador de tipo
3. Descomprime y decodifica contenido
4. Envia al visor correcto
5. Muestra en modo estandar o fullscreen

## Compatibilidad

- Mantiene soporte para marcadores legacy (`#data=` y `?data=`)
- Soporta modo compartido con `?z=1` y `?z=0`
- Funciona con recovery de deep links via `404`
