export interface ThemeColors {
    background: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    cardBackground: string;
    cardBorder: string;
    error: string;
    success: string;
}

export interface ThemeTypography {
    fontFamily: string;
    fontSize: {
        small: string;
        base: string;
        medium: string;
        large: string;
        xlarge: string;
    };
}

export interface ThemeComponents {
    header: {
        height: string;
        backgroundColor: string;
        borderBottom: string;
    };
    footer: {
        height: string;
        backgroundColor: string;
        borderTop: string;
    };
    card: {
        borderRadius: string;
        padding: string;
        boxShadow: string;
    };
    button: {
        borderRadius: string;
        padding: string;
        border: string;
        hoverGlow: string;
    };
    select: {
        borderRadius: string;
        padding: string;
        border: string;
        backgroundColor: string;
        textAlign: string;
        iconColor: string;
        hoverBorderColor: string;
        focusBorderColor: string;
        focusGlow: string;
    };
    checkbox: {
        width: string;
        height: string;
        accentColor: string;
        borderColor: string;
        hoverBorderColor: string;
        checkMarkColor: string;
        borderRadius: string;
    };
    headerControls: {
        common: {
            height: string;
            padding: string;
            borderRadius: string;
            border: string;
            backgroundColor: string;
            fontSize: string;
            fontWeight: string; // Changed from number to string to match CSS
            hoverBorderColor: string;
            focusBorderColor: string;
        };
        homeButton: {
            width?: string;
        };
        createButton: {
            width?: string;
        };
        languageSelect: {
            width?: string;
        };
        themeSelect: {
            width?: string;
        };
        modeToggle: {
            width?: string;
        };
    };
}

export interface ThemeAnimations {
    enableTypingEffect: boolean;
    enableGlow: boolean;
    transitionDuration: string;
}

export interface Theme {
    id: string;
    name: string;
    author: string;
    version: string;
    mode: 'light' | 'dark';
    supportsLightAndDarkModes: boolean;
    colors: ThemeColors;
    typography: ThemeTypography;
    components: ThemeComponents;
    animations: ThemeAnimations;
}

declare module 'styled-components' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface DefaultTheme extends Theme { }
}
