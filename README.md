# git-page-link-create

> Create permanent links for HTML, Markdown, CSV/XLS, images, PDFs, and QR codes in a static Next.js app.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

## Overview

**git-page-link-create** generates shareable links that render content directly in the browser—no backend required. It includes QR code generation plus image/PDF sharing with hash-based links to avoid 431 errors.

## Key features

- Permanent links: `/render?data={hash}` and `/render-all#data={hash}`
- Image sharing: `/render/image#data={base64}` (hash-based, PNG/JPG/SVG/GIF)
- PDF sharing: `/render/pdf#data={base64}` (hash-based, multi-page)
- Supports **HTML**, **Markdown**, **CSV/XLS**, **images**, and **PDFs**
- Secure HTML rendering via sandboxed iframe
- QR code generator with size, margin, error correction, PNG/SVG export, copy, and open actions
- Theme system via JSON templates
- Internationalization (pt, en, es)
- Compatible with Next.js static export

## Image/PDF sharing flow

1. Upload an image or PDF on the Create page.
2. Generate a link that stores the file in the URL hash.
3. Share the link and render it on `/render/image` or `/render/pdf`.

## Project structure

```
src/
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   ├── create.tsx
│   ├── render/
│   │   ├── [hash].tsx
│   │   ├── image.tsx
│   │   ├── pdf.tsx
│   │   └── index.tsx
│   └── render-all/
│       ├── [hash].tsx
│       └── index.tsx
└── shared/
    ├── lib/
    │   ├── compression.ts
    │   ├── crypto.ts
    │   ├── download.ts
    │   ├── i18n.tsx
    │   ├── image.ts
    │   ├── pdf.ts
    │   ├── qr.ts
    │   └── theme.ts
    ├── styles/
    │   ├── GlobalStyle.ts
    │   ├── theme.d.ts
    │   └── pages/
    │       ├── create.styles.ts
    │       ├── render.styles.ts
    │       ├── render-all.styles.ts
    │       ├── render-image.styles.ts
    │       └── render-pdf.styles.ts
    └── ui/
```

## Running locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

### Useful scripts

```bash
pnpm dev
pnpm build
pnpm export
pnpm lint
pnpm type-check
```

## GitHub Pages deployment (short)

1. Set `basePath` and `assetPrefix` in `next.config.js`.
2. Run `pnpm build` and `pnpm export`.
3. Publish the `out/` folder to the `gh-pages` branch.

## Themes

Themes live in `public/layouts/templates/`. The catalog is defined in `public/layouts/layoutsConfig.json`.

## Internationalization

Translations live in `public/locales/{lang}.json`. Update `getAvailableLocales()` in `src/shared/lib/i18n.tsx` when adding languages.

## License

MIT — see `LICENSE`.
