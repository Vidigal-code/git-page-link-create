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

function extractDataParam(value: string, marker: '#data=' | '?data='): string {
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

/**
 * Extracts the recovery type and data from a hash or a full URL.
 * Supports both "type-compressed" and direct Data URLs.
 */
export function parseRecoveryHash(hash: string): RecoveryInfo | null {
    let cleaned = hash.trim();

    // Support full URLs (fragment or query param)
    if (cleaned.includes('#data=')) {
        cleaned = extractDataParam(cleaned, '#data=');
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
        const type = decodedValue.substring(0, separatorIndex).trim();
        const compressedData = stripAllWhitespace(decodedValue.substring(separatorIndex + 1));

        if (type && isSupportedPrefixType(type)) {
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

    const assumedType = options.assumedType?.trim();
    if (assumedType && looksLikeGzipBase64(input)) {
        return { type: assumedType, data: stripAllWhitespace(input.trim()), isCompressed: true };
    }

    return null;
}
