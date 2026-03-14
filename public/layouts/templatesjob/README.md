# Templates Job

This folder contains JSON templates for the job page generator (`/create-jobs`).

## Goal

Each template defines a fully configurable visual style for HR teams and recruiters to publish job opportunities with:

- Job title and company name
- Work model (remote, hybrid, onsite, custom)
- Job description
- Apply link
- Custom tags (e.g. Java, Technology, Finance, Healthcare, etc.)
- Light and dark mode palettes
- Background and hover effects

## File naming

Use this format:

- `template-01.json`
- `template-02.json`
- ...

Keep two-digit numbering (`01`, `02`, ..., `20`).

## Required structure

```json
{
  "id": "job-template-id",
  "name": "Template Name",
  "description": "Short template description.",
  "layout": {
    "style": "stacked",
    "containerMaxWidth": 920,
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

## Contribution checklist

- Keep colors readable (WCAG-friendly contrast).
- Test both `light` and `dark` modes.
- Keep button and text legible on mobile and desktop.
- Avoid broken color combinations for `primary` and `primaryText`.
- Validate JSON syntax before committing.

