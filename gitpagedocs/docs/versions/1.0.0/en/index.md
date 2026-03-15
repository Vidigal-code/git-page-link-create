# git-page-link-create v1.0.0

`git-page-link-create` is a static Next.js app that creates and opens shareable links for content encoded in URL hash/query, with no backend required.

## What this version documents

- Create and render links for HTML, Markdown, CSV/XLS, images, PDF, video, audio, and Office files
- Frontend-only short URL flow (`/shorturl-create`, `/shorturl`, `/s/<code>`)
- Compact render aliases (`/r/` and `/ra/`) with `#d=` and `?d=` markers
- URL-based chat transcripts (`/chat-link/`)
- Theme, i18n, and static-hosting behavior (including GitHub Pages)

## Core routes

- `/` - project home with feature and links register cards
- `/create` - full creator toolbox (content, media, office, recovery, QR)
- `/render/*` - specialized renderers (`image`, `pdf`, `video`, `audio`, `office`)
- `/render-all` - generic full-page renderer
- `/shorturl-create` and `/shorturl` - short link generation and decoding
- `/s/<code>` - shortest path for static hosting recovery
- `/chat-link/` - chat in URL hash

## Documentation map

- **Getting Started**: install, run, and local checks
- **Configuration**: Next.js, envs, base path, and docs metadata
- **Deployment**: static export and GitHub Pages flow
- **Architecture**: modules, routes, and data pipeline
- **Themes**: template files and runtime tokens
- **FAQ**: common issues and fixes
