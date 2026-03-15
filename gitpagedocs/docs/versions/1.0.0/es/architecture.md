# Arquitectura

La aplicacion esta orientada a rutas y organizada en create, render, short URL y utilidades compartidas.

## Carpetas principales

- `src/pages` - rutas Next.js (`create`, `render`, `shorturl`, `chat-link`, alias)
- `src/shared/lib` - encoding, compresion, helpers media, short URL, i18n
- `src/shared/ui` - componentes reutilizables y tarjetas por feature
- `src/shared/styles` - tema styled-components y estilos de pagina
- `public/layouts` - templates y catalogo de temas
- `public/locales` - traducciones (`en`, `pt`, `es`)

## Grupos de rutas

- Creacion:
  - `/create`, `/create-links`, `/create-jobs`, `/create-portfolio`
- Renderizado:
  - `/render`, `/render-all`, `/r`, `/ra`
  - `/render/image`, `/render/pdf`, `/render/video`, `/render/audio`, `/render/office`
- Short URLs:
  - `/shorturl-create`, `/shorturl`, `/s/v`, `/s/<code>`
- Chat:
  - `/chat-link/`

## Flujo de datos de extremo a extremo

1. Usuario pega contenido o sube archivo en `/create`
2. Contenido se comprime y se marca con codigo de tipo
3. App genera enlaces hash/query para `/r`, `/ra` o `/render/*`
4. Ruta destino decodifica payload y renderiza en visor correcto
5. Short URL opcional acorta enlaces largos para compartir

## Confiabilidad en hosting estatico

- `404.tsx` recupera deep links y redirige a rutas validas
- Alias compactos reducen longitud de URL
- Herramienta recovery restaura payloads anteriores
- Limites de tamaño evitan generar enlaces fuera del rango seguro
