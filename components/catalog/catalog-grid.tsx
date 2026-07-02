'use client'

import { LayoutGrid, List } from 'lucide-react'
import { useState } from 'react'
import { BookCard } from '@/components/books/book-card'
import { cn } from '@/lib/utils'
import type { Book } from '@/types'

interface CatalogGridProps {
  books:   Book[]
  total:   number
  page:    number
  pages:   number
  onPageChange: (page: number) => void
}

export function CatalogGrid({ books, total, page, pages, onPageChange }: CatalogGridProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">{total}</span>{' '}
          résultat{total !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-1 bg-surface-subtle rounded-lg p-1">
          <button
            onClick={() => setView('grid')}
            aria-label="Vue grille"
            aria-pressed={view === 'grid'}
            className={cn(
              'size-7 flex items-center justify-center rounded',
              'transition-colors duration-[var(--duration-fast)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
              view === 'grid'
                ? 'bg-white text-text-primary shadow-xs'
                : 'text-text-muted hover:text-text-secondary',
            )}
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setView('list')}
            aria-label="Vue liste"
            aria-pressed={view === 'list'}
            className={cn(
              'size-7 flex items-center justify-center rounded',
              'transition-colors duration-[var(--duration-fast)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
              view === 'list'
                ? 'bg-white text-text-primary shadow-xs'
                : 'text-text-muted hover:text-text-secondary',
            )}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Books */}
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <p className="text-2xl">📚</p>
          <p className="font-semibold text-text-primary">Aucun livre trouvé</p>
          <p className="text-sm text-text-secondary">Essayez d&apos;ajuster vos filtres.</p>
        </div>
      ) : (
        <div
          className={cn(
            view === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
              : 'flex flex-col gap-3',
          )}
        >
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              author={(book as { author?: { name?: string } }).author?.name}
              variant={view}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-4" role="navigation" aria-label="Pagination">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
              page <= 1
                ? 'opacity-40 cursor-not-allowed text-text-muted'
                : 'text-text-secondary hover:bg-surface-subtle',
            )}
          >
            Précédent
          </button>

          {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                'size-8 flex items-center justify-center rounded-lg text-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                p === page
                  ? 'bg-brand-600 text-white font-semibold'
                  : 'text-text-secondary hover:bg-surface-subtle',
              )}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pages}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
              page >= pages
                ? 'opacity-40 cursor-not-allowed text-text-muted'
                : 'text-text-secondary hover:bg-surface-subtle',
            )}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}
