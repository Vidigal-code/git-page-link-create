# git-page-link-create

> Create permanent links for HTML, Markdown, CSV/XLS, images, PDFs, videos, audio, and QR codes in a static Next.js app.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

## Overview

**git-page-link-create** generates shareable links that render content directly in the browser—no backend required. It includes QR code generation plus image/PDF/video/audio sharing with hash-based links to avoid 431 errors, Microsoft Office rendering from public URLs, and **frontend-only reversible short URLs**.

## Project page & documentation

- **Project page (demo) + docs**: [https://tinyurl.com/5n8eptkv](https://tinyurl.com/5n8eptkv)

## Key features

- Permanent links: `/render?data={hash}` and `/render-all#data={hash}`
- **Short URLs (frontend-only)**: `/shorturl-create` generates reversible short links that decode back to the original URL
- **Shortest short path**: `/s/<code>` (recovered by `404.tsx` on static hosting)
- **Instant renderer links**: internal content can open directly via `/r/` and `/ra/` (aliases for `/render` and `/render-all`)
- Image sharing: `/render/image#data={base64}` (hash-based, PNG/JPG/SVG/GIF)
- PDF sharing: `/render/pdf#data={base64}` (hash-based, multi-page)
- Video sharing: `/render/video#data={base64}` (hash-based)
- Audio sharing: `/render/audio#data={base64}` (hash-based)
- Microsoft Office sharing: `/render/office?source={publicUrl}` (Word/Excel/PowerPoint)
- Link-based chat: `/chat-link/#data=chat-{hash}` (chat transcript stored in the URL hash)
- Shorter render markers: `#d=` and `?d=` (legacy `#data=` / `?data=` still supported)
- Global shared-link behavior: `?z=1` = blank/silent redirect, `?z=0` = redirect UI with header/footer
- Supports **HTML**, **Markdown**, **CSV/XLS**, **images**, **PDFs**, **videos**, **audio**, and **Microsoft Office** files
- Secure HTML rendering via sandboxed iframe
- QR code generator with size, margin, error correction, PNG/SVG export, copy, and open actions
- Theme system via JSON templates
- Internationalization (pt, en, es)
- Compatible with Next.js static export

## Media sharing flow

1. Upload an image, PDF, video, or audio file on the Create page.
2. Generate a link that stores the file in the URL hash.
3. Share the link and render it on `/render/image`, `/render/pdf`, `/render/video`, or `/render/audio`.
4. For Office files, paste a public URL and generate a `/render/office?source={url}` link.

## Link-based chat flow

1. Open `/chat-link/` and send a message (name + text). The browser stores local date/time metadata.
2. The full transcript is compressed and saved into the URL hash: `#data=chat-...`.
3. Share the link. Anyone can open it on any device and reply while keeping the full context.
4. Use **Reply** to quote a previous message in the next message.
5. Use **Copy link** / **Open link** to share or open the current transcript in a new tab.

## URL length limits

Browsers enforce hard URL length limits (often around 2,000,000 characters). For large media files, use the "URL" option on the Create page to generate a short link that points to externally hosted content. This is the most reliable way to render large images, videos, audio, and PDFs across browsers. With the default limits, PDFs and media files should be ~1.3 MB or less when embedded in the URL hash. Office files must be hosted on a public URL and stay under the Office link limit.

The chat transcript is also stored in the URL hash. When the transcript grows beyond the configured safe limit, the UI will warn you and prevent sending messages that would exceed the maximum URL length.

## Project structure

```
src/
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   ├── create.tsx
│   ├── shorturl.tsx
│   ├── shorturl-create.tsx
│   ├── r.tsx
│   ├── ra.tsx
│   ├── chat-link.tsx
│   ├── render/
│   │   ├── [hash].tsx
│   │   ├── audio.tsx
│   │   ├── image.tsx
│   │   ├── pdf.tsx
│   │   ├── video.tsx
│   │   ├── office.tsx
│   │   └── index.tsx
│   └── render-all/
│       ├── [hash].tsx
│       └── index.tsx
└── shared/
    ├── lib/
    │   ├── base64.ts
    │   ├── compression.ts
    │   ├── chat-link.ts
    │   ├── crypto.ts
    │   ├── download.ts
    │   ├── i18n.tsx
    │   ├── audio.ts
    │   ├── image.ts
    │   ├── pdf.ts
    │   ├── video.ts
    │   ├── office.ts
    │   ├── qr.ts
    │   ├── recovery.ts
    │   ├── shorturl/
    │   │   ├── base10.ts
    │   │   ├── bytesPayload.ts
    │   │   ├── dictionary.ts
    │   │   ├── index.ts
    │   │   ├── refcodes.ts
    │   │   ├── shorturl.ts
    │   │   ├── typeCodes.ts
    │   │   └── docs/
    │   │       ├── README.md
    │   │       ├── pt/README.md
    │   │       └── es/README.md
    │   └── theme.ts
    ├── styles/
    │   ├── GlobalStyle.ts
    │   ├── theme.d.ts
    │   └── pages/
    │       ├── chat-link.styles.ts
    │       ├── create.styles.ts
    │       ├── render.styles.ts
    │       ├── render-all.styles.ts
    │       ├── render-audio.styles.ts
    │       ├── render-image.styles.ts
    │       ├── render-pdf.styles.ts
    │       ├── render-video.styles.ts
    │       └── render-office.styles.ts
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

## Short URL docs (internal)

- Implementation docs: `src/shared/lib/shorturl/docs/README.md` (also available in `pt` and `es`)

## License

MIT — see `LICENSE`.
