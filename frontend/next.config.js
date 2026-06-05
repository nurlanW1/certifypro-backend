const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const serverActionOrigins = ['localhost:3000']
if (process.env.VERCEL_URL) {
  serverActionOrigins.push(process.env.VERCEL_URL)
}
if (process.env.NEXT_PUBLIC_APP_URL) {
  try {
    serverActionOrigins.push(new URL(process.env.NEXT_PUBLIC_APP_URL).host)
  } catch {
    /* ignore invalid URL */
  }
}

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'img.clerk.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: serverActionOrigins },
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = 'cheap-module-source-map'
    }

    return config
  },
}
module.exports = withNextIntl(nextConfig)
