# Job page generator

/create-jobs loads templates, selects the first available one and keeps form/preview state in the browser. Fields include company/site, recruiter WhatsApp/email, title/description, fonts, work mode, contract/schedule, salary/currency, application URL, cover and tags.

Generation calls buildJobTemplateHtml and generateHtmlRenderAllLink to produce HTML and a compressed renderer link. Users can copy HTML or share the link. WhatsApp contact belongs to this form; it is not /chat-link behavior.

Template/validation errors appear in the page. External images/links depend on their origins. The project does not store applications, publish to job boards or authenticate recruiters. Review content, URLs and preview before sharing.

## Code and navigation

- [src/pages/create-jobs.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/create-jobs.tsx)
- [src/features/render-all/lib/generateHtmlRenderAllLink.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/render-all/lib/generateHtmlRenderAllLink.ts)

- [Project guide](?menu=en&lang=en&id=9)
- [Source reference](?menu=en&lang=en&id=10)
