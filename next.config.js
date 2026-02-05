/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // Configure for GitHub Pages deployment
  // basePath: '/git-page-link-create', // Uncomment and set your repo name for GitHub Pages
  // assetPrefix: '/git-page-link-create/', // Uncomment and set your repo name for GitHub Pages
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
}

module.exports = nextConfig
