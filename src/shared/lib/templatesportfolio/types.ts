export type PortfolioTemplateMode = 'light' | 'dark' | 'auto';

export interface PortfolioTemplatePalette {
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

export interface PortfolioTemplateLayout {
    style: 'stacked' | 'glass' | 'minimal' | 'grid';
    containerMaxWidth: number;
    imageShape: 'circle' | 'rounded' | 'square';
}

export interface PortfolioTemplateEffects {
    backgroundEffect?: 'aurora' | 'mesh' | 'grid' | 'stars' | 'waves' | 'spotlight';
    hoverEffect?: 'lift' | 'glow' | 'outline' | 'pulse';
}

export interface PortfolioTemplate {
    id: string;
    name: string;
    description: string;
    layout: PortfolioTemplateLayout;
    effects?: PortfolioTemplateEffects;
    modes: {
        light: PortfolioTemplatePalette;
        dark: PortfolioTemplatePalette;
    };
}

export interface PortfolioSocialLink {
    id: string;
    label: string;
    url: string;
}

export interface PortfolioEducationItem {
    id: string;
    title: string;
    institution: string;
    period: string;
    description: string;
    imageUrl: string;
}

export interface PortfolioExperienceItem {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
    current: boolean;
}

export interface PortfolioContact {
    email: string;
    phone: string;
    location: string;
    website: string;
    websiteLabel: string;
}

export interface PortfolioTemplateFormData {
    locale?: 'pt' | 'en' | 'es';
    mode: PortfolioTemplateMode;
    heroName: string;
    heroImageUrl: string;
    heroDescription: string;
    socialLinks: PortfolioSocialLink[];
    educationItems: PortfolioEducationItem[];
    skills: string[];
    experienceItems: PortfolioExperienceItem[];
    contact: PortfolioContact;
    footerText: string;
}

