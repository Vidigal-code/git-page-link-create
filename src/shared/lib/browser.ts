export function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

export function getSiteOrigin(): string {
    return isBrowser() ? window.location.origin : '';
}

export function safeLocationReplace(url: string): void {
    if (!isBrowser()) return;
    window.location.replace(url);
}

export function safeOpenUrl(url: string, target: string = '_blank', features?: string): Window | null {
    if (!isBrowser()) return null;
    return window.open(url, target, features);
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
    if (!isBrowser() || !navigator.clipboard) return false;
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}

