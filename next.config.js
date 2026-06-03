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

/** Vercel Root Directory = frontend: build output must live in frontend/.next */
const distDir =
  process.env.VERCEL_FRONTEND_BRIDGE === '1' ? 'frontend/.next' : '.next'

const nextConfig = {
  distDir,
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
}
module.exports = nextConfig
