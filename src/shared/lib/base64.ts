const BASE64_CHUNK_SIZE = 0x8000;

export function uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.length; i += BASE64_CHUNK_SIZE) {
        const chunk = bytes.subarray(i, i + BASE64_CHUNK_SIZE);
        binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
}

export function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i += 1) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

/**
 * Converts URL-safe base64 to standard base64 and restores padding.
 * - -> +, _ -> /, adds trailing '=' padding.
 */
export function normalizeUrlSafeBase64(input: string): string {
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return base64;
}


