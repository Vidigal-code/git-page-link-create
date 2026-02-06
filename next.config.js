/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // Configure for GitHub Pages deployment
  basePath: '/git-page-link-create',
  assetPrefix: '/git-page-link-create/',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: '/git-page-link-create',
    NEXT_PUBLIC_SITE_URL: 'https://vidigal-code.github.io/git-page-link-create',
  },
}

module.exports = nextConfig
