# Temas y layouts

La configuracion de temas esta basada en JSON y se carga en runtime.

## Archivos de tema

- `public/layouts/layoutsConfig.json` - catalogo principal
- `public/layouts/layoutsFallbackConfig.json` - catalogo fallback
- `public/layouts/templates/*.json` - templates tokenizados
- `gitpagedocs/layouts/*` - equivalentes usados por la documentacion versionada

## Estructura de templates

Cada template normalmente define:

- Metadatos: `id`, `name`, `author`, `version`
- Relacion dark/light
- Tokens visuales: colores, espaciado, bordes, tipografia
- Tokens de componentes: boton, card, input, header/surface
- Flags opcionales de animacion

## Comportamiento en runtime

- Tema seleccionado por usuario se carga del catalogo
- Cambio light/dark resuelve pares cuando existen
- Tokens se transforman al tema de styled-components
- Preferencias se guardan entre sesiones

## Flujo recomendado

1. Duplicar un template existente de `public/layouts/templates/`
2. Ajustar valores manteniendo las mismas claves
3. Registrar el nuevo template en `layoutsConfig.json`
4. Validar contraste y legibilidad en paginas principales
