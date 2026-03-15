# Deployment

`git-page-link-create` is deployed as a static export, optimized for GitHub Pages and similar static hosts.

## Local production run

1. `npm run build`
2. `npm start`

Use this to validate production routing and rendering before export.

## Static export flow

1. `npm run build`
2. `npm run export`
3. Publish the generated `out/` directory

Because `output: "export"` is enabled, no backend runtime is required in production.

## GitHub Pages notes

- Production base path is `/git-page-link-create`
- `assetPrefix` uses the same base path
- `trailingSlash: true` helps static route resolution
- `404.tsx` recovers deep links like `/s/<code>`, `/r/<payload>`, and `/ra/<payload>`

## Hosting checklist

- Ensure static host serves `out/` exactly as generated
- Keep routing fallback to `404.html` for unknown paths
- Validate that hash-based links open without server rewrites
- Confirm short URL compact paths redirect correctly
