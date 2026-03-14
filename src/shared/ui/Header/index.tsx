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
import { useRouter } from 'next/router';

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
    const router = useRouter();
    const locales = getAvailableLocales();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const tl = (key: string) => (isLoading ? '' : t(key));
    const tlOr = (key: string, fallback: string) => {
        const value = tl(key);
        return !value || value === key ? fallback : value;
    };
    const createDropdownValue = (
        router.pathname === '/shorturl-create'
            ? '/shorturl-create'
            : router.pathname === '/create-links'
                ? '/create-links'
                : router.pathname === '/create-jobs'
                    ? '/create-jobs'
                    : router.pathname === '/create-portfolio'
                        ? '/create-portfolio'
                        : router.pathname === '/create'
                            ? '/create'
                            : '__create-menu__'
    );
    const createDropdownOptions = [
        { value: '__create-menu__', label: tlOr('create.navTitle', 'Create') },
        { value: '/create', label: tlOr('headerDropdown.createPage', 'Create Content') },
        { value: '/shorturl-create', label: tlOr('headerDropdown.shortUrlPage', 'Create Short URL') },
        { value: '/create-links', label: tlOr('headerDropdown.createLinksPage', 'Create Links') },
        { value: '/create-jobs', label: tlOr('headerDropdown.createJobsPage', 'Create Jobs') },
        { value: '/create-portfolio', label: tlOr('headerDropdown.createPortfolioPage', 'Create Portfolio') },
    ];

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
                        {tl('home.navTitle')}
                    </StyledNavLink>

                    <Select
                        value={createDropdownValue}
                        onChange={(e) => {
                            if (e.target.value === '__create-menu__') return;
                            void router.push(e.target.value);
                        }}
                        options={createDropdownOptions}
                        aria-label={tlOr('headerDropdown.createAria', 'Create dropdown')}
                    />

                    <Select
                        value={locale}
                        onChange={(e) => setLocale(e.target.value as Locale)}
                        options={locales.map(l => ({
                            value: l.code,
                            label: isLoading ? l.name : t(`langmenu.${l.code}`)
                        }))}
                        aria-label={isLoading ? '' : t('common.language')}
                        configKey="languageSelect"
                    />

                    {!hideThemeSelector && (
                        <Select
                            value={currentTheme}
                            onChange={(e) => onThemeChange(e.target.value)}
                            options={availableThemes.map(t => ({ value: t.id, label: t.name }))}
                            aria-label={isLoading ? '' : t('common.theme')}
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
                        {tl('home.navTitle')}
                    </MobileNavLink>
                    <Select
                        value={createDropdownValue}
                        onChange={(e) => {
                            if (e.target.value === '__create-menu__') return;
                            closeMobileMenu();
                            void router.push(e.target.value);
                        }}
                        options={createDropdownOptions}
                        aria-label={tlOr('headerDropdown.createAria', 'Create dropdown')}
                    />
                </MobileNav>

                <MobileControls>
                    <Select
                        value={locale}
                        onChange={(e) => setLocale(e.target.value as Locale)}
                        options={locales.map(l => ({
                            value: l.code,
                            label: isLoading ? l.name : t(`langmenu.${l.code}`)
                        }))}
                        aria-label={isLoading ? '' : t('common.language')}
                        configKey="languageSelect"
                    />

                    {!hideThemeSelector && (
                        <Select
                            value={currentTheme}
                            onChange={(e) => onThemeChange(e.target.value)}
                            options={availableThemes.map(t => ({ value: t.id, label: t.name }))}
                            aria-label={isLoading ? '' : t('common.theme')}
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
