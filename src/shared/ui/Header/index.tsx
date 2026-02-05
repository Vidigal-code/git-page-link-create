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
import { useI18n, getAvailableLocales } from '@/shared/lib/i18n';

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
    const { locale, setLocale, t } = useI18n();
    const locales = getAvailableLocales();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                        {t('home.navTitle')}
                    </StyledNavLink>

                    <StyledNavLink href="/create">
                        {t('create.navTitle')}
                    </StyledNavLink>

                    <Select
                        value={locale}
                        onChange={(e) => setLocale(e.target.value as any)}
                        options={locales.map(l => ({ value: l.code, label: t(`langmenu.${l.code}`) }))}
                        aria-label={t('common.language')}
                        configKey="languageSelect"
                    />

                    {!hideThemeSelector && (
                        <Select
                            value={currentTheme}
                            onChange={(e) => onThemeChange(e.target.value)}
                            options={availableThemes.map(t => ({ value: t.id, label: t.name }))}
                            aria-label={t('common.theme')}
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
                        {t('home.navTitle')}
                    </MobileNavLink>
                    <MobileNavLink href="/create" onClick={closeMobileMenu}>
                        {t('create.navTitle')}
                    </MobileNavLink>
                </MobileNav>

                <MobileControls>
                    <Select
                        value={locale}
                        onChange={(e) => setLocale(e.target.value as any)}
                        options={locales.map(l => ({ value: l.code, label: t(`langmenu.${l.code}`) }))}
                        aria-label={t('common.language')}
                        configKey="languageSelect"
                    />

                    {!hideThemeSelector && (
                        <Select
                            value={currentTheme}
                            onChange={(e) => onThemeChange(e.target.value)}
                            options={availableThemes.map(t => ({ value: t.id, label: t.name }))}
                            aria-label={t('common.theme')}
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
