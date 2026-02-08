export type RecoveryInfo = {
    type: string;
    data: string | Uint8Array;
    isCompressed: boolean;
};

type ParseRecoveryInputOptions = {
    /**
     * If the input doesn't include a `type-` prefix, we can optionally assume a type.
     * Useful when the user only has the compressed payload (e.g. `H4sIA...`).
     */
    assumedType?: string;
};

import { decodePlatformType } from '@/shared/lib/shorturl/typeCodes';
import { decodeAudioDataUrl } from '@/shared/lib/audio';
import { decodeImageDataUrl } from '@/shared/lib/image';
import { decodePdfDataUrl } from '@/shared/lib/pdf';
import { decodeVideoDataUrl } from '@/shared/lib/video';

const SUPPORTED_PREFIX_TYPES = new Set([
    'html',
    'md',
    'csv',
    'txt',
    'xlsx',
    'xls',
    'docx',
    'pptx',
    'doc',
    'ppt',
    'pdf',
    'image',
    'video',
    'audio',
    'chat',
    // 1-char type codes (shortest links)
    'h',
    'm',
    'c',
    't',
    'x',
    'l',
    'd',
    'p',
    'D',
    'P',
    'f',
    'i',
    'v',
    'a',
    'k',
]);

function stripAllWhitespace(value: string): string {
    return value.replace(/\s+/g, '');
}

function isSupportedPrefixType(value: string): boolean {
    return SUPPORTED_PREFIX_TYPES.has(value);
}

function looksLikeGzipBase64(value: string): boolean {
    const v = stripAllWhitespace(value.trim());
    // Common gzip+base64 prefix for compressed payloads (1F 8B => "H4sI")
    // We accept both standard and URL-safe base64 chars.
    if (!/^H4sI[a-zA-Z0-9\-_+/=]+$/.test(v)) return false;
    // Avoid tiny false positives
    return v.length >= 16;
}

function extractDataParam(value: string, marker: '#data=' | '?data=' | '#d=' | '?d='): string {
    const idx = value.indexOf(marker);
    if (idx === -1) return value;
    let extracted = value.slice(idx + marker.length);
    // Stop at next query param or fragment marker
    const ampIndex = extracted.indexOf('&');
    if (ampIndex !== -1) extracted = extracted.slice(0, ampIndex);
    const hashIndex = extracted.indexOf('#');
    if (hashIndex !== -1) extracted = extracted.slice(0, hashIndex);
    return extracted;
}

function extractDataFromUrlOrSelf(value: string): string {
    const cleaned = value.trim();
    if (cleaned.includes('#d=')) return extractDataParam(cleaned, '#d=');
    if (cleaned.includes('#data=')) return extractDataParam(cleaned, '#data=');
    if (cleaned.includes('?d=')) return extractDataParam(cleaned, '?d=');
    if (cleaned.includes('?data=')) return extractDataParam(cleaned, '?data=');
    return cleaned;
}

function tryDecodeCompactBytesForAssumedType(payload: string, assumedType: string): Uint8Array | null {
    const trimmed = payload.trim();
    const candidate = trimmed.startsWith('b-')
        ? trimmed
        : /^[a-zA-Z0-9\-_]+$/.test(trimmed) && trimmed.length >= 8
            ? `b-${trimmed}`
            : '';

    if (!candidate) return null;

    try {
        if (assumedType === 'pdf') {
            return decodePdfDataUrl(candidate).bytes ?? null;
        }
        if (assumedType === 'image') {
            return decodeImageDataUrl(candidate).bytes ?? null;
        }
        if (assumedType === 'video') {
            return decodeVideoDataUrl(candidate).bytes ?? null;
        }
        if (assumedType === 'audio') {
            return decodeAudioDataUrl(candidate).bytes ?? null;
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Extracts the recovery type and data from a hash or a full URL.
 * Supports both "type-compressed" and direct Data URLs.
 */
export function parseRecoveryHash(hash: string): RecoveryInfo | null {
    let cleaned = hash.trim();

    // Support full URLs (fragment or query param)
    if (cleaned.includes('#d=')) {
        cleaned = extractDataParam(cleaned, '#d=');
    } else if (cleaned.includes('#data=')) {
        cleaned = extractDataParam(cleaned, '#data=');
    } else if (cleaned.includes('?d=')) {
        cleaned = extractDataParam(cleaned, '?d=');
    } else if (cleaned.includes('?data=')) {
        cleaned = extractDataParam(cleaned, '?data=');
    }

    // Handle potential URL encoding
    let decodedValue = cleaned;
    try {
        if (cleaned.includes('%')) {
            decodedValue = decodeURIComponent(cleaned);
        }
    } catch {
        // Ignore decoding errors
    }

    // Case 1: Direct Data URL (data:mime/type;base64,...)
    if (decodedValue.startsWith('data:')) {
        const match = /^data:([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+);base64,(.*)$/.exec(decodedValue);
        if (match) {
            const mimeType = match[1];
            const base64Content = match[2];

            // Map MIME to type
            const typeMapping: Record<string, string> = {
                'application/pdf': 'pdf',
                'video/mp4': 'video',
                'video/webm': 'video',
                'video/x-matroska': 'video',
                'audio/mpeg': 'audio',
                'audio/mp3': 'audio',
                'audio/wav': 'audio',
                'audio/ogg': 'audio',
                'image/png': 'image',
                'image/jpeg': 'image',
                'image/jpg': 'image',
                'image/gif': 'image',
                'image/svg+xml': 'image',
                'text/html': 'html',
                'text/markdown': 'md',
                'text/csv': 'csv',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
                'application/vnd.ms-excel': 'xlsx',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
                'application/msword': 'doc',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
                'application/vnd.ms-powerpoint': 'pptx',
                'text/plain': 'txt',
            };

            const type = typeMapping[mimeType] || (mimeType.startsWith('image/') ? 'image' : 'txt');

            // Convert base64 to Uint8Array
            try {
                const binString = atob(base64Content);
                const bytes = new Uint8Array(binString.length);
                for (let i = 0; i < binString.length; i++) {
                    bytes[i] = binString.charCodeAt(i);
                }
                return { type, data: bytes, isCompressed: false };
            } catch {
                return null;
            }
        }
    }

    // Case 2: Prefix-compressed format (type-compressedData)
    const separatorIndex = decodedValue.indexOf('-');
    if (separatorIndex !== -1) {
        let type = decodedValue.substring(0, separatorIndex).trim();
        const compressedData = stripAllWhitespace(decodedValue.substring(separatorIndex + 1));

        if (type && isSupportedPrefixType(type)) {
            // Normalize 1-char codes -> full type strings
            type = decodePlatformType(type);
            // Allow empty compressedData for raw rendering support
            return { type, data: compressedData || '', isCompressed: true };
        }
    }

    return null;
}

/**
 * More flexible parser for recovery inputs:
 * - Full URLs containing `#data=` or `?data=`
 * - `type-compressedPayload`
 * - Direct Data URLs
 * - Raw compressed payload (`H4sIA...`) if `assumedType` is provided
 */
export function parseRecoveryInput(input: string, options: ParseRecoveryInputOptions = {}): RecoveryInfo | null {
    const parsed = parseRecoveryHash(input);
    if (parsed) return parsed;

    // Normalize assumedType if user provides 1-char code
    const assumedType = options.assumedType ? decodePlatformType(options.assumedType.trim()) : undefined;

    // Support compact bytes payloads used by media renderers: `b-<base64url>`.
    // Users may paste a full URL (`...#d=b-...`) or just the payload (`b-...`) or even the raw base64url part.
    if (assumedType && ['pdf', 'image', 'video', 'audio'].includes(assumedType)) {
        const extracted = extractDataFromUrlOrSelf(input);
        const bytes = tryDecodeCompactBytesForAssumedType(extracted, assumedType);
        if (bytes) {
            return { type: assumedType, data: bytes, isCompressed: false };
        }
    }

    if (assumedType && looksLikeGzipBase64(input)) {
        return { type: assumedType, data: stripAllWhitespace(input.trim()), isCompressed: true };
    }

    return null;
}
