# Architecture

The app is route-centric and organized around create, render, short URL, and shared UI/runtime utilities.

## Main folders

- `src/pages` - Next.js routes (`create`, `render`, `shorturl`, `chat-link`, aliases)
- `src/shared/lib` - encoding, compression, media helpers, short URL logic, i18n
- `src/shared/ui` - reusable components and feature cards
- `src/shared/styles` - styled-components theme and page-level styles
- `public/layouts` - theme templates and catalog
- `public/locales` - translations (`en`, `pt`, `es`)

## Route groups

- Creator:
  - `/create`, `/create-links`, `/create-jobs`, `/create-portfolio`
- Renderers:
  - `/render`, `/render-all`, `/r`, `/ra`
  - `/render/image`, `/render/pdf`, `/render/video`, `/render/audio`, `/render/office`
- Short URLs:
  - `/shorturl-create`, `/shorturl`, `/s/v`, `/s/<code>`
- Chat:
  - `/chat-link/`

## End-to-end data flow

1. User enters content or uploads file in `/create`
2. Content is compressed and tagged by type code
3. App generates hash/query links for `/r`, `/ra`, or specialized `/render/*`
4. Target route decodes payload and renders with the correct viewer
5. Optional short URL wraps long links for easier sharing

## Reliability and static-hosting behavior

- `404.tsx` recovers deep links for static hosts and redirects to valid routes
- Compact aliases reduce URL size and improve compatibility
- Recovery tool parses and restores previously generated payloads
- Content size guards prevent creating links above safe URL limits
