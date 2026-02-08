import { BASE_PATH } from '@/shared/lib/basePath';

export type ShortUrlRefCodeEntry = {
    code: string; // e.g. "vh"
    prefix: string; // may be absolute ("https://...") or site-relative (starts with BASE_PATH)
    note?: string;
};

/**
 * Reference codes: the shortest possible for common, repeated prefixes.
 * This is frontend-only and reversible as long as this table remains stable.
 *
 * Important: keep `code` short and unique.
 */
export const SHORTURL_REF_CODES: ReadonlyArray<ShortUrlRefCodeEntry> = Object.freeze([
    // ---- This app (basePath-aware) ----
    // Ultra-short codes for the most common/high-impact internal prefixes (put first so they win ties)
    // Canonicalize to the shortest routes + shortest marker (`#d=`). Encoder still accepts old prefixes via aliases.
    { code: 'h', prefix: `${BASE_PATH}/ra#d=h-`, note: 'render-all html payload (hash) [1-char]' },
    { code: 'm', prefix: `${BASE_PATH}/ra#d=m-`, note: 'render-all markdown (hash) [1-char]' },
    { code: 'r', prefix: `${BASE_PATH}/r#d=`, note: 'render payload (hash) [1-char]' },
    // Media route prefixes (works for both legacy and new compact `b-...` payloads)
    { code: 'f', prefix: `${BASE_PATH}/render/pdf?fullscreen=1#d=`, note: 'pdf fullscreen (hash) [1-char]' },
    { code: 'd', prefix: `${BASE_PATH}/render/pdf#d=`, note: 'pdf (hash) [1-char]' },
    { code: 'e', prefix: `${BASE_PATH}/render/image#d=`, note: 'image (hash) [1-char]' },
    { code: 'n', prefix: `${BASE_PATH}/render/video#d=`, note: 'video (hash) [1-char]' },
    { code: 'o', prefix: `${BASE_PATH}/render/audio#d=`, note: 'audio (hash) [1-char]' },
    { code: 'p', prefix: `${BASE_PATH}/render/pdf?fullscreen=1#d=data%3Aapplication%2Fpdf%3Bbase64%2C`, note: 'pdf fullscreen base64 payload (encoded) [1-char]' },
    { code: 'i', prefix: `${BASE_PATH}/render/image#d=data%3Aimage%2Fpng%3Bbase64%2C`, note: 'image/png base64 (encoded) [1-char]' },
    { code: 'v', prefix: `${BASE_PATH}/render/video#d=data%3Avideo%2Fmp4%3Bbase64%2C`, note: 'video/mp4 base64 (encoded) [1-char]' },
    { code: 'a', prefix: `${BASE_PATH}/render/audio#d=data%3Aaudio%2Fmpeg%3Bbase64%2C`, note: 'audio/mpeg base64 (encoded) [1-char]' },

    {
        code: 'vh',
        // Canonical form used by this app when generating links: `${withBasePath('render-all')}#data=html-...`
        prefix: `${BASE_PATH}/render-all#data=html-`,
        note: 'render-all html payload (fullscreen html)',
    },
    // render-all by type (hash)
    { code: 'vm', prefix: `${BASE_PATH}/render-all#data=md-`, note: 'render-all markdown (hash)' },
    { code: 'vc', prefix: `${BASE_PATH}/render-all#data=csv-`, note: 'render-all csv (hash)' },
    { code: 'vt', prefix: `${BASE_PATH}/render-all#data=txt-`, note: 'render-all text (hash)' },
    { code: 'vx', prefix: `${BASE_PATH}/render-all#data=xlsx-`, note: 'render-all xlsx (hash)' },
    { code: 'vl', prefix: `${BASE_PATH}/render-all#data=xls-`, note: 'render-all xls (hash)' },
    { code: 'vd', prefix: `${BASE_PATH}/render-all#data=docx-`, note: 'render-all docx (hash -> redirects to office)' },
    // NOTE: keep all codes lowercase (decoder normalizes to lowercase)
    { code: 'vpx', prefix: `${BASE_PATH}/render-all#data=pptx-`, note: 'render-all pptx (hash -> redirects to office)' },
    { code: 'vpf', prefix: `${BASE_PATH}/render-all#data=pdf-`, note: 'render-all pdf (hash -> redirects to pdf)' },
    { code: 'vim', prefix: `${BASE_PATH}/render-all#data=image-`, note: 'render-all image (hash -> redirects to image)' },
    { code: 'vvd', prefix: `${BASE_PATH}/render-all#data=video-`, note: 'render-all video (hash -> redirects to video)' },
    { code: 'vau', prefix: `${BASE_PATH}/render-all#data=audio-`, note: 'render-all audio (hash -> redirects to audio)' },
    {
        code: 'vr',
        // Canonical: `${withBasePath('render')}#data=<type>-<payload>`
        prefix: `${BASE_PATH}/render#data=`,
        note: 'render payload (hash)',
    },
    // render by type (hash)
    { code: 'rh', prefix: `${BASE_PATH}/render#data=html-`, note: 'render html (hash)' },
    { code: 'rm', prefix: `${BASE_PATH}/render#data=md-`, note: 'render markdown (hash)' },
    { code: 'rc', prefix: `${BASE_PATH}/render#data=csv-`, note: 'render csv (hash)' },
    { code: 'rt', prefix: `${BASE_PATH}/render#data=txt-`, note: 'render text (hash)' },
    { code: 'rx', prefix: `${BASE_PATH}/render#data=xlsx-`, note: 'render xlsx (hash)' },
    { code: 'rl', prefix: `${BASE_PATH}/render#data=xls-`, note: 'render xls (hash)' },
    { code: 'rd', prefix: `${BASE_PATH}/render#data=docx-`, note: 'render docx (hash -> redirects to office)' },
    { code: 'rpx', prefix: `${BASE_PATH}/render#data=pptx-`, note: 'render pptx (hash -> redirects to office)' },
    {
        code: 'vp',
        // Canonical: `${withBasePath('render/pdf?fullscreen=1')}#data=<payload>`
        prefix: `${BASE_PATH}/render/pdf?fullscreen=1#data=`,
        note: 'pdf fullscreen (hash)',
    },
    {
        code: 'pd',
        prefix: `${BASE_PATH}/render/pdf#data=`,
        note: 'pdf (hash)',
    },
    // PDF payload is always `encodeURIComponent(data:application/pdf;base64,...)` -> common prefix
    { code: 'pdb', prefix: `${BASE_PATH}/render/pdf#data=data%3Aapplication%2Fpdf%3Bbase64%2C`, note: 'pdf base64 payload (encoded) - shortest' },
    { code: 'pbf', prefix: `${BASE_PATH}/render/pdf?fullscreen=1#data=data%3Aapplication%2Fpdf%3Bbase64%2C`, note: 'pdf fullscreen base64 payload (encoded) - shortest' },
    {
        code: 'vi',
        prefix: `${BASE_PATH}/render/image#data=`,
        note: 'image (hash)',
    },
    { code: 'imb', prefix: `${BASE_PATH}/render/image#data=data%3Aimage%2F`, note: 'image base64 payload (encoded) - shortest' },
    // common image mime prefixes (more specific => shorter remainder)
    { code: 'ipn', prefix: `${BASE_PATH}/render/image#data=data%3Aimage%2Fpng%3Bbase64%2C`, note: 'image/png base64 (encoded)' },
    { code: 'ijg', prefix: `${BASE_PATH}/render/image#data=data%3Aimage%2Fjpeg%3Bbase64%2C`, note: 'image/jpeg base64 (encoded)' },
    { code: 'ijp', prefix: `${BASE_PATH}/render/image#data=data%3Aimage%2Fjpg%3Bbase64%2C`, note: 'image/jpg base64 (encoded)' },
    { code: 'igf', prefix: `${BASE_PATH}/render/image#data=data%3Aimage%2Fgif%3Bbase64%2C`, note: 'image/gif base64 (encoded)' },
    { code: 'iwp', prefix: `${BASE_PATH}/render/image#data=data%3Aimage%2Fwebp%3Bbase64%2C`, note: 'image/webp base64 (encoded)' },
    { code: 'isv', prefix: `${BASE_PATH}/render/image#data=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2C`, note: 'image/svg+xml base64 (encoded)' },
    {
        code: 'vv',
        prefix: `${BASE_PATH}/render/video#data=`,
        note: 'video (hash)',
    },
    { code: 'vdb', prefix: `${BASE_PATH}/render/video#data=data%3Avideo%2F`, note: 'video base64 payload (encoded) - shortest' },
    { code: 'vmp', prefix: `${BASE_PATH}/render/video#data=data%3Avideo%2Fmp4%3Bbase64%2C`, note: 'video/mp4 base64 (encoded)' },
    { code: 'vwb', prefix: `${BASE_PATH}/render/video#data=data%3Avideo%2Fwebm%3Bbase64%2C`, note: 'video/webm base64 (encoded)' },
    {
        code: 'vf',
        prefix: `${BASE_PATH}/render/video?fullscreen=1#data=`,
        note: 'video fullscreen (hash)',
    },
    {
        code: 'va',
        prefix: `${BASE_PATH}/render/audio#data=`,
        note: 'audio (hash)',
    },
    { code: 'adb', prefix: `${BASE_PATH}/render/audio#data=data%3Aaudio%2F`, note: 'audio base64 payload (encoded) - shortest' },
    { code: 'amp', prefix: `${BASE_PATH}/render/audio#data=data%3Aaudio%2Fmpeg%3Bbase64%2C`, note: 'audio/mpeg base64 (encoded)' },
    { code: 'am3', prefix: `${BASE_PATH}/render/audio#data=data%3Aaudio%2Fmp3%3Bbase64%2C`, note: 'audio/mp3 base64 (encoded)' },
    { code: 'aog', prefix: `${BASE_PATH}/render/audio#data=data%3Aaudio%2Fogg%3Bbase64%2C`, note: 'audio/ogg base64 (encoded)' },
    { code: 'awb', prefix: `${BASE_PATH}/render/audio#data=data%3Aaudio%2Fwebm%3Bbase64%2C`, note: 'audio/webm base64 (encoded)' },
    {
        code: 'af',
        prefix: `${BASE_PATH}/render/audio?fullscreen=1#data=`,
        note: 'audio fullscreen (hash)',
    },
    {
        code: 'vo',
        prefix: `${BASE_PATH}/render/office#data=`,
        note: 'office upload (hash: type-compressed)',
    },
    {
        code: 'of',
        prefix: `${BASE_PATH}/render/office?fullscreen=1#data=`,
        note: 'office upload fullscreen (hash: type-compressed)',
    },
    {
        code: 'os',
        prefix: `${BASE_PATH}/render/office?source=`,
        note: 'office source URL (query)',
    },
    {
        code: 'is',
        prefix: `${BASE_PATH}/render/image?source=`,
        note: 'image source URL (query)',
    },
    {
        code: 'vs',
        prefix: `${BASE_PATH}/render/video?source=`,
        note: 'video source URL (query)',
    },
    {
        code: 'as',
        prefix: `${BASE_PATH}/render/audio?source=`,
        note: 'audio source URL (query)',
    },
    {
        code: 'rs',
        prefix: `${BASE_PATH}/render?source=`,
        note: 'generic source URL (query) - requires &type=...',
    },

    // Query-based recovery links (used by /render and /render-all recovery flows)
    { code: 'rq', prefix: `${BASE_PATH}/render?data=`, note: 'render recovery (query)' },
    { code: 'aq', prefix: `${BASE_PATH}/render-all?data=`, note: 'render-all recovery (query)' },
    // render by type (query)
    { code: 'qh', prefix: `${BASE_PATH}/render?data=html-`, note: 'render html (query)' },
    { code: 'qm', prefix: `${BASE_PATH}/render?data=md-`, note: 'render markdown (query)' },
    { code: 'qc', prefix: `${BASE_PATH}/render?data=csv-`, note: 'render csv (query)' },
    { code: 'qt', prefix: `${BASE_PATH}/render?data=txt-`, note: 'render text (query)' },
    { code: 'qx', prefix: `${BASE_PATH}/render?data=xlsx-`, note: 'render xlsx (query)' },
    // render-all by type (query)
    { code: 'ah', prefix: `${BASE_PATH}/render-all?data=html-`, note: 'render-all html (query)' },
    { code: 'am', prefix: `${BASE_PATH}/render-all?data=md-`, note: 'render-all markdown (query)' },
    { code: 'ac', prefix: `${BASE_PATH}/render-all?data=csv-`, note: 'render-all csv (query)' },
    { code: 'at', prefix: `${BASE_PATH}/render-all?data=txt-`, note: 'render-all text (query)' },
    { code: 'ax', prefix: `${BASE_PATH}/render-all?data=xlsx-`, note: 'render-all xlsx (query)' },

    // Chat-link transcript (stored in hash)
    {
        code: 'cl',
        // Canonical: `${withBasePath('/chat-link/')}#data=chat-...` (note the page path ends with `/`)
        // We canonicalize by removing the optional slash before `#` during encoding.
        prefix: `${BASE_PATH}/chat-link#data=chat-`,
        note: 'chat-link transcript (hash)',
    },

    // ---- Common external sites ----
    // 1-char high-frequency externals (put first so they win ties)
    { code: 'y', prefix: 'https://www.youtube.com/watch?v=', note: 'youtube watch [1-char]' },
    { code: 'w', prefix: 'https://wa.me/', note: 'whatsapp short [1-char]' },
    { code: 't', prefix: 'https://twitter.com/', note: 'twitter [1-char]' },
    { code: 'g', prefix: 'https://github.com/', note: 'github [1-char]' },

    { code: 'yt', prefix: 'https://www.youtube.com/watch?v=', note: 'youtube watch' },
    { code: 'yb', prefix: 'https://youtu.be/', note: 'youtube short' },
    { code: 'wa', prefix: 'https://wa.me/', note: 'whatsapp short' },
    { code: 'wp', prefix: 'https://api.whatsapp.com/send?phone=', note: 'whatsapp api phone' },
    { code: 'wg', prefix: 'https://api.whatsapp.com/send?text=', note: 'whatsapp api text' },
    { code: 'tw', prefix: 'https://twitter.com/', note: 'twitter' },
    { code: 'x', prefix: 'https://x.com/', note: 'x.com' },
    { code: 'ig', prefix: 'https://www.instagram.com/', note: 'instagram' },
    { code: 'gh', prefix: 'https://github.com/', note: 'github' },
    { code: 'gl', prefix: 'https://gitlab.com/', note: 'gitlab' },
    { code: 'ln', prefix: 'https://www.linkedin.com/', note: 'linkedin' },
    { code: 'tg', prefix: 'https://t.me/', note: 'telegram' },
    { code: 'dg', prefix: 'https://discord.gg/', note: 'discord invite' },
    { code: 'fb', prefix: 'https://www.facebook.com/', note: 'facebook' },
    { code: 'tt', prefix: 'https://www.tiktok.com/', note: 'tiktok' },
    { code: 'tv', prefix: 'https://vm.tiktok.com/', note: 'tiktok short' },
    // Avoid collision with internal `rd-` (render docx)
    { code: 'rdd', prefix: 'https://www.reddit.com/', note: 'reddit' },
    { code: 'sp', prefix: 'https://open.spotify.com/', note: 'spotify' },
    { code: 'dr', prefix: 'https://drive.google.com/', note: 'google drive' },
    { code: 'dc', prefix: 'https://docs.google.com/', note: 'google docs' },
    { code: 'db', prefix: 'https://www.dropbox.com/', note: 'dropbox' },
    { code: 'rw', prefix: 'https://raw.githubusercontent.com/', note: 'github raw' },

    // File hosting / sharing
    { code: 'mg', prefix: 'https://mega.nz/file/', note: 'mega file' },
    { code: 'mga', prefix: 'https://mega.nz/folder/', note: 'mega folder' },
    { code: 'mf', prefix: 'https://www.mediafire.com/file/', note: 'mediafire file' },
    { code: 'mfs', prefix: 'https://www.mediafire.com/?', note: 'mediafire (generic)' },
    { code: 'od', prefix: 'https://onedrive.live.com/', note: 'onedrive' },
    { code: '1d', prefix: 'https://1drv.ms/', note: 'onedrive short' },
    { code: 'bx', prefix: 'https://box.com/', note: 'box' },
    { code: 'bxs', prefix: 'https://app.box.com/', note: 'box app' },
    { code: 'wt', prefix: 'https://we.tl/', note: 'wetransfer short' },
    { code: 'wtr', prefix: 'https://wetransfer.com/', note: 'wetransfer' },
]);

const REF_PREFIX_BY_CODE = Object.freeze(
    SHORTURL_REF_CODES.reduce<Record<string, string>>((acc, e) => {
        acc[e.code] = e.prefix;
        return acc;
    }, {})
);

/**
 * Encoding aliases: allow the encoder to recognize multiple equivalent prefixes
 * (e.g. type names vs 1-char type codes) while decoding always uses the canonical
 * prefix for each code.
 *
 * This is safe because our renderers accept both formats.
 */
const ENCODE_PREFIX_ALIASES: ReadonlyArray<{ code: string; prefix: string }> = Object.freeze([
    // Short marker aliases (#d= / ?d=)
    // Short routes (/r, /ra)
    { code: 'h', prefix: `${BASE_PATH}/ra#d=html-` },
    { code: 'm', prefix: `${BASE_PATH}/ra#d=md-` },
    { code: 'r', prefix: `${BASE_PATH}/r#d=` },
    { code: 'h', prefix: `${BASE_PATH}/ra#d=h-` },
    { code: 'm', prefix: `${BASE_PATH}/ra#d=m-` },

    { code: 'h', prefix: `${BASE_PATH}/render-all#d=html-` },
    { code: 'm', prefix: `${BASE_PATH}/render-all#d=md-` },
    { code: 'r', prefix: `${BASE_PATH}/render#d=` },
    { code: 'f', prefix: `${BASE_PATH}/render/pdf?fullscreen=1#d=` },
    { code: 'd', prefix: `${BASE_PATH}/render/pdf#d=` },
    { code: 'e', prefix: `${BASE_PATH}/render/image#d=` },
    { code: 'n', prefix: `${BASE_PATH}/render/video#d=` },
    { code: 'o', prefix: `${BASE_PATH}/render/audio#d=` },

    // render-all type code aliases (new short `#data=h-...` etc.)
    { code: 'h', prefix: `${BASE_PATH}/render-all#data=h-` },
    { code: 'm', prefix: `${BASE_PATH}/render-all#data=m-` },
    { code: 'vc', prefix: `${BASE_PATH}/render-all#data=c-` }, // csv
    { code: 'vt', prefix: `${BASE_PATH}/render-all#data=t-` }, // txt
    { code: 'vx', prefix: `${BASE_PATH}/render-all#data=x-` }, // xlsx
    { code: 'vl', prefix: `${BASE_PATH}/render-all#data=l-` }, // xls
    { code: 'vd', prefix: `${BASE_PATH}/render-all#data=d-` }, // docx
    { code: 'vpx', prefix: `${BASE_PATH}/render-all#data=p-` }, // pptx
    // render type code aliases
    { code: 'rh', prefix: `${BASE_PATH}/render#data=h-` },
    { code: 'rm', prefix: `${BASE_PATH}/render#data=m-` },
    { code: 'rc', prefix: `${BASE_PATH}/render#data=c-` },
    { code: 'rt', prefix: `${BASE_PATH}/render#data=t-` },
    { code: 'rx', prefix: `${BASE_PATH}/render#data=x-` },
    { code: 'rl', prefix: `${BASE_PATH}/render#data=l-` },
    { code: 'rd', prefix: `${BASE_PATH}/render#data=d-` },
    { code: 'rpx', prefix: `${BASE_PATH}/render#data=p-` },

    // Query marker aliases (?d=)
    { code: 'qh', prefix: `${BASE_PATH}/render?d=html-` },
    { code: 'qm', prefix: `${BASE_PATH}/render?d=md-` },
    { code: 'qc', prefix: `${BASE_PATH}/render?d=csv-` },
    { code: 'qt', prefix: `${BASE_PATH}/render?d=txt-` },
    { code: 'qx', prefix: `${BASE_PATH}/render?d=xlsx-` },
    { code: 'ah', prefix: `${BASE_PATH}/render-all?d=html-` },
    { code: 'am', prefix: `${BASE_PATH}/render-all?d=md-` },
    { code: 'ac', prefix: `${BASE_PATH}/render-all?d=csv-` },
    { code: 'at', prefix: `${BASE_PATH}/render-all?d=txt-` },
    { code: 'ax', prefix: `${BASE_PATH}/render-all?d=xlsx-` },
]);

function normalizeUrlToPathIfPossible(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (!/^https?:\/\//i.test(trimmed)) return null;
    try {
        const u = new URL(trimmed);
        return `${u.pathname}${u.search}${u.hash}`;
    } catch {
        return null;
    }
}

function canonicalizeHashAndQuerySeparators(input: string): string {
    // Normalize variants like:
    // - `/render-all/#data=...` -> `/render-all#data=...`
    // - `/render/pdf/?fullscreen=1#data=...` -> `/render/pdf?fullscreen=1#data=...`
    return input.replace(/\/([?#])/g, '$1');
}

type MatchCandidate = { code: string; prefix: string; note?: string };

const ENCODE_CANDIDATES: ReadonlyArray<MatchCandidate> = Object.freeze([
    ...SHORTURL_REF_CODES.map((e) => ({ code: e.code, prefix: e.prefix, note: e.note })),
    ...ENCODE_PREFIX_ALIASES.map((e) => ({ code: e.code, prefix: e.prefix, note: 'alias' })),
]);

function findBestRefMatch(input: string): { entry: ShortUrlRefCodeEntry; remainder: string } | null {
    let best: { entry: ShortUrlRefCodeEntry; len: number; remainder: string } | null = null;

    for (const candidate of ENCODE_CANDIDATES) {
        if (!input.startsWith(candidate.prefix)) continue;
        const remainder = input.slice(candidate.prefix.length);
        const canonicalPrefix = REF_PREFIX_BY_CODE[candidate.code];
        if (!canonicalPrefix) continue;
        const entry: ShortUrlRefCodeEntry = { code: candidate.code, prefix: canonicalPrefix };
        if (!best || candidate.prefix.length > best.len) {
            best = { entry, len: candidate.prefix.length, remainder };
        }
    }

    return best ? { entry: best.entry, remainder: best.remainder } : null;
}

/**
 * Encodes a full URL into the shortest reference code when it matches a known prefix.
 * Examples:
 * - `${BASE_PATH}/render-all/#data=html-<payload>` -> `vh-<payload>`
 * - `https://www.youtube.com/watch?v=<id>` -> `yt-<id>`
 *
 * Returns null when no match exists.
 */
export function encodeRefCode(url: string): string | null {
    const trimmed = url.trim();
    if (!trimmed) return null;

    // Try absolute match first (external prefixes are absolute)
    const absoluteMatch = findBestRefMatch(trimmed) || findBestRefMatch(canonicalizeHashAndQuerySeparators(trimmed));
    if (absoluteMatch) return `${absoluteMatch.entry.code}-${absoluteMatch.remainder}`;

    // Try path-only match (for our app links that may be absolute)
    const path = normalizeUrlToPathIfPossible(trimmed);
    if (path) {
        const canonicalPath = canonicalizeHashAndQuerySeparators(path);
        const pathMatch = findBestRefMatch(path) || findBestRefMatch(canonicalPath);
        if (pathMatch) return `${pathMatch.entry.code}-${pathMatch.remainder}`;
    }

    // Try direct path match (already relative)
    const relativeMatch = findBestRefMatch(trimmed) || findBestRefMatch(canonicalizeHashAndQuerySeparators(trimmed));
    if (relativeMatch) return `${relativeMatch.entry.code}-${relativeMatch.remainder}`;

    return null;
}

export type DecodedRefCode =
    | { kind: 'absolute'; url: string }
    | { kind: 'path'; path: string };

/**
 * Decodes a reference code back into either:
 * - an absolute URL (external prefixes)
 * - a site-relative path (app prefixes)
 */
export function decodeRefCode(code: string): DecodedRefCode | null {
    const cleaned = code.trim();
    const m = /^([a-z0-9]{1,3})-(.+)$/i.exec(cleaned);
    if (!m) return null;

    const ref = (m[1] || '').toLowerCase();
    const remainder = m[2] ?? '';
    const prefix = REF_PREFIX_BY_CODE[ref];
    if (!prefix) return null;

    const reconstructed = `${prefix}${remainder}`;
    if (/^https?:\/\//i.test(reconstructed)) {
        return { kind: 'absolute', url: reconstructed };
    }

    // app prefix => path
    const rawPath = reconstructed.startsWith('/') ? reconstructed : `/${reconstructed}`;

    // GitHub Pages + `trailingSlash: true` expects directory-style routes.
    // Ensure we include a trailing slash BEFORE any `?` or `#` so static hosting
    // won't redirect and accidentally drop fragments (which can cause loops/404).
    const idx = rawPath.search(/[?#]/);
    if (idx === -1) {
        return { kind: 'path', path: rawPath };
    }
    const before = rawPath.slice(0, idx);
    const after = rawPath.slice(idx);
    const normalized = before.endsWith('/') ? `${before}${after}` : `${before}/${after}`;
    return { kind: 'path', path: normalized };
}


