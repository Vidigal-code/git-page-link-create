import { withBasePath } from '@/shared/lib/basePath';
import { PortfolioTemplate } from './types';

const TEMPLATE_FILES = Array.from({ length: 20 }, (_, index) => {
    const number = String(index + 1).padStart(2, '0');
    return `/layouts/templatesportfolio/template-${number}.json`;
});

let cache: PortfolioTemplate[] | null = null;

export async function loadTemplatesPortfolio(): Promise<PortfolioTemplate[]> {
    if (cache) return cache;
    const loaded = await Promise.all(
        TEMPLATE_FILES.map(async (path) => {
            const response = await fetch(withBasePath(path));
            if (!response.ok) {
                throw new Error(`Failed to load template: ${path}`);
            }
            return (await response.json()) as PortfolioTemplate;
        }),
    );
    cache = loaded;
    return loaded;
}

