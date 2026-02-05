# Configuración de Diseños (Layouts)

Este directorio contiene los archivos de configuración y plantillas para los temas y diseños de la aplicación.

## Descripción General

El sistema de temas le permite personalizar toda la apariencia visual de la aplicación a través de archivos de configuración JSON. Cada tema define colores, tipografía, estilos de componentes y animaciones.

## `layoutsConfig.json`

El archivo `layoutsConfig.json` es la configuración central para los temas. Controla los temas disponibles, la configuración predeterminada y los límites globales.

### Campos de Configuración

-   **`HideThemeSelector`** (boolean):
    -   Si es `true`, el menú desplegable de selección de tema en el encabezado se ocultará.
    -   Los usuarios no podrán cambiar de tema manualmente.
    -   Útil si desea imponer un único tema específico.
-   **`MaxUrlLength`** (number):
    -   Establece el número máximo de caracteres permitidos para las URL generadas.
    -   Esto se utiliza para evitar errores con navegadores o servidores que tienen límites de longitud de URL.
-   **`default`** (string):
    -   El `id` del tema que se cargará por defecto para los nuevos usuarios.
-   **`layouts`** (array):
    -   Una lista de objetos de tema que definen los temas disponibles en la aplicación.

### Estructura del Objeto de Tema

Cada objeto en el array `layouts` representa un tema y tiene las siguientes propiedades:

-   **`id`** (string): Identificador único para el tema.
-   **`name`** (string): El nombre visual del tema que se muestra en el selector.
-   **`author`** (string): El nombre del creador del tema.
-   **`file`** (string): Ruta al archivo JSON de estilo del tema (relativo a `public/layouts`). Ejemplo: `templates/matrix-dark.json`.
-   **`preview`** (string): Una breve descripción del tema.
-   **`supportsLightAndDarkModes`** (boolean):
    -   Establézcalo en `true` si este tema tiene una versión clara u oscura correspondiente.
    -   Habilita el botón de alternancia sol/luna en el encabezado.
-   **`supportsLightAndDarkModesReference`** (string):
    -   Una cadena de referencia utilizada para vincular temas claros y oscuros.
    -   Ejemplo: Si tiene un tema oscuro con ID `matrix-dark` y un tema claro `matrix-light`, ambos deben compartir una base de referencia común aquí (ej: `matrix-1-dark` y `matrix-1-light`). El sistema los empareja eliminando el sufijo `-dark` o `-light`.
-   **`mode`** (string):
    -   Define si este es un tema `"light"` (claro) o `"dark"` (oscuro).

## Estructura del Archivo de Tema

Cada archivo JSON de tema (ej: `templates/default.json`) contiene las siguientes secciones:

### Metadatos

-   **`id`**: Identificador único del tema (debe coincidir con el ID en `layoutsConfig.json`)
-   **`name`**: Nombre de visualización
-   **`author`**: Nombre del creador
-   **`version`**: Versión del tema
-   **`mode`**: `"light"` o `"dark"`
-   **`supportsLightAndDarkModes`**: Boolean que indica si existen temas emparejados

### Colores

Define la paleta de colores para toda la aplicación:

-   **`background`**: Color de fondo principal
-   **`primary`**: Color de acento primario (usado para enlaces, botones, resaltados)
-   **`secondary`**: Color de acento secundario
-   **`text`**: Color del texto principal
-   **`textSecondary`**: Color del texto secundario/atenuado
-   **`cardBackground`**: Color de fondo para tarjetas y contenedores
-   **`cardBorder`**: Color del borde para tarjetas y contenedores
-   **`error`**: Color para estados y mensajes de error
-   **`success`**: Color para estados y mensajes de éxito

### Tipografía

Define la configuración de fuentes:

-   **`fontFamily`**: Pila de familias de fuentes CSS
-   **`fontSize`**: Objeto que contiene cinco tamaños predefinidos:
    -   **`small`**: Texto pequeño (ej: `0.875rem`)
    -   **`base`**: Texto base/cuerpo (ej: `1rem`)
    -   **`medium`**: Texto mediano (ej: `1.125rem`)
    -   **`large`**: Texto grande (ej: `1.25rem`)
    -   **`xlarge`**: Texto extra grande para encabezados (ej: `2rem`)

### Componentes

Define el estilo para componentes individuales de la interfaz:

#### `header`
-   **`height`**: Altura del encabezado (ej: `"80px"`)
-   **`backgroundColor`**: Color de fondo del encabezado
-   **`borderBottom`**: Estilo del borde inferior

#### `footer`
-   **`height`**: Altura del pie de página (ej: `"60px"`)
-   **`backgroundColor`**: Color de fondo del pie de página
-   **`borderTop`**: Estilo del borde superior

#### `card`
-   **`borderRadius`**: Redondeo de esquinas (ej: `"8px"`)
-   **`padding`**: Espaciado interno (ej: `"24px"`)
-   **`boxShadow`**: Efecto de sombra

#### `button`
-   **`borderRadius`**: Redondeo de esquinas
-   **`padding`**: Espaciado interno (ej: `"12px 24px"`)
-   **`border`**: Estilo del borde
-   **`hoverGlow`**: Efecto de brillo al pasar el ratón (o `"none"`)

#### `select`
-   **`borderRadius`**: Redondeo de esquinas
-   **`padding`**: Espaciado interno (ej: `"10px 40px 10px 16px"`)
-   **`border`**: Estilo del borde
-   **`backgroundColor`**: Color de fondo
-   **`textAlign`**: Alineación del texto (`"center"`, `"left"`, etc.)
-   **`iconColor`**: Color del icono desplegable
-   **`hoverBorderColor`**: Color del borde al pasar el ratón
-   **`focusBorderColor`**: Color del borde cuando está enfocado
-   **`focusGlow`**: Efecto de brillo cuando está enfocado

#### `checkbox`
-   **`width`**: Ancho del checkbox (ej: `"20px"`)
-   **`height`**: Altura del checkbox (ej: `"20px"`)
-   **`accentColor`**: Color del estado marcado
-   **`borderColor`**: Color del borde
-   **`hoverBorderColor`**: Color del borde al pasar el ratón
-   **`checkMarkColor`**: Color de la marca de verificación
-   **`borderRadius`**: Redondeo de esquinas

#### `headerControls` (Sistema de Estandarización)

Este es un **nuevo sistema de estandarización** que garantiza que todos los controles del encabezado (botón Inicio, botón Crear, selector de Idioma, selector de Tema y alternador de Modo) tengan dimensiones y estilos consistentes.

**`common`** - Propiedades compartidas aplicadas a todos los controles del encabezado:
-   **`height`**: Altura uniforme para todos los controles (ej: `"42px"`)
-   **`padding`**: Espaciado interno (ej: `"0 16px"`)
-   **`borderRadius`**: Redondeo de esquinas (ej: `"8px"`)
-   **`border`**: Estilo del borde (ej: `"1px solid #e1e1e1"`)
-   **`backgroundColor`**: Color de fondo
-   **`fontSize`**: Tamaño de fuente (ej: `"0.9rem"`)
-   **`fontWeight`**: Peso de la fuente (ej: `"600"`)
-   **`hoverBorderColor`**: Color del borde al pasar el ratón
-   **`focusBorderColor`**: Color del borde cuando está enfocado

**Anulaciones Específicas** - Configuraciones individuales de ancho para cada control:
-   **`homeButton.width`**: Ancho del botón Inicio (ej: `"80px"`)
-   **`createButton.width`**: Ancho del botón Crear (ej: `"80px"`)
-   **`languageSelect.width`**: Ancho del selector de Idioma (ej: `"130px"`)
-   **`themeSelect.width`**: Ancho del selector de Tema (ej: `"150px"`)
-   **`modeToggle.width`**: Ancho del alternador Claro/Oscuro (ej: `"42px"`)

Este sistema garantiza que todos los elementos del encabezado tengan una apariencia unificada y profesional, permitiendo un control refinado sobre los anchos individuales.

### Animaciones

Controla los efectos de animación y transición:

-   **`enableTypingEffect`** (boolean): Habilita el efecto de animación de escritura en el texto
-   **`enableGlow`** (boolean): Habilita efectos de brillo en los estados hover y focus
-   **`transitionDuration`**: Velocidad de las transiciones CSS (ej: `"0.2s"`)

## Cómo Crear un Nuevo Diseño

1.  **Cree el Archivo de Tema**:
    -   Cree un nuevo archivo JSON en `public/layouts/templates/` (ej: `mi-tema.json`).
    -   Copie un tema existente como `default.json` como base.
    -   Personalice los colores, tipografía, componentes y animaciones.

2.  **Registre el Tema**:
    -   Abra `public/layouts/layoutsConfig.json`.
    -   Añada un nuevo objeto al array `layouts` con los detalles de su tema.

3.  **Pruebe**:
    -   Actualice la aplicación para ver su nuevo tema en el selector (a menos que `HideThemeSelector` sea true).
    -   Pruebe todas las páginas y componentes para garantizar el estilo adecuado.

## Ejemplo de Estructura de Tema

```json
{
    "id": "mi-tema",
    "name": "Mi Tema Personalizado",
    "author": "Su Nombre",
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
