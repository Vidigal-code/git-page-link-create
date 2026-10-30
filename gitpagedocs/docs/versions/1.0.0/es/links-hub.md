# Página de perfil y enlaces

/create-links recibe profileName, profileBio, bioFonts, avatarUrl, websiteUrl/websiteLabel, mode y enlaces id/platform/url. Permite elegir template y previsualizar.

loadTemplatesLinks carga modelos, buildTemplateLinksHtml genera HTML y generateHtmlRenderAllLink crea enlace autocontenido. Estado de formulario/salida queda en cliente. No existe perfil en banco ni analytics.

Revise URLs, imágenes remotas, alternativas textuales y móvil. Cambios requieren compartir enlace nuevo; snapshots antiguos permanecen iguales.

## Código y navegación

- [src/pages/create-links.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/create-links.tsx)
- [src/features/render-all/lib/generateHtmlRenderAllLink.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/render-all/lib/generateHtmlRenderAllLink.ts)

- [Project guide](?menu=es&lang=es&id=9)
- [Source reference](?menu=es&lang=es&id=10)
