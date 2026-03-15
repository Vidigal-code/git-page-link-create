# Getting Started

Use this guide to run `git-page-link-create` locally and validate the full link flow.

## Requirements

- Node.js 20+
- npm 10+ (pnpm also works)

## Install and run

1. Install dependencies:
   - `npm install`
2. Start development server:
   - `npm run dev`
3. Open:
   - `http://localhost:3000`

## Production check

1. Build:
   - `npm run build`
2. Run production server:
   - `npm start`
3. Optional static export:
   - `npm run export`

## First validation checklist

- Generate an HTML or Markdown link in `/create`
- Open generated links in `/r/` and `/ra/`
- Generate and open an image or PDF hash link
- Generate a short URL in `/shorturl-create`
- Validate short path recovery using `/s/<code>`
- Create and share a transcript in `/chat-link/`

## Available scripts

- `npm run dev` - local development
- `npm run build` - production build
- `npm run export` - static export for hosts like GitHub Pages
- `npm run deploy` - build plus export
- `npm run lint` - lint check
- `npm run type-check` - TypeScript check
