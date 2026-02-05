import React, { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@/shared/styles/GlobalStyle';
import { Layout } from '@/shared/ui/Layout';
import { I18nProvider } from '@/shared/lib/i18n';
import { loadTheme, loadAvailableThemes, getSavedThemeId, saveThemeId, getOppositeModeThemeId, getAvailableThemes, getHideThemeSelector } from '@/shared/lib/theme';
import { Theme } from '@/shared/styles/theme.d';

export default function App({ Component, pageProps }: AppProps) {
    const [theme, setTheme] = useState<Theme | null>(null);
    const [currentThemeId, setCurrentThemeId] = useState<string>('matrix-dark');
    const [availableThemes, setAvailableThemes] = useState<{ id: string; name: string }[]>([]);
    const [hideThemeSelector, setHideThemeSelector] = useState(false);

    useEffect(() => {
        // Load saved theme ID
        const savedThemeId = getSavedThemeId();
        setCurrentThemeId(savedThemeId);

        // Load theme and available themes
        Promise.all([
            loadTheme(savedThemeId),
            loadAvailableThemes()
        ]).then(([loadedTheme, themes]) => {
            setTheme(loadedTheme);
            setAvailableThemes(themes.map(t => ({ id: t.id, name: t.name })));
            setHideThemeSelector(getHideThemeSelector());
        });
    }, []);

    const handleThemeChange = async (themeId: string) => {
        const newTheme = await loadTheme(themeId);
        setTheme(newTheme);
        setCurrentThemeId(themeId);
        saveThemeId(themeId);
    };

    const handleToggleLightDark = async () => {
        const oppositeThemeId = getOppositeModeThemeId(currentThemeId);
        if (oppositeThemeId) {
            await handleThemeChange(oppositeThemeId);
        }
    };

    if (!theme) {
        return null; // Or a loading spinner
    }

    const router = useRouter(); // You'll need to import useRouter
    const isRenderAll = router.pathname.startsWith('/render-all');

    return (
        <I18nProvider>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                {isRenderAll ? (
                    <Component {...pageProps} />
                ) : (
                    <Layout
                        currentTheme={currentThemeId}
                        availableThemes={availableThemes}
                        onThemeChange={handleThemeChange}
                        currentThemeMode={theme.mode}
                        supportsLightAndDarkModes={theme.supportsLightAndDarkModes}
                        onToggleLightDark={handleToggleLightDark}
                        hideThemeSelector={hideThemeSelector}
                    >
                        <Component {...pageProps} />
                    </Layout>
                )}
            </ThemeProvider>
        </I18nProvider>
    );
}
