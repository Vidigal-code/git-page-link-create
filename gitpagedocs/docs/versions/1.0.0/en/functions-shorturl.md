# Short URL Function

Short URL features provide smaller shareable links in frontend-only mode.

## Main routes

- `/shorturl-create` to generate short links
- `/shorturl` to decode and redirect
- `/s/<code>` as compact path for static hosting compatibility

## Behavior

- Encodes long links into short reversible tokens
- Supports reference-code style shortcuts
- Keeps redirect behavior compatible with shared mode flags

## Recovery on static hosts

When a compact route is opened directly, `404.tsx` detects recoverable patterns and redirects to the proper internal route.
