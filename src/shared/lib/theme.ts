import { Theme } from '../styles/theme.d';
import { withBasePath } from './basePath';

const STORAGE_KEY = 'git-page-link-create-theme';
const DEFAULT_THEME_ID = 'matrix-dark';
let defaultThemeId = DEFAULT_THEME_ID;

const cachedThemes: Record<string, Theme> = {};
let hideThemeSelector = false;
let maxUrlLength = 8000;
let maxHtmlUrlLength = 8000;
let maxMarkdownUrlLength = 8000;
let maxCsvUrlLength = 8000;
let maxXlsxUrlLength = 8000;
let maxImageUrlLength = 8000;
let maxPdfUrlLength = 8000;
let maxVideoUrlLength = 8000;
let maxAudioUrlLength = 8000;
let maxOfficeUrlLength = 8000;
let shortUrlRedirectDelaySeconds = 5;
let availableThemes: {
    id: string;
    name: string;
    file: string;
    preview: string;
    supportsLightAndDarkModes?: boolean;
    supportsLightAndDarkModesReference?: string;
    mode?: 'light' | 'dark';
}[] = [];

/**
 * Load the list of available themes
 */
export async function loadAvailableThemes(): Promise<typeof availableThemes> {
    if (availableThemes.length > 0) {
        return availableThemes;
    }

    try {
        const url = withBasePath('/layouts/layoutsConfig.json');
        const response = await fetch(url);
        const data = await response.json();
    availableThemes = data.layouts || [];
    hideThemeSelector = data.HideThemeSelector || false;
    defaultThemeId = data.ThemeDefault || data.default || DEFAULT_THEME_ID;
        maxUrlLength = data.MaxUrlLength || 8000;
        maxHtmlUrlLength = data.MaxHtmlUrlLength || maxUrlLength;
        maxMarkdownUrlLength = data.MaxMarkdownUrlLength || maxUrlLength;
        maxCsvUrlLength = data.MaxCsvUrlLength || maxUrlLength;
        maxXlsxUrlLength = data.MaxXlsxUrlLength || maxUrlLength;
        maxImageUrlLength = data.MaxImageUrlLength || maxUrlLength;
        maxPdfUrlLength = data.MaxPdfUrlLength || maxUrlLength;
        maxVideoUrlLength = data.MaxVideoUrlLength || maxUrlLength;
        maxAudioUrlLength = data.MaxAudioUrlLength || maxUrlLength;
    maxOfficeUrlLength = data.MaxOfficeUrlLength || maxUrlLength;
        shortUrlRedirectDelaySeconds = Number.isFinite(data.ShortUrlRedirectDelaySeconds)
            ? Math.max(0, Math.min(60, Math.floor(data.ShortUrlRedirectDelaySeconds)))
            : 5;
        return availableThemes;
    } catch {
        return [];
    }
}

/**
 * Load a specific theme by ID
 */
export async function loadTheme(themeId: string): Promise<Theme> {
    if (cachedThemes[themeId]) {
        return cachedThemes[themeId];
    }

    try {
        // Ensure themes are loaded to get the file path
        if (availableThemes.length === 0) {
            await loadAvailableThemes();
        }

        const themeInfo = availableThemes.find(t => t.id === themeId);
        const url = themeInfo?.file
            ? withBasePath(`/layouts/${themeInfo.file}`)
            : withBasePath(`/layouts/templates/${themeId}.json`);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const theme: Theme = await response.json();
        cachedThemes[themeId] = theme;
        return theme;
    } catch {
        // Return default theme if loading fails
        if (themeId !== DEFAULT_THEME_ID) {
            return loadDefaultTheme();
        }
        throw new Error('Failed to load theme'); // Prevent infinite loop if default theme fails
    }
}

/**
 * Load the default theme
 */
export async function loadDefaultTheme(): Promise<Theme> {
    return loadTheme(defaultThemeId);
}

/**
 * Get the saved theme ID from localStorage
 */
export function getSavedThemeId(): string {
    if (typeof window === 'undefined') return defaultThemeId;
    return localStorage.getItem(STORAGE_KEY) || defaultThemeId;
}

/**
 * Resolve the initial theme ID, honoring layoutsConfig defaults.
 */
export async function getInitialThemeId(): Promise<string> {
    if (availableThemes.length === 0) {
        await loadAvailableThemes();
    }
    if (typeof window === 'undefined') return defaultThemeId;
    return localStorage.getItem(STORAGE_KEY) || defaultThemeId;
}

/**
 * Save the theme ID to localStorage
 */
export function saveThemeId(themeId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, themeId);
}

/**
 * Get available themes
 */
export function getAvailableThemes() {
    return availableThemes;
}

/**
 * Get the configured default theme ID
 */
export function getDefaultThemeId(): string {
    return defaultThemeId;
}

/**
 * Get the opposite mode theme ID (light <-> dark)
 * Returns null if theme doesn't support light/dark modes
 */
export function getOppositeModeThemeId(currentThemeId: string): string | null {
    const currentTheme = availableThemes.find(t => t.id === currentThemeId);

    if (!currentTheme || !currentTheme.supportsLightAndDarkModes) {
        return null;
    }

    // Extract the reference base (e.g., "matrix-1" from "matrix-1-dark")
    const reference = currentTheme.supportsLightAndDarkModesReference;
    if (!reference) return null;

    const referenceBase = reference.replace(/-dark$|-light$/, '');
    const currentMode = currentTheme.mode;
    const oppositeMode = currentMode === 'dark' ? 'light' : 'dark';

    // Find theme with same reference base but opposite mode
    const oppositeTheme = availableThemes.find(t =>
        t.supportsLightAndDarkModesReference?.startsWith(referenceBase) &&
        t.mode === oppositeMode
    );


    return oppositeTheme?.id || null;
}

/**
 * Get whether the theme selector should be hidden
 */
export function getHideThemeSelector(): boolean {
    return hideThemeSelector;
}

/**
 * Get the maximum allowed URL length
 */
export function getMaxUrlLength(): number {
    return maxUrlLength;
}

/**
 * Get the maximum allowed URL length for HTML links
 */
export function getMaxHtmlUrlLength(): number {
    return maxHtmlUrlLength;
}

/**
 * Get the maximum allowed URL length for Markdown links
 */
export function getMaxMarkdownUrlLength(): number {
    return maxMarkdownUrlLength;
}

/**
 * Get the maximum allowed URL length for CSV links
 */
export function getMaxCsvUrlLength(): number {
    return maxCsvUrlLength;
}

/**
 * Get the maximum allowed URL length for XLSX links
 */
export function getMaxXlsxUrlLength(): number {
    return maxXlsxUrlLength;
}

/**
 * Get the maximum allowed URL length for image links
 */
export function getMaxImageUrlLength(): number {
    return maxImageUrlLength;
}

/**
 * Get the maximum allowed URL length for PDF links
 */
export function getMaxPdfUrlLength(): number {
    return maxPdfUrlLength;
}

/**
 * Get the maximum allowed URL length for video links
 */
export function getMaxVideoUrlLength(): number {
    return maxVideoUrlLength;
}

/**
 * Get the maximum allowed URL length for audio links
 */
export function getMaxAudioUrlLength(): number {
    return maxAudioUrlLength;
}

/**
 * Get the maximum allowed URL length for Office links
 */
export function getMaxOfficeUrlLength(): number {
    return maxOfficeUrlLength;
}

/**
 * Get the redirect delay (seconds) used by `/shorturl` when the shared link requests
 * non-silent mode (`?z=0`).
 */
export function getShortUrlRedirectDelaySeconds(): number {
    return shortUrlRedirectDelaySeconds;
}

