# FAQ

## Why does generated link open with empty content?

Check:

- the link still contains full hash/query payload (`#d=` or `?d=`)
- content type prefix exists (example: `h-`, `md-`, `pdf-`)
- the link was not truncated by chat/email tools

## Why does `/s/<code>` show 404 on static hosting?

Check:

- static host is serving the exported `404.html`
- base path matches `next.config.js` production settings
- short code is valid and not manually modified

## Why does media generation fail for large files?

Large files can exceed browser URL limits. Use source-URL mode when possible:

- image/video/audio from a public URL
- Office files from a public URL via `/render/office?source=...`

## Why does Office rendering not work?

Check:

- file URL is public (no auth/cookies required)
- URL is `http` or `https`
- file format is supported by Office web viewer

## Why does recovery fail for a valid old link?

Check:

- link uses supported marker (`#d=`, `?d=`, legacy `#data=`, `?data=`)
- payload is not corrupted by URL shortening tools
- browser did not strip hash when sharing
