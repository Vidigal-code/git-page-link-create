export type RecoveryInfo = {
    type: string;
    data: string | Uint8Array;
    isCompressed: boolean;
};

/**
 * Extracts the recovery type and data from a hash or a full URL.
 * Supports both "type-compressed" and direct Data URLs.
 */
export function parseRecoveryHash(hash: string): RecoveryInfo | null {
    let cleaned = hash.trim();

    // Support full URLs (fragment or query param)
    if (cleaned.includes('#data=')) {
        cleaned = cleaned.split('#data=')[1];
    } else if (cleaned.includes('?data=')) {
        cleaned = cleaned.split('?data=')[1];
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
        const type = decodedValue.substring(0, separatorIndex);
        const compressedData = decodedValue.substring(separatorIndex + 1);

        if (type) {
            // Allow empty compressedData for raw rendering support
            return { type, data: compressedData || '', isCompressed: true };
        }
    }

    return null;
}
