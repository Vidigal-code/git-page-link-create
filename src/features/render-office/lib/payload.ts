const OFFICE_HASH_DATA_KEYS = ['data', 'd'] as const;

export function getOfficeHashPayload(hash: string): string {
    const normalizedHash = hash.startsWith('#') ? hash.slice(1) : hash;
    const params = new URLSearchParams(normalizedHash);

    for (const key of OFFICE_HASH_DATA_KEYS) {
        const payload = params.get(key);
        if (payload) return payload;
    }

    return '';
}

export function hasOfficeDataPayload(hash: string): boolean {
    return Boolean(getOfficeHashPayload(hash));
}
