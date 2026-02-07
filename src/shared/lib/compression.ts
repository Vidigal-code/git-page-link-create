import pako from 'pako';
import { base64ToUint8Array, normalizeUrlSafeBase64, uint8ArrayToBase64 } from '@/shared/lib/base64';

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
        const base64 = uint8ArrayToBase64(compressed);

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
        const base64 = normalizeUrlSafeBase64(compressed);
        const bytes = base64ToUint8Array(base64);

        // Decompress using pako
        return pako.ungzip(bytes);
    } catch (error) {
        //console.error('Decompression error:', error);
        throw new Error('Failed to decompress content');
    }
}
