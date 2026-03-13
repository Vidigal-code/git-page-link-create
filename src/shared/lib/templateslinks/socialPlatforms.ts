import { SocialLinkInput, SocialPlatformKey } from './types';

interface SocialPlatformConfig {
    key: SocialPlatformKey;
    label: string;
    placeholder: string;
    baseUrl?: string;
}

export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
    { key: 'instagram', label: 'Instagram', placeholder: '@usuario ou URL', baseUrl: 'https://instagram.com/' },
    { key: 'facebook', label: 'Facebook', placeholder: 'usuario ou URL', baseUrl: 'https://facebook.com/' },
    { key: 'whatsapp', label: 'WhatsApp', placeholder: '+5511999999999 ou URL' },
    { key: 'telegram', label: 'Telegram', placeholder: '@usuario ou URL', baseUrl: 'https://t.me/' },
    { key: 'x', label: 'X', placeholder: '@usuario ou URL', baseUrl: 'https://x.com/' },
    { key: 'website', label: 'Website', placeholder: 'https://site.com' },
    { key: 'youtube', label: 'YouTube', placeholder: 'canal ou URL', baseUrl: 'https://youtube.com/' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'in/usuario ou URL', baseUrl: 'https://linkedin.com/' },
    { key: 'tiktok', label: 'TikTok', placeholder: '@usuario ou URL', baseUrl: 'https://tiktok.com/@' },
    { key: 'github', label: 'GitHub', placeholder: 'usuario ou URL', baseUrl: 'https://github.com/' },
    { key: 'custom', label: 'Personalizado', placeholder: 'https://seu-link.com' },
];

function sanitizeHandle(value: string): string {
    return value.trim().replace(/^@+/, '').replace(/^\/+/, '');
}

function ensureAbsoluteUrl(url: string): string {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url.replace(/^\/+/, '')}`;
}

function normalizeWhatsapp(value: string): string {
    if (/^https?:\/\//i.test(value)) return value;
    const digits = value.replace(/[^\d]/g, '');
    if (!digits) return '';
    return `https://wa.me/${digits}`;
}

function normalizeFromBase(baseUrl: string, value: string, platform: SocialPlatformKey): string {
    if (/^https?:\/\//i.test(value)) return value;
    const clean = sanitizeHandle(value);
    if (!clean) return '';

    if (platform === 'linkedin' && clean.startsWith('in/')) {
        return `${baseUrl}${clean}`;
    }
    if (platform === 'tiktok' && clean.startsWith('@')) {
        return `https://tiktok.com/${clean}`;
    }
    return `${baseUrl}${clean}`;
}

export function normalizeSocialLink(input: SocialLinkInput): SocialLinkInput {
    const rawUrl = input.url.trim();
    if (!rawUrl) return { ...input, url: '' };

    const config = SOCIAL_PLATFORMS.find((item) => item.key === input.platform);
    let normalized = rawUrl;

    if (input.platform === 'whatsapp') {
        normalized = normalizeWhatsapp(rawUrl);
    } else if (input.platform === 'website' || input.platform === 'custom') {
        normalized = ensureAbsoluteUrl(rawUrl);
    } else if (config?.baseUrl) {
        normalized = normalizeFromBase(config.baseUrl, rawUrl, input.platform);
    } else {
        normalized = ensureAbsoluteUrl(rawUrl);
    }

    return { ...input, url: normalized };
}

export function isValidHttpUrl(value: string): boolean {
    if (!value) return false;
    try {
        const parsed = new URL(value);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

export function getSocialPlatformLabel(platform: SocialPlatformKey, customLabel?: string): string {
    if (platform === 'custom') {
        return customLabel?.trim() || 'Link';
    }
    return SOCIAL_PLATFORMS.find((item) => item.key === platform)?.label || platform;
}

