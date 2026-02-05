# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-04

### Added
- Initial release of git-page-link-create
- Support for HTML, Markdown, and CSV/XLS content types
- Gzip compression using pako library
- SHA-256 hash generation for unique content IDs
- Static JSON file persistence
- Secure iframe rendering for HTML content
- Markdown to HTML conversion using marked
- CSV/XLS to table conversion using papaparse and xlsx
- Download original file functionality
- Matrix theme (default cyberpunk-style theme)
- Theme system with JSON-based configuration
- Internationalization support (Portuguese, English, Spanish)
- Language selector in header
- Theme selector in header
- Feature-Sliced Design (FSD) architecture
- Styled-components with SSR support
- Next.js 14 with static export
- GitHub Pages deployment configuration
- Comprehensive README with all documentation
- CONTRIBUTING.md for contributor guidelines
- MIT License
- SEO optimization for Home and Create pages
- noindex/nofollow for Render pages
- Responsive design (mobile-first)
- Accessibility features (ARIA labels, keyboard navigation)
- Footer with creator credits

### Technical Details
- Next.js 14.0.4 with Pages Router
- TypeScript 5.3.3
- React 18.2.0
- styled-components 6.1.8
- pako 2.1.0 for compression
- marked 11.1.1 for Markdown
- papaparse 5.4.1 for CSV
- xlsx 0.18.5 for Excel files

### Known Limitations
- Manual JSON file creation required for deployment
- No automated content persistence
- File size recommendations for optimal performance
- Requires modern browser with Web Crypto API

## [Unreleased]

### Planned Features
- Automated JSON file generation during build
- Content search functionality
- Additional themes (Dracula, Nord, Solarized)
- PDF support
- Image optimization
- Content versioning
- Analytics integration
- PWA support
- Dark/Light mode toggle per theme

---

For more details, see the [README](README.md).
