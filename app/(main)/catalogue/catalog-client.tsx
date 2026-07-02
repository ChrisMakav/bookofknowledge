'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { CatalogGrid } from '@/components/catalog/catalog-grid'
import type { Book } from '@/types'

interface CatalogClientProps {
  initialBooks: Book[]
  total:        number
  page:         number
  pages:        number
}

export function CatalogClient({
  initialBooks,
  total,
  page,
  pages,
}: CatalogClientProps) {
  const router   = useRouter()
  const pathname = usePathname()
  const params   = useSearchParams()

  function handlePageChange(newPage: number) {
    const next = new URLSearchParams(params.toString())
    next.set('page', String(newPage))
    router.push(`${pathname}?${next.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <CatalogGrid
      books={initialBooks}
      total={total}
      page={page}
      pages={pages}
      onPageChange={handlePageChange}
    />
  )
}
