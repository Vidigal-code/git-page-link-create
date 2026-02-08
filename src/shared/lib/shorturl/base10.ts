const BASE = 10_000_000; // 1e7 (fits safely in JS number operations we do)
const BASE_DIGITS = 7;

function trimLeadingZerosLE(n: number[]): void {
    while (n.length > 0 && n[n.length - 1] === 0) n.pop();
}

function isZeroLE(n: number[]): boolean {
    return n.length === 0 || (n.length === 1 && n[0] === 0);
}

/**
 * Converts bytes (big-endian) to a base10 string.
 *
 * Implementation uses a big-integer represented as base 1e7 limbs (little-endian).
 * This is deterministic and reversible and does NOT use BigInt (better browser support).
 */
export function bytesToDecimalString(bytes: Uint8Array): string {
    if (bytes.length === 0) return '0';

    // limbs little-endian in base BASE
    const limbs: number[] = [0];

    for (let idx = 0; idx < bytes.length; idx += 1) {
        let carry = bytes[idx];
        for (let i = 0; i < limbs.length; i += 1) {
            const x = limbs[i] * 256 + carry;
            limbs[i] = x % BASE;
            carry = Math.floor(x / BASE);
        }
        while (carry > 0) {
            limbs.push(carry % BASE);
            carry = Math.floor(carry / BASE);
        }
    }

    // Convert limbs -> string
    let out = String(limbs[limbs.length - 1] ?? 0);
    for (let i = limbs.length - 2; i >= 0; i -= 1) {
        out += String(limbs[i]).padStart(BASE_DIGITS, '0');
    }
    return out;
}

/**
 * Converts a base10 string back to bytes (big-endian).
 *
 * If `expectedLength` is provided, the resulting byte array is left-padded with zeros
 * to match it (and errors if the decoded number needs more bytes than expected).
 */
export function decimalStringToBytes(decimal: string, expectedLength?: number): Uint8Array {
    const cleaned = decimal.trim();
    if (!/^\d+$/.test(cleaned)) {
        throw new Error('Invalid decimal payload (digits only expected)');
    }
    if (cleaned === '' || cleaned === '0') {
        const empty = new Uint8Array(expectedLength ?? 0);
        return empty;
    }

    // Parse into base BASE limbs little-endian
    const limbs: number[] = [];
    for (let i = cleaned.length; i > 0; i -= BASE_DIGITS) {
        const start = Math.max(0, i - BASE_DIGITS);
        limbs.push(Number(cleaned.slice(start, i)));
    }
    trimLeadingZerosLE(limbs);

    const bytes: number[] = [];
    while (!isZeroLE(limbs)) {
        let rem = 0;
        for (let i = limbs.length - 1; i >= 0; i -= 1) {
            const x = limbs[i] + rem * BASE; // safe: rem<256 => x < 2.6e9
            const q = Math.floor(x / 256);
            rem = x % 256;
            limbs[i] = q;
        }
        bytes.push(rem);
        trimLeadingZerosLE(limbs);
    }

    bytes.reverse();

    if (typeof expectedLength === 'number') {
        if (bytes.length > expectedLength) {
            throw new Error('Decoded bytes exceed expected length');
        }
        if (bytes.length < expectedLength) {
            const padded = new Uint8Array(expectedLength);
            padded.set(bytes, expectedLength - bytes.length);
            return padded;
        }
    }

    return new Uint8Array(bytes);
}


