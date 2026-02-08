import { base64ToUint8Array, normalizeUrlSafeBase64, uint8ArrayToBase64 } from '@/shared/lib/base64';

function toBase64Url(base64: string): string {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64url: string): string {
    return normalizeUrlSafeBase64(b64url);
}

export function encodeTypedBytesPayload(typeId: number, bytes: Uint8Array): string {
    if (!Number.isInteger(typeId) || typeId < 0 || typeId > 255) {
        throw new Error('Invalid type id');
    }
    const packed = new Uint8Array(1 + bytes.length);
    packed[0] = typeId;
    packed.set(bytes, 1);
    const b64 = uint8ArrayToBase64(packed);
    return `b-${toBase64Url(b64)}`;
}

export function decodeTypedBytesPayload(payload: string): { typeId: number; bytes: Uint8Array } | null {
    const cleaned = payload.trim();
    if (!cleaned.startsWith('b-')) return null;
    const b64url = cleaned.slice(2);
    if (!/^[a-zA-Z0-9\-_]+$/.test(b64url)) return null;
    const b64 = fromBase64Url(b64url);
    const packed = base64ToUint8Array(b64);
    if (packed.length < 1) return null;
    return { typeId: packed[0] ?? 0, bytes: packed.slice(1) };
}


