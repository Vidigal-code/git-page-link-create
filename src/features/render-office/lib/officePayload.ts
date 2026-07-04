import { decompressBytes } from '@/shared/lib/compression';
import { decodePlatformType } from '@/shared/lib/shorturl/typeCodes';

const OFFICE_PAYLOAD_SEPARATOR = '-';

export interface DecodedOfficePayload {
    type: string;
    bytes: Uint8Array;
}

export function decodeOfficePayload(payload: string): DecodedOfficePayload | null {
    const separatorIndex = payload.indexOf(OFFICE_PAYLOAD_SEPARATOR);
    if (separatorIndex < 0) return null;

    const rawType = payload.slice(0, separatorIndex);
    const compressedContent = payload.slice(separatorIndex + OFFICE_PAYLOAD_SEPARATOR.length);
    if (!rawType || !compressedContent) return null;

    return {
        type: decodePlatformType(rawType),
        bytes: decompressBytes(compressedContent),
    };
}
