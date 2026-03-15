# Primeros pasos

Usa esta guia para ejecutar `git-page-link-create` en local y validar el flujo completo de enlaces.

## Requisitos

- Node.js 20+
- npm 10+ (pnpm tambien funciona)

## Instalar y ejecutar

1. Instala dependencias:
   - `npm install`
2. Inicia servidor de desarrollo:
   - `npm run dev`
3. Abre:
   - `http://localhost:3000`

## Validacion de produccion

1. Build:
   - `npm run build`
2. Servidor de produccion:
   - `npm start`
3. Export estatico opcional:
   - `npm run export`

## Checklist inicial

- Generar enlace HTML o Markdown en `/create`
- Abrir enlaces generados en `/r/` y `/ra/`
- Generar y abrir enlace hash de imagen o PDF
- Generar short URL en `/shorturl-create`
- Validar recuperacion con `/s/<code>`
- Crear y compartir un chat en `/chat-link/`

## Scripts disponibles

- `npm run dev` - desarrollo local
- `npm run build` - build de produccion
- `npm run export` - export estatico para hosts como GitHub Pages
- `npm run deploy` - build mas export
- `npm run lint` - lint
- `npm run type-check` - validacion TypeScript
