# Profile and links page

/create-links accepts profileName, profileBio, bioFonts, avatarUrl, websiteUrl/websiteLabel, mode and social links with id/platform/url. Users choose a template and preview before generation.

loadTemplatesLinks loads templates, buildTemplateLinksHtml creates HTML and generateHtmlRenderAllLink builds a self-contained renderer link. Form/output state remains client-side. There is no database-backed profile or analytics dashboard.

Check social URLs, remote images, alternative text and mobile preview. Form changes require sharing a new link; old snapshots remain unchanged.

## Code and navigation

- [src/pages/create-links.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/create-links.tsx)
- [src/features/render-all/lib/generateHtmlRenderAllLink.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/render-all/lib/generateHtmlRenderAllLink.ts)

- [Project guide](?menu=en&lang=en&id=9)
- [Source reference](?menu=en&lang=en&id=10)
