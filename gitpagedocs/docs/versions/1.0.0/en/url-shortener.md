# Reversible URL shortener and QR code

/shorturl-create reversibly encodes a URL. AT2 uses a prefix dictionary, gzip and Base64URL; AT1/AT0 are legacy decimal formats. The decoder rejects non-HTTP/HTTPS destinations. /shorturl reads c/code, hash or path; the 404 fallback recovers deep paths on static hosting. Navigation occurs in the browser, without an API HTTP 302. Compression does not always produce a shorter URL.

buildShortUrlCandidates also generates refcodes, removes duplicate links and sorts by length. Path transport is limited to codes up to 1500 characters; hash transport is available. In instantRenderer mode, a refcode representing a local path may open the renderer directly. The resolver recognizes AT tokens and refcodes.

Base64URL/gzip do not encrypt data. Do not put credentials or confidential data in links. Third-party HTML, documents and URLs are untrusted input; isolation depends on the renderer and must be reviewed before handling sensitive content. The codec payload limit is 999,999 bytes; browsers, messengers and hosts can impose lower URL limits. Remote requests depend on availability and CORS. The production base path is /git-page-link-create.

## Code and navigation

- [src/features/shorturl/model/createCandidates.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/shorturl/model/createCandidates.ts)
- [src/features/shorturl/model/resolveTargetUrl.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/shorturl/model/resolveTargetUrl.ts)
- [src/shared/lib/shorturl/shorturl.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/shared/lib/shorturl/shorturl.ts)
- [src/pages/shorturl-create.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/shorturl-create.tsx)
- [src/pages/shorturl.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/shorturl.tsx)
- [src/pages/404.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/404.tsx)

- [Project guide](?menu=en&lang=en&id=9)
- [Source reference](?menu=en&lang=en&id=10)
