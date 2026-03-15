# Funcion Recovery

El modo recovery restaura enlaces y payloads generados antes.

## Entradas soportadas

- payloads con `#d=` y `?d=`
- payloads legacy `#data=` y `?data=`
- marcadores comprimidos con prefijo de tipo

## Que hace recovery

- Hace parse del marcador y detecta tipo
- Descomprime payload string o binario
- Reconstruye estado de contenido renderizable
- Permite descargar o abrir directo en visor correcto

## Casos comunes

- Corregir enlaces copiados con error
- Migrar enlaces antiguos a alias nuevos
- Reabrir payloads en paginas de render especificas
