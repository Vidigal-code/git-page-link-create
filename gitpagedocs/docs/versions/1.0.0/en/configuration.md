# Configuration

`git-page-link-create` has two configuration layers: app runtime (`next.config.js`) and docs metadata (`gitpagedocs/*.json`).

## App runtime (`next.config.js`)

- `output: "export"` enables static export
- `basePath` and `assetPrefix` use `/git-page-link-create` in production
- `trailingSlash: true` improves static host compatibility
- `images.unoptimized: true` is required for static output
- `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` are exposed to the client

## Important environment values

- `NODE_ENV=production` activates production base path behavior
- `NEXT_PUBLIC_SITE_URL` is used for canonical/metadata links
- Browser URL limits are enforced in create/render logic via helper functions in `src/shared/lib/theme.ts`

## Link formats and markers

- Standard render markers: `#d=` and `?d=`
- Legacy markers remain compatible: `#data=` and `?data=`
- Shared-link mode:
  - `?z=1` silent/instant redirect behavior
  - `?z=0` redirect with UI feedback

## Docs metadata (`gitpagedocs/config.json`)

- `site`: docs shell options, language labels, theme defaults, icons
- `VersionControl.versions`: available doc versions and paths
- `translations`: docs shell labels for navigation and not-found views

## Version metadata (`gitpagedocs/docs/versions/1.0.0/config.json`)

- `routes`: route-to-file mapping per language (`en`, `pt`, `es`)
- `menus-header`: top menu and submenus
- Each route points to one markdown file under `gitpagedocs/docs/versions/1.0.0/<lang>/`
