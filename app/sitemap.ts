import type { MetadataRoute } from 'next'
import { getSupabaseServerClient } from '@/lib/supabase/server'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3002'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await getSupabaseServerClient()

  const [{ data: books }, { data: authors }] = await Promise.all([
    supabase.from('books').select('slug, updated_at').order('created_at', { ascending: false }),
    supabase.from('authors').select('slug, updated_at').order('name'),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: 'daily',   priority: 1 },
    { url: `${BASE}/catalogue`, lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.9 },
  ]

  const bookRoutes: MetadataRoute.Sitemap = (books ?? []).map((b) => ({
    url:             `${BASE}/livres/${b.slug}`,
    lastModified:    b.updated_at ? new Date(b.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority:        0.8,
  }))

  const authorRoutes: MetadataRoute.Sitemap = (authors ?? []).map((a) => ({
    url:             `${BASE}/auteurs/${a.slug}`,
    lastModified:    a.updated_at ? new Date(a.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority:        0.6,
  }))

  return [...staticRoutes, ...bookRoutes, ...authorRoutes]
}
