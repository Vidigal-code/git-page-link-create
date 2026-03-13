# Templates Links Contribution Guide

This folder contains JSON templates used by the custom links page (`/create-links`).

Current pack size: **20 templates** (`template-01.json` to `template-20.json`).

## Goal

Each template defines visual tokens for a fully responsive profile links page with:

- Light mode
- Dark mode
- Mobile-first responsive behavior

## Existing Examples

- `template-01.json`: GitHub style
- `template-02.json`: Modern style
- `template-03.json`: Spatial style
- `template-04.json`: Cyberpunk style
- `template-05.json`: Space style

## How To Add A New Template

1. Create a new JSON file in this folder (for example: `template-05.json`).
2. Follow the same structure used by existing templates.
3. Use a unique `id`.
4. Include both `modes.light` and `modes.dark`.
5. Keep `containerMaxWidth` reasonable for mobile and desktop.
6. Test your template in `/create-links`.
7. Check dark/light behavior and responsive animations in the generated HTML.
8. Add an `effects` object to control animated background and hover style.

## Required JSON Structure

```json
{
  "id": "my-template-id",
  "name": "My Template Name",
  "description": "Short description of the style",
  "layout": {
    "style": "stacked",
    "containerMaxWidth": 560,
    "avatarShape": "rounded"
  },
  "effects": {
    "backgroundEffect": "aurora",
    "hoverEffect": "lift"
  },
  "modes": {
    "light": {
      "background": "#f8fafc",
      "surface": "#ffffff",
      "text": "#111827",
      "mutedText": "#4b5563",
      "primary": "#2563eb",
      "primaryText": "#ffffff",
      "border": "#d1d5db",
      "chip": "#eff6ff",
      "shadow": "0 10px 25px rgba(0,0,0,0.12)"
    },
    "dark": {
      "background": "#0b1220",
      "surface": "#111827",
      "text": "#e5e7eb",
      "mutedText": "#9ca3af",
      "primary": "#60a5fa",
      "primaryText": "#0b1220",
      "border": "#334155",
      "chip": "#1e293b",
      "shadow": "0 12px 28px rgba(0,0,0,0.45)"
    }
  }
}
```

## Allowed Values

- `layout.style`: `stacked`, `glass`, `minimal`, `grid`
- `layout.avatarShape`: `circle`, `rounded`, `square`
- `effects.backgroundEffect`: `aurora`, `mesh`, `grid`, `stars`, `waves`, `spotlight`
- `effects.hoverEffect`: `lift`, `glow`, `outline`, `pulse`

## Contribution Tips

- Prefer strong color contrast (AA readability).
- Keep text and buttons readable on small screens.
- Avoid very large shadows on mobile.
- Use concise descriptions and clear template names.
- Keep motion smooth and subtle (hover/fade/float animations are supported).
- In `Auto` mode, the generated page includes one header toggle button (Light/Dark).

