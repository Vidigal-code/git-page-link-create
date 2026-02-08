import React, { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@/shared/styles/GlobalStyle';
import { Layout } from '@/shared/ui/Layout';
import { I18nProvider } from '@/shared/lib/i18n';
import { loadTheme, loadAvailableThemes, getDefaultThemeId, getInitialThemeId, saveThemeId, getOppositeModeThemeId, getHideThemeSelector } from '@/shared/lib/theme';
import { Theme } from '@/shared/styles/theme.d';

export default function App({ Component, pageProps }: AppProps) {
    const [theme, setTheme] = useState<Theme | null>(null);
    const [currentThemeId, setCurrentThemeId] = useState<string>(getDefaultThemeId());
    const [availableThemes, setAvailableThemes] = useState<{ id: string; name: string }[]>([]);
    const [hideThemeSelector, setHideThemeSelector] = useState(false);
    const router = useRouter();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const ogImageUrl = 'https://raw.githubusercontent.com/Vidigal-code/git-page-link-create/b09cfd263b712ab97ab4dc8e5a779ecb8cbdbe25/public/icon-site/icon.svg';
    const defaultDescription = 'Create permanent links for HTML, Markdown, CSV/XLS, images, PDFs, and QR codes with a static Next.js app.';
    const canonicalUrl = siteUrl ? `${siteUrl}${router.asPath.split('#')[0]}` : '';

    useEffect(() => {
        const initTheme = async () => {
            const initialThemeId = await getInitialThemeId();
            setCurrentThemeId(initialThemeId);

            const [loadedTheme, themes] = await Promise.all([
                loadTheme(initialThemeId),
                loadAvailableThemes()
            ]);

            setTheme(loadedTheme);
            setAvailableThemes(themes.map(t => ({ id: t.id, name: t.name })));
            setHideThemeSelector(getHideThemeSelector());
        };

        void initTheme();
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
    const asPath = router.asPath || '';
    const isRenderAll = router.pathname.startsWith('/render-all') || router.pathname === '/ra';
    const isPdfFullscreen = router.pathname === '/render/pdf' && (router.query.fullscreen === '1' || router.query.fullscreen === 'true');
    const isVideoFullscreen = router.pathname === '/render/video' && (router.query.fullscreen === '1' || router.query.fullscreen === 'true');
    const isAudioFullscreen = router.pathname === '/render/audio' && (router.query.fullscreen === '1' || router.query.fullscreen === 'true');
    const isOfficeFullscreen = router.pathname === '/render/office' && (router.query.fullscreen === '1' || router.query.fullscreen === 'true');
    const hasShortUrlCode = router.pathname === '/shorturl'
        && (
            typeof router.query.c === 'string'
            || typeof router.query.code === 'string'
            // hydration-safe fallback (prevents UI flash on first render)
            || /[?&](?:c|code)=/i.test(asPath)
            || /#(?:c|code)=/i.test(asPath)
        );
    const zParam = router.query.z;
    const zFromAsPath = /[?&]z=([01])\b/i.exec(asPath)?.[1];
    const z = typeof zParam === 'string'
        ? zParam
        : Array.isArray(zParam)
            ? zParam[0]
            : zFromAsPath;
    const isShortUrlSilent = (() => {
        // Global: shared-link flag wins
        if (z === '1') return true;
        if (z === '0') return false;
        if (typeof window === 'undefined') return false;
        try {
            const saved = window.localStorage.getItem('shorturlCreate.instantRenderer');
            return saved !== '0'; // default: enabled
        } catch {
            return true;
        }
    })();
    const isShortUrlBlankRedirect = hasShortUrlCode && isShortUrlSilent;

    // On GitHub Pages deep-links, the app may boot on `/404` first and immediately recover.
    // If the shared link requests silent mode (`?z=1`), avoid flashing the Layout/header.
    const isSilent404Recovery = (router.pathname === '/404' || router.pathname === '/_error')
        && /[?&]z=1\b/.test(asPath)
        && /\/(?:s|shorturl|render|render-all|r|ra)\//.test(asPath);

    return (
        <I18nProvider>
            <ThemeProvider theme={theme}>
                <Head>
                    <meta name="description" content={defaultDescription} />
                    {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
                    <meta property="og:type" content="website" />
                    <meta property="og:site_name" content="git-page-link-create" />
                    <meta property="og:title" content="git-page-link-create" />
                    <meta property="og:description" content={defaultDescription} />
                    {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
                    <meta property="og:image" content={ogImageUrl} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="git-page-link-create" />
                    <meta name="twitter:description" content={defaultDescription} />
                    <meta name="twitter:image" content={ogImageUrl} />
                </Head>
                <GlobalStyle />
                {isRenderAll || isPdfFullscreen || isVideoFullscreen || isAudioFullscreen || isOfficeFullscreen || isShortUrlBlankRedirect || isSilent404Recovery ? (
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
