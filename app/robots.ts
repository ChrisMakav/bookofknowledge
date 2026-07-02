import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3002'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        disallow:  ['/admin/', '/api/webhooks/', '/compte/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
