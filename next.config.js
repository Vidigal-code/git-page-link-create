/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const BASE_PATH = isProd ? '/git-page-link-create' : ''

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // Configure for GitHub Pages deployment
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH ? `${BASE_PATH}/` : '',
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
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
    NEXT_PUBLIC_SITE_URL: isProd ? 'https://vidigal-code.github.io/git-page-link-create' : '',
  },
}

module.exports = nextConfig
