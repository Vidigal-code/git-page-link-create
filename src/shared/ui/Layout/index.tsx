import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { LayoutContainer, Main } from './Layout.styles';

interface LayoutProps {
    children: React.ReactNode;
    currentTheme: string;
    availableThemes: { id: string; name: string }[];
    onThemeChange: (themeId: string) => void;
    currentThemeMode?: 'light' | 'dark';
    supportsLightAndDarkModes?: boolean;
    onToggleLightDark?: () => void;
    hideThemeSelector?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    currentTheme,
    availableThemes,
    onThemeChange,
    currentThemeMode,
    supportsLightAndDarkModes,
    onToggleLightDark,
    hideThemeSelector
}) => {
    return (
        <LayoutContainer>
            <Header
                currentTheme={currentTheme}
                availableThemes={availableThemes}
                onThemeChange={onThemeChange}
                currentThemeMode={currentThemeMode}
                supportsLightAndDarkModes={supportsLightAndDarkModes}
                onToggleLightDark={onToggleLightDark}
                hideThemeSelector={hideThemeSelector}
            />
            <Main>{children}</Main>
            <Footer />
        </LayoutContainer>
    );
};
