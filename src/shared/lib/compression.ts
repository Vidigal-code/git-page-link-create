import pako from 'pako';

const BASE64_CHUNK_SIZE = 0x8000;

function bytesToBase64(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.length; i += BASE64_CHUNK_SIZE) {
        const chunk = bytes.subarray(i, i + BASE64_CHUNK_SIZE);
        binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
}

/**
 * Compress a string using gzip compression (browser-safe) and URL-safe base64
 * @param content - The string content to compress
 * @returns URL-safe Base64-encoded compressed string
 */
export function compress(content: string): string {
    const uint8Array = new TextEncoder().encode(content);
    return compressBytes(uint8Array);
}

/**
 * Compress bytes using gzip and URL-safe base64
 * @param bytes - The data bytes to compress
 * @returns URL-safe Base64-encoded compressed string
 */
export function compressBytes(bytes: Uint8Array): string {
    try {
        // Compress using pako (gzip)
        const compressed = pako.gzip(bytes);

        // Convert to base64
    const base64 = bytesToBase64(compressed);

        // Make URL safe: + -> -, / -> _, remove =
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (error) {
        //console.error('Compression error:', error);
        throw new Error('Failed to compress content');
    }
}

/**
 * Decompress a URL-safe base64-encoded gzip string
 * @param compressed - URL-safe Base64-encoded compressed string
 * @returns Original decompressed string
 */
export function decompress(compressed: string): string {
    const decompressed = decompressBytes(compressed);
    return new TextDecoder().decode(decompressed);
}

/**
 * Decompress a URL-safe base64-encoded gzip string to bytes
 * @param compressed - URL-safe Base64-encoded compressed string
 * @returns Original decompressed bytes
 */
export function decompressBytes(compressed: string): Uint8Array {
    try {
        // Restore standard base64: - -> +, _ -> /
        let base64 = compressed.replace(/-/g, '+').replace(/_/g, '/');

        // Add padding if needed
        while (base64.length % 4) {
            base64 += '=';
        }

        // Convert base64 to Uint8Array
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Decompress using pako
        return pako.ungzip(bytes);
    } catch (error) {
        //console.error('Decompression error:', error);
        throw new Error('Failed to decompress content');
    }
}
