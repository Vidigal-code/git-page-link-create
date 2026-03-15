import { compress } from '@/shared/lib/compression';
import { encodePlatformType } from '@/shared/lib/shorturl/typeCodes';
import { withBasePath } from '@/shared/lib/basePath';

export function generateHtmlRenderAllLink(origin: string, html: string): string {
    const compressed = compress(html);
    const fullPath = withBasePath('/ra/');
    return `${origin}${fullPath}#d=${encodePlatformType('html')}-${compressed}`;
}
