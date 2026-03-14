# Templates Portfolio

This folder contains JSON templates for the portfolio generator (`/create-portfolio`).

## What users can build

A full responsive portfolio page with:

- Main profile (name, image, description)
- Social links
- Education and certificates
- Skills
- Work experience
- Contact section
- Footer text
- Light, dark and auto mode support

## File naming

Use:

- `template-01.json`
- `template-02.json`
- ...
- `template-20.json`

## Required JSON structure

```json
{
  "id": "portfolio-template-id",
  "name": "Template Name",
  "description": "Short description.",
  "layout": {
    "style": "stacked",
    "containerMaxWidth": 1040,
    "imageShape": "rounded"
  },
  "effects": {
    "backgroundEffect": "mesh",
    "hoverEffect": "lift"
  },
  "modes": {
    "light": {
      "background": "#ffffff",
      "surface": "#ffffff",
      "text": "#111111",
      "mutedText": "#666666",
      "primary": "#2f66c4",
      "primaryText": "#ffffff",
      "border": "#dddddd",
      "chip": "#f1f1f1",
      "shadow": "0 16px 30px rgba(0,0,0,0.15)"
    },
    "dark": {
      "background": "#0f1115",
      "surface": "#171a20",
      "text": "#eceff4",
      "mutedText": "#a9b2bf",
      "primary": "#79a7ff",
      "primaryText": "#122240",
      "border": "#2c3340",
      "chip": "#202733",
      "shadow": "0 18px 34px rgba(0,0,0,0.5)"
    }
  }
}
```

## Allowed values

- `layout.style`: `stacked` | `glass` | `minimal` | `grid`
- `layout.imageShape`: `circle` | `rounded` | `square`
- `effects.backgroundEffect`: `aurora` | `mesh` | `grid` | `stars` | `waves` | `spotlight`
- `effects.hoverEffect`: `lift` | `glow` | `outline` | `pulse`

