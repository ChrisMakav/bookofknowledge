import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getBooks } from '@/actions/books'
import { FilterSidebar } from '@/components/catalog/filter-sidebar'
import { CatalogClient } from './catalog-client'

export const metadata: Metadata = {
  title: 'Catalogue',
  description: 'Explorez notre sélection de plus de 50 000 livres.',
}

interface CatalogPageProps {
  searchParams: Promise<{
    q?:      string
    genre?:  string
    sort?:   string
    format?: string
    page?:   string
  }>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams
  const page   = parseInt(params.page ?? '1', 10)

  const { books, total, pages } = await getBooks({
    q:      params.q,
    genre:  params.genre as never,
    sort:   params.sort as never,
    format: params.format as never,
    page,
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold font-display text-text-primary mb-8">Catalogue</h1>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <Suspense>
            <FilterSidebar />
          </Suspense>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<CatalogSkeleton />}>
            <CatalogClient
              initialBooks={books}
              total={total}
              page={page}
              pages={pages}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-surface-subtle animate-pulse aspect-[2/3]" />
      ))}
    </div>
  )
}
