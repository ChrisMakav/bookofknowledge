'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ScanLine } from 'lucide-react'
import { CatalogGrid } from '@/components/catalog/catalog-grid'
import { ISBNScanner } from '@/components/catalog/isbn-scanner'
import type { Book } from '@/types'

interface CatalogClientProps {
  initialBooks: Book[]
  total:        number
  page:         number
  pages:        number
}

export function CatalogClient({ initialBooks, total, page, pages }: CatalogClientProps) {
  const router      = useRouter()
  const pathname    = usePathname()
  const params      = useSearchParams()
  const [scanner, setScanner] = useState(false)

  function handlePageChange(newPage: number) {
    const next = new URLSearchParams(params.toString())
    next.set('page', String(newPage))
    router.push(`${pathname}?${next.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <CatalogGrid
        books={initialBooks}
        total={total}
        page={page}
        pages={pages}
        onPageChange={handlePageChange}
      />

      {/* FAB ISBN scanner */}
      <button
        onClick={() => setScanner(true)}
        aria-label="Scanner un ISBN"
        className="fixed bottom-6 right-6 size-14 rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-700 active:scale-95 transition-all flex items-center justify-center z-40"
      >
        <ScanLine size={22} />
      </button>

      {scanner && <ISBNScanner onClose={() => setScanner(false)} />}
    </>
  )
}
