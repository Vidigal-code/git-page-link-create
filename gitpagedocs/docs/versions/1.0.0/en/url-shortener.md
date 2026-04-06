# URL Shortener

Our platform implements the Linked Shortener feature aiming to supply attractive, fast URLs coupled with business-grade utilities (continuous redirection flows).

## Base Creation (`/shorturl`)
By accessing the core of the Link Shortener tool, users can paste any extensive link upon a simplified interface which interacts with our native directory pipeline in `create/shorturl` to translate the state-saving request.

**1. Automatic vs Manual Generation**
The tool drops a minimal alphanumeric Slug automatically (E.g: `/s/XkM8rW`). However, authenticated users are capable of customizing the final string should they wish for a specific nominal branding (E.g: `/s/TechPromo`).

**2. QR Code Integration**
The project is configured to automatically emit `qrcodes` employing parsing modules like `qrcode`. For each diminished link, the SVG or the generated structural image output will be copyable directly for printing, digital billboards, or email attachments.

## How the Redirect works (`/s/[slug]`)
Under the `GitPageLinkCreate` architecture, the static directory nested atop the root pages intercepts matching prefix calls. It decodes the Server-side or Middleware instructions and crafts the HTTP _302 Found_ redirection bouncing the client directly to their new expansive destination context.
