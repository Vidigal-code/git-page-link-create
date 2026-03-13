export type TemplateMode = 'light' | 'dark' | 'auto';

export interface TemplatePalette {
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    primary: string;
    primaryText: string;
    border: string;
    chip: string;
    shadow: string;
}

export interface TemplateLinksLayout {
    style: 'stacked' | 'glass' | 'minimal' | 'grid';
    containerMaxWidth: number;
    avatarShape: 'circle' | 'rounded' | 'square';
}

export interface TemplateEffects {
    backgroundEffect?: 'aurora' | 'mesh' | 'grid' | 'stars' | 'waves' | 'spotlight';
    hoverEffect?: 'lift' | 'glow' | 'outline' | 'pulse';
}

export interface LinksTemplate {
    id: string;
    name: string;
    description: string;
    layout: TemplateLinksLayout;
    effects?: TemplateEffects;
    modes: {
        light: TemplatePalette;
        dark: TemplatePalette;
    };
}

export type SocialPlatformKey =
    | 'instagram'
    | 'facebook'
    | 'whatsapp'
    | 'telegram'
    | 'x'
    | 'website'
    | 'youtube'
    | 'linkedin'
    | 'tiktok'
    | 'github'
    | 'custom';

export interface SocialLinkInput {
    id: string;
    platform: SocialPlatformKey;
    url: string;
    customLabel?: string;
}

export interface TemplateLinksFormData {
    profileName: string;
    profileBio: string;
    avatarUrl: string;
    websiteUrl: string;
    websiteLabel: string;
    mode: TemplateMode;
    links: SocialLinkInput[];
}

export interface TemplateLinksPayload {
    templateId: string;
    formData: TemplateLinksFormData;
}

