/**
 * Generate a unique hash from content using SHA-256
 * @param content - The content to hash
 * @returns Hex string hash (first 8 characters for short URLs)
 */
export async function generateHash(content: string): Promise<string> {
    try {
        // Convert string to Uint8Array
        const encoder = new TextEncoder();
        const data = encoder.encode(content);

        // Generate SHA-256 hash
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);

        // Convert to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Return first 8 characters for short hash
        return hashHex.substring(0, 8);
    } catch (error) {
        console.error('Hash generation error:', error);
        throw new Error('Failed to generate hash');
    }
}

/**
 * Generate a full SHA-256 hash (for collision detection if needed)
 * @param content - The content to hash
 * @returns Full hex string hash
 */
export async function generateFullHash(content: string): Promise<string> {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(content);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
        // console.error('Hash generation error:', error);
        throw new Error('Failed to generate hash');
    }
}
