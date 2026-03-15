# Publicacion

`git-page-link-create` se publica como export estatico, optimizado para GitHub Pages y otros hosts estaticos.

## Ejecucion local en produccion

1. `npm run build`
2. `npm start`

Usa esto para validar rutas y render de produccion antes de exportar.

## Flujo de export estatico

1. `npm run build`
2. `npm run export`
3. Publicar la carpeta `out/`

Como `output: "export"` esta activo, no se requiere backend en produccion.

## Notas para GitHub Pages

- Base path de produccion: `/git-page-link-create`
- `assetPrefix` usa el mismo base path
- `trailingSlash: true` ayuda en resolucion de rutas
- `404.tsx` recupera deep links como `/s/<code>`, `/r/<payload>` y `/ra/<payload>`

## Checklist de hosting

- Asegurar que el host sirva exactamente el contenido de `out/`
- Mantener fallback de rutas a `404.html`
- Validar apertura de enlaces hash sin rewrites del servidor
- Confirmar redireccion correcta de rutas cortas
