export type JobTemplateMode = 'light' | 'dark' | 'auto';

export type JobWorkModel = 'remote' | 'hybrid' | 'onsite' | 'custom';
export type JobSalaryCurrency = 'BRL' | 'USD' | 'EUR' | 'custom';

export interface JobTemplatePalette {
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

export interface JobTemplateLayout {
    style: 'stacked' | 'glass' | 'minimal' | 'grid';
    containerMaxWidth: number;
    imageShape: 'circle' | 'rounded' | 'square';
}

export interface JobTemplateEffects {
    backgroundEffect?: 'aurora' | 'mesh' | 'grid' | 'stars' | 'waves' | 'spotlight';
    hoverEffect?: 'lift' | 'glow' | 'outline' | 'pulse';
}

export interface JobTemplate {
    id: string;
    name: string;
    description: string;
    layout: JobTemplateLayout;
    effects?: JobTemplateEffects;
    modes: {
        light: JobTemplatePalette;
        dark: JobTemplatePalette;
    };
}

export interface JobTemplateFormData {
    locale?: 'pt' | 'en' | 'es';
    mode: JobTemplateMode;
    companyName: string;
    companyWebsiteUrl: string;
    recruiterWhatsapp: string;
    recruiterEmail: string;
    jobTitle: string;
    jobDescription: string;
    descriptionFonts?: string[];
    workModel: JobWorkModel;
    customWorkModel: string;
    contractModel: string;
    workSchedule: string;
    salary: string;
    salaryCurrency: JobSalaryCurrency;
    salaryCustomCurrency: string;
    applyUrl: string;
    applyLabel: string;
    coverImageUrl: string;
    tags: string[];
}

