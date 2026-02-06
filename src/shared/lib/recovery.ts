export type RecoveryInfo = {
    type: string;
    compressedContent: string;
};

/**
 * Extracts the recovery type and compressed content from a hash or a full URL.
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
    try {
        if (cleaned.includes('%')) {
            cleaned = decodeURIComponent(cleaned);
        }
    } catch {
        // Ignore decoding errors
    }

    const separatorIndex = cleaned.indexOf('-');
    if (separatorIndex === -1) {
        return null;
    }

    const type = cleaned.substring(0, separatorIndex);
    const compressedContent = cleaned.substring(separatorIndex + 1);

    if (!type || !compressedContent) {
        return null;
    }

    return { type, compressedContent };
}
