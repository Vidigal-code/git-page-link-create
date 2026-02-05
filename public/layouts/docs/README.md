# Layouts Configuration

This directory contains the configuration and template files for the application's themes and layouts.

## Overview

The theming system allows you to customize the entire visual appearance of the application through JSON configuration files. Each theme defines colors, typography, component styles, and animations.

## `layoutsConfig.json`

The `layoutsConfig.json` file is the central configuration for themes. It controls available themes, default settings, and global limits.

### Configuration Fields

-   **`HideThemeSelector`** (boolean):
    -   If `true`, the theme selection dropdown in the header will be hidden.
    -   Users will not be able to switch themes manually.
    -   Useful if you want to enforce a single specific theme.
-   **`MaxUrlLength`** (number):
    -   Sets the maximum number of characters allowed for generated URLs.
    -   This is used to prevent errors with browsers or servers that have URL length limits.
-   **`default`** (string):
    -   The `id` of the theme that will be loaded by default for new users.
-   **`layouts`** (array):
    -   A list of theme objects defining the available themes in the application.

### Theme Object Structure

Each object in the `layouts` array represents a theme and has the following properties:

-   **`id`** (string): Unique identifier for the theme.
-   **`name`** (string): The display name of the theme shown in the selector.
-   **`author`** (string): The name of the theme creator.
-   **`file`** (string): Path to the theme's JSON styling file (relative to `public/layouts`). Example: `templates/matrix-dark.json`.
-   **`preview`** (string): A short description of the theme.
-   **`supportsLightAndDarkModes`** (boolean):
    -   Set to `true` if this theme has a corresponding light or dark version.
    -   Enables the sun/moon toggle button in the header.
-   **`supportsLightAndDarkModesReference`** (string):
    -   A reference string used to link light and dark themes together.
    -   Example: If you have a dark theme with ID `matrix-dark` and a light theme `matrix-light`, both should share a common reference base here (e.g., `matrix-1-dark` and `matrix-1-light`). The system matches them by removing the `-dark` or `-light` suffix.
-   **`mode`** (string):
    -   Defines if this is a `"light"` or `"dark"` theme.

## Theme File Structure

Each theme JSON file (e.g., `templates/default.json`) contains the following sections:

### Metadata

-   **`id`**: Unique theme identifier (must match the ID in `layoutsConfig.json`)
-   **`name`**: Display name
-   **`author`**: Creator name
-   **`version`**: Theme version
-   **`mode`**: `"light"` or `"dark"`
-   **`supportsLightAndDarkModes`**: Boolean indicating if paired themes exist

### Colors

Defines the color palette for the entire application:

-   **`background`**: Main background color
-   **`primary`**: Primary accent color (used for links, buttons, highlights)
-   **`secondary`**: Secondary accent color
-   **`text`**: Primary text color
-   **`textSecondary`**: Secondary/muted text color
-   **`cardBackground`**: Background color for cards and containers
-   **`cardBorder`**: Border color for cards and containers
-   **`error`**: Color for error states and messages
-   **`success`**: Color for success states and messages

### Typography

Defines font settings:

-   **`fontFamily`**: CSS font family stack
-   **`fontSize`**: Object containing five size presets:
    -   **`small`**: Small text (e.g., `0.875rem`)
    -   **`base`**: Base/body text (e.g., `1rem`)
    -   **`medium`**: Medium text (e.g., `1.125rem`)
    -   **`large`**: Large text (e.g., `1.25rem`)
    -   **`xlarge`**: Extra large text for headings (e.g., `2rem`)

### Components

Defines styling for individual UI components:

#### `header`
-   **`height`**: Header height (e.g., `"80px"`)
-   **`backgroundColor`**: Header background color
-   **`borderBottom`**: Bottom border style

#### `footer`
-   **`height`**: Footer height (e.g., `"60px"`)
-   **`backgroundColor`**: Footer background color
-   **`borderTop`**: Top border style

#### `card`
-   **`borderRadius`**: Corner rounding (e.g., `"8px"`)
-   **`padding`**: Internal spacing (e.g., `"24px"`)
-   **`boxShadow`**: Shadow effect

#### `button`
-   **`borderRadius`**: Corner rounding
-   **`padding`**: Internal spacing (e.g., `"12px 24px"`)
-   **`border`**: Border style
-   **`hoverGlow`**: Glow effect on hover (or `"none"`)

#### `select`
-   **`borderRadius`**: Corner rounding
-   **`padding`**: Internal spacing (e.g., `"10px 40px 10px 16px"`)
-   **`border`**: Border style
-   **`backgroundColor`**: Background color
-   **`textAlign`**: Text alignment (`"center"`, `"left"`, etc.)
-   **`iconColor`**: Color of the dropdown icon
-   **`hoverBorderColor`**: Border color on hover
-   **`focusBorderColor`**: Border color when focused
-   **`focusGlow`**: Glow effect when focused

#### `checkbox`
-   **`width`**: Checkbox width (e.g., `"20px"`)
-   **`height`**: Checkbox height (e.g., `"20px"`)
-   **`accentColor`**: Checked state color
-   **`borderColor`**: Border color
-   **`hoverBorderColor`**: Border color on hover
-   **`checkMarkColor`**: Color of the checkmark
-   **`borderRadius`**: Corner rounding

#### `headerControls` (Standardization System)

This is a **new standardization system** that ensures all header controls (Home button, Create button, Language selector, Theme selector, and Mode toggle) have consistent dimensions and styling.

**`common`** - Shared properties applied to all header controls:
-   **`height`**: Uniform height for all controls (e.g., `"42px"`)
-   **`padding`**: Internal spacing (e.g., `"0 16px"`)
-   **`borderRadius`**: Corner rounding (e.g., `"8px"`)
-   **`border`**: Border style (e.g., `"1px solid #e1e1e1"`)
-   **`backgroundColor`**: Background color
-   **`fontSize`**: Font size (e.g., `"0.9rem"`)
-   **`fontWeight`**: Font weight (e.g., `"600"`)
-   **`hoverBorderColor`**: Border color on hover
-   **`focusBorderColor`**: Border color when focused

**Specific Overrides** - Individual width settings for each control:
-   **`homeButton.width`**: Width of the Home button (e.g., `"80px"`)
-   **`createButton.width`**: Width of the Create button (e.g., `"80px"`)
-   **`languageSelect.width`**: Width of the Language selector (e.g., `"130px"`)
-   **`themeSelect.width`**: Width of the Theme selector (e.g., `"150px"`)
-   **`modeToggle.width`**: Width of the Dark/Light mode toggle (e.g., `"42px"`)

This system ensures that all header elements have a unified, professional appearance while allowing fine-tuned control over individual widths.

### Animations

Controls animation and transition effects:

-   **`enableTypingEffect`** (boolean): Enables typing animation effect on text
-   **`enableGlow`** (boolean): Enables glow effects on hover and focus states
-   **`transitionDuration`**: Speed of CSS transitions (e.g., `"0.2s"`)

## How to Create a New Layout

1.  **Create the Theme File**:
    -   Create a new JSON file in `public/layouts/templates/` (e.g., `my-theme.json`).
    -   Copy an existing theme like `default.json` as a base.
    -   Customize the colors, typography, components, and animations.

2.  **Register the Theme**:
    -   Open `public/layouts/layoutsConfig.json`.
    -   Add a new object to the `layouts` array with your theme's details.

3.  **Test**:
    -   Refresh the application to see your new theme in the selector (unless `HideThemeSelector` is true).
    -   Test all pages and components to ensure proper styling.

## Example Theme Structure

```json
{
    "id": "my-theme",
    "name": "My Custom Theme",
    "author": "Your Name",
    "version": "1.0.0",
    "mode": "light",
    "supportsLightAndDarkModes": false,
    "colors": {
        "background": "#ffffff",
        "primary": "#0070f3",
        "secondary": "#7928ca",
        "text": "#000000",
        "textSecondary": "#666666",
        "cardBackground": "#f9f9f9",
        "cardBorder": "#e1e1e1",
        "error": "#e00",
        "success": "#0070f3"
    },
    "typography": {
        "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        "fontSize": {
            "small": "0.875rem",
            "base": "1rem",
            "medium": "1.125rem",
            "large": "1.25rem",
            "xlarge": "2rem"
        }
    },
    "components": {
        "headerControls": {
            "common": {
                "height": "42px",
                "padding": "0 16px",
                "borderRadius": "8px",
                "border": "1px solid #e1e1e1",
                "backgroundColor": "#f9f9f9",
                "fontSize": "0.9rem",
                "fontWeight": "600",
                "hoverBorderColor": "#0070f3",
                "focusBorderColor": "#0070f3"
            },
            "homeButton": { "width": "80px" },
            "createButton": { "width": "80px" },
            "languageSelect": { "width": "130px" },
            "themeSelect": { "width": "150px" },
            "modeToggle": { "width": "42px" }
        }
    },
    "animations": {
        "enableTypingEffect": false,
        "enableGlow": false,
        "transitionDuration": "0.2s"
    }
}
```
