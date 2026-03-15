export function extractOfficeUrlFromCode(value: string): string {
    const match = value.match(/https?:\/\/[^\s"'<>]+/i);
    return match?.[0] || '';
}

export function resolveOfficeSource(params: {
    officeSourceUrl: string;
    officeCode: string;
}): string {
    const urlValue = params.officeSourceUrl.trim();
    if (urlValue) return urlValue;

    const codeValue = params.officeCode.trim();
    if (!codeValue) return '';

    const extracted = extractOfficeUrlFromCode(codeValue);
    return extracted || codeValue;
}
