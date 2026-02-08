import React, { useState } from 'react';
import {
    StyledHeader,
    Logo,
    StyledNavLink,
    Controls,
    HamburgerButton,
    HamburgerLine,
    MobileMenuOverlay,
    MobileMenuContainer,
    MobileNav,
    MobileNavLink,
    CloseButton,
    MobileControls
} from './Header.styles';
import { Select } from '../Select';
import { ThemeModeToggle } from '../ThemeModeToggle';
import { useI18n, getAvailableLocales, Locale } from '@/shared/lib/i18n';

interface HeaderProps {
    currentTheme: string;
    availableThemes: { id: string; name: string }[];
    onThemeChange: (themeId: string) => void;
    currentThemeMode?: 'light' | 'dark';
    supportsLightAndDarkModes?: boolean;
    onToggleLightDark?: () => void;
    hideThemeSelector?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    currentTheme,
    availableThemes,
    onThemeChange,
    currentThemeMode,
    supportsLightAndDarkModes,
    onToggleLightDark,
    hideThemeSelector
}) => {
    const { locale, setLocale, t, isLoading } = useI18n();
    const locales = getAvailableLocales();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const fallbackByLocale = <T extends string>(map: Record<Locale, T>, key: string): string => {
        // Avoid showing raw keys (e.g. "home.navTitle") before translations load.
        if (isLoading) return map[locale] || map.en || key;
        const v = t(key);
        return v === key ? (map[locale] || map.en || key) : v;
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <StyledHeader>
                <Logo href="/">git-page-link-create</Logo>

                {/* Desktop Controls */}
                <Controls>
                    <StyledNavLink href="/">
                        {fallbackByLocale({ en: 'Home', pt: 'Início', es: 'Inicio' }, 'home.navTitle')}
                    </StyledNavLink>

                    <StyledNavLink href="/create">
                        {fallbackByLocale({ en: 'Create', pt: 'Criar', es: 'Crear' }, 'create.navTitle')}
                    </StyledNavLink>

                    <StyledNavLink href="/shorturl-create">
                        {fallbackByLocale({ en: 'Short URL', pt: 'URL Curta', es: 'URL Corta' }, 'shorturlCreate.navTitle')}
                    </StyledNavLink>

                    <Select
                        value={locale}
                        onChange={(e) => setLocale(e.target.value as Locale)}
                        options={locales.map(l => ({
                            value: l.code,
                            label: isLoading
                                ? ({ pt: 'Português', en: 'English', es: 'Español' } as Record<Locale, string>)[l.code]
                                : t(`langmenu.${l.code}`)
                        }))}
                        aria-label={fallbackByLocale({ en: 'Language', pt: 'Idioma', es: 'Idioma' }, 'common.language')}
                        configKey="languageSelect"
                    />

                    {!hideThemeSelector && (
                        <Select
                            value={currentTheme}
                            onChange={(e) => onThemeChange(e.target.value)}
                            options={availableThemes.map(t => ({ value: t.id, label: t.name }))}
                            aria-label={fallbackByLocale({ en: 'Theme', pt: 'Tema', es: 'Tema' }, 'common.theme')}
                            configKey="themeSelect"
                        />
                    )}

                    {supportsLightAndDarkModes && currentThemeMode && onToggleLightDark && (
                        <ThemeModeToggle
                            currentMode={currentThemeMode}
                            onToggle={onToggleLightDark}
                        />
                    )}
                </Controls>

                {/* Hamburger Button (Mobile Only) */}
                <HamburgerButton
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                    isOpen={isMobileMenuOpen}
                >
                    <HamburgerLine isOpen={isMobileMenuOpen} />
                    <HamburgerLine isOpen={isMobileMenuOpen} />
                    <HamburgerLine isOpen={isMobileMenuOpen} />
                </HamburgerButton>
            </StyledHeader>

            {/* Mobile Menu Overlay */}
            <MobileMenuOverlay isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />

            {/* Mobile Menu */}
            <MobileMenuContainer isOpen={isMobileMenuOpen}>
                <CloseButton onClick={closeMobileMenu} aria-label="Close menu">
                    ✕
                </CloseButton>

                <MobileNav>
                    <MobileNavLink href="/" onClick={closeMobileMenu}>
                        {fallbackByLocale({ en: 'Home', pt: 'Início', es: 'Inicio' }, 'home.navTitle')}
                    </MobileNavLink>
                    <MobileNavLink href="/create" onClick={closeMobileMenu}>
                        {fallbackByLocale({ en: 'Create', pt: 'Criar', es: 'Crear' }, 'create.navTitle')}
                    </MobileNavLink>
                    <MobileNavLink href="/shorturl-create" onClick={closeMobileMenu}>
                        {fallbackByLocale({ en: 'Short URL', pt: 'URL Curta', es: 'URL Corta' }, 'shorturlCreate.navTitle')}
                    </MobileNavLink>
                </MobileNav>

                <MobileControls>
                    <Select
                        value={locale}
                        onChange={(e) => setLocale(e.target.value as Locale)}
                        options={locales.map(l => ({
                            value: l.code,
                            label: isLoading
                                ? ({ pt: 'Português', en: 'English', es: 'Español' } as Record<Locale, string>)[l.code]
                                : t(`langmenu.${l.code}`)
                        }))}
                        aria-label={fallbackByLocale({ en: 'Language', pt: 'Idioma', es: 'Idioma' }, 'common.language')}
                        configKey="languageSelect"
                    />

                    {!hideThemeSelector && (
                        <Select
                            value={currentTheme}
                            onChange={(e) => onThemeChange(e.target.value)}
                            options={availableThemes.map(t => ({ value: t.id, label: t.name }))}
                            aria-label={fallbackByLocale({ en: 'Theme', pt: 'Tema', es: 'Tema' }, 'common.theme')}
                            configKey="themeSelect"
                        />
                    )}

                    {supportsLightAndDarkModes && currentThemeMode && onToggleLightDark && (
                        <ThemeModeToggle
                            currentMode={currentThemeMode}
                            onToggle={onToggleLightDark}
                        />
                    )}
                </MobileControls>
            </MobileMenuContainer>
        </>
    );
};
