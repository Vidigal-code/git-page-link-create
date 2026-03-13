import { withBasePath } from '@/shared/lib/basePath';
import { LinksTemplate } from './types';

const TEMPLATE_FILES = Array.from({ length: 20 }, (_, index) => {
    const number = String(index + 1).padStart(2, '0');
    return `/layouts/templateslinks/template-${number}.json`;
});

let cache: LinksTemplate[] | null = null;

export async function loadTemplatesLinks(): Promise<LinksTemplate[]> {
    if (cache) return cache;

    const loaded = await Promise.all(
        TEMPLATE_FILES.map(async (path) => {
            const response = await fetch(withBasePath(path));
            if (!response.ok) {
                throw new Error(`Failed to load template: ${path}`);
            }
            return (await response.json()) as LinksTemplate;
        }),
    );

    cache = loaded;
    return loaded;
}

export async function loadTemplateById(templateId: string): Promise<LinksTemplate | null> {
    const templates = await loadTemplatesLinks();
    return templates.find((item) => item.id === templateId) || null;
}

