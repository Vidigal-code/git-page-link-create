// Public API (keep minimal: only what the app currently imports/uses)
export { encodeRefCode, decodeRefCode } from '@/shared/lib/shorturl/refcodes';
export { encodeShortUrlToken, decodeShortUrlToken } from '@/shared/lib/shorturl/shorturl';
export { extractCodeFromLocation, extractTokenFromUserInput } from '@/shared/lib/shorturl/shorturl';
export { isValidHttpUrl, getUtf8ByteLength, formatBytes } from '@/shared/lib/shorturl/shorturl';


