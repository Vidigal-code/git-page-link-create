# Configuracion

`git-page-link-create` tiene dos capas de configuracion: runtime de aplicacion (`next.config.js`) y metadatos de documentacion (`gitpagedocs/*.json`).

## Runtime de aplicacion (`next.config.js`)

- `output: "export"` habilita export estatico
- `basePath` y `assetPrefix` usan `/git-page-link-create` en produccion
- `trailingSlash: true` mejora compatibilidad con hosts estaticos
- `images.unoptimized: true` es obligatorio para export estatico
- `NEXT_PUBLIC_BASE_PATH` y `NEXT_PUBLIC_SITE_URL` quedan expuestos al cliente

## Variables importantes

- `NODE_ENV=production` activa comportamiento de base path de produccion
- `NEXT_PUBLIC_SITE_URL` se usa para enlaces canonicos y metadatos
- Limites de URL se aplican en create/render con helpers de `src/shared/lib/theme.ts`

## Formato de enlaces y marcadores

- Marcadores estandar: `#d=` y `?d=`
- Marcadores legacy compatibles: `#data=` y `?data=`
- Modo compartido:
  - `?z=1` redireccion silenciosa
  - `?z=0` redireccion con interfaz

## Metadatos docs (`gitpagedocs/config.json`)

- `site`: opciones del shell, idiomas, tema por defecto, iconos
- `VersionControl.versions`: versiones docs disponibles
- `translations`: textos de navegacion y no encontrado

## Config de version (`gitpagedocs/docs/versions/1.0.0/config.json`)

- `routes`: mapeo ruta-archivo por idioma (`en`, `pt`, `es`)
- `menus-header`: menu superior y submenus
- Cada ruta apunta a un markdown en `gitpagedocs/docs/versions/1.0.0/<lang>/`
