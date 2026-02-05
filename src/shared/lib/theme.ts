import { Theme } from '../styles/theme.d';
import { withBasePath } from './basePath';

const STORAGE_KEY = 'git-page-link-create-theme';
const DEFAULT_THEME_ID = 'matrix-dark';

const cachedThemes: Record<string, Theme> = {};
let hideThemeSelector = false;
let maxUrlLength = 8000;
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
        maxUrlLength = data.MaxUrlLength || 8000;
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
    return loadTheme(DEFAULT_THEME_ID);
}

/**
 * Get the saved theme ID from localStorage
 */
export function getSavedThemeId(): string {
    if (typeof window === 'undefined') return DEFAULT_THEME_ID;
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME_ID;
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

