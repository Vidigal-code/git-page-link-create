# git-page-link-create v1.0.0

`git-page-link-create` es una aplicacion Next.js estatica para crear y abrir enlaces compartibles con contenido codificado en hash/query de URL, sin backend.

## Que documenta esta version

- Creacion y render de enlaces para HTML, Markdown, CSV/XLS, imagen, PDF, video, audio y Office
- Flujo de short URL frontend-only (`/shorturl-create`, `/shorturl`, `/s/<code>`)
- Alias compactos (`/r/` y `/ra/`) con marcadores `#d=` y `?d=`
- Chat por URL (`/chat-link/`)
- Comportamiento de tema, i18n y hosting estatico (incluye GitHub Pages)

## Rutas principales

- `/` - pagina inicial con recursos y tarjetas de enlaces registrados
- `/create` - toolbox completa (contenido, media, office, recovery, QR)
- `/render/*` - renderizadores especificos (`image`, `pdf`, `video`, `audio`, `office`)
- `/render-all` - renderizador generico a pantalla completa
- `/shorturl-create` y `/shorturl` - generacion y decodificacion de short link
- `/s/<code>` - ruta mas corta para recuperacion en hosting estatico
- `/chat-link/` - conversacion guardada en hash

## Mapa de documentacion

- **Primeros pasos**: instalar, ejecutar y validar localmente
- **Configuracion**: Next.js, variables, base path y metadatos docs
- **Publicacion**: flujo de export estatico y GitHub Pages
- **Arquitectura**: modulos, rutas y pipeline de datos
- **Temas y layouts**: templates y tokens visuales
- **FAQ**: problemas comunes y soluciones
