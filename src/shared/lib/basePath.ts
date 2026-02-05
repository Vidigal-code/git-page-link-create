/**
 * Helper to handle basePath for assets and fetch calls
 * This ensures that the application works correctly when deployed to GitHub Pages
 * under a subpath (e.g., /git-page-link-create/)
 */

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/git-page-link-create';

/**
 * Prepends the base path to a given path if it's not already prepended
 * @param path The path to prefix (should start with /)
 */
export function withBasePath(path: string): string {
    // If it's already an absolute URL, return it
    if (path.startsWith('http')) {
        return path;
    }

    // Ensure BASE_PATH starts with / and has no trailing slash
    const normalizedBase = BASE_PATH.startsWith('/') ? BASE_PATH : `/${BASE_PATH}`;
    const cleanBase = normalizedBase.endsWith('/') ? normalizedBase.slice(0, -1) : normalizedBase;

    if (path.startsWith(cleanBase)) {
        return path;
    }

    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${cleanBase}${normalizedPath}`;
}
