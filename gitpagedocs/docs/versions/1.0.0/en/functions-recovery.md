# Recovery Function

Recovery mode restores previously generated links and payloads.

## Supported input

- `#d=` and `?d=` payloads
- Legacy `#data=` and `?data=` payloads
- Type-prefixed compressed payload markers

## What recovery does

- Parses marker and detects content type
- Decompresses string or byte payload
- Rebuilds renderable content state
- Allows download or immediate open in matching viewer

## Typical use cases

- Fixing broken copied links
- Migrating old links to newer route aliases
- Reopening payloads in specialized render pages
