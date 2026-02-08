export type PlatformContentType =
    | 'html'
    | 'md'
    | 'csv'
    | 'txt'
    | 'xlsx'
    | 'xls'
    | 'docx'
    | 'pptx'
    | 'doc'
    | 'ppt'
    | 'pdf'
    | 'image'
    | 'video'
    | 'audio'
    | 'chat';

// 1-char codes (lowercase) — keep stable once shipped
export const TYPE_TO_CODE: Readonly<Record<PlatformContentType, string>> = Object.freeze({
    html: 'h',
    md: 'm',
    csv: 'c',
    txt: 't',
    xlsx: 'x',
    xls: 'l',
    docx: 'd',
    pptx: 'p',
    doc: 'D',
    ppt: 'P',
    pdf: 'f',
    image: 'i',
    video: 'v',
    audio: 'a',
    chat: 'k',
});

export const CODE_TO_TYPE: Readonly<Record<string, PlatformContentType>> = Object.freeze(
    Object.entries(TYPE_TO_CODE).reduce<Record<string, PlatformContentType>>((acc, [type, code]) => {
        acc[code] = type as PlatformContentType;
        return acc;
    }, {})
);

/**
 * Encode a platform type to the shortest code when available.
 * Falls back to the original type string if unknown.
 */
export function encodePlatformType(value: string): string {
    const t = value.trim() as PlatformContentType;
    return TYPE_TO_CODE[t] || value;
}

/**
 * Decode a code back to the platform type.
 * If `value` is already a full type, it's returned unchanged.
 */
export function decodePlatformType(value: string): string {
    const v = value.trim();
    return CODE_TO_TYPE[v] || v;
}


