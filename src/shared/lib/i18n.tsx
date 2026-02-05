import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'pt' | 'en' | 'es';

interface Translations {
    [key: string]: any;
}

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
    isLoading: boolean;
}

const STORAGE_KEY = 'git-page-link-create-locale';
const DEFAULT_LOCALE: Locale = 'pt';

let cachedTranslations: Record<Locale, Translations> = {} as Record<Locale, Translations>;

/**
 * Load translations from JSON files
 */
async function loadTranslations(locale: Locale): Promise<Translations> {
    if (cachedTranslations[locale]) {
        return cachedTranslations[locale];
    }

    try {
        const response = await fetch(`/locales/${locale}.json`);
        const translations = await response.json();
        cachedTranslations[locale] = translations;
        return translations;
    } catch (error) {
        console.error(`Failed to load translations for ${locale}:`, error);
        return {};
    }
}

/**
 * Get a nested translation value by key path
 */
function getNestedValue(obj: any, path: string): string {
    const keys = path.split('.');
    let value = obj;

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return path; // Return key if not found
        }
    }

    return typeof value === 'string' ? value : path;
}

// Create Context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * I18n Provider Component
 */
export function I18nProvider({ children }: { children: ReactNode }): React.ReactElement {
    const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
    const [translations, setTranslations] = useState<Translations>({});
    const [isLoading, setIsLoading] = useState(true);

    // Load locale from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLocale = localStorage.getItem(STORAGE_KEY) as Locale;
            if (savedLocale && ['pt', 'en', 'es'].includes(savedLocale)) {
                setLocaleState(savedLocale);
            }
        }
    }, []);

    // Load translations when locale changes
    useEffect(() => {
        setIsLoading(true);
        loadTranslations(locale).then((trans) => {
            setTranslations(trans);
            setIsLoading(false);
        });
    }, [locale]);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, newLocale);
        }
    };

    const t = (key: string): string => {
        return getNestedValue(translations, key);
    };

    return (
        <I18nContext.Provider value={{ locale, setLocale, t, isLoading }}>
            {children}
        </I18nContext.Provider>
    );
}

/**
 * Hook for internationalization - now uses context
 */
export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

/**
 * Get available locales
 */
export function getAvailableLocales(): { code: Locale; name: string }[] {
    return [
        { code: 'pt', name: 'Português' },
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
    ];
}
