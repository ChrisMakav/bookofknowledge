'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { FilterTag } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const GENRES = [
  { key: 'scifi',      label: 'Science-Fiction' },
  { key: 'romance',   label: 'Romance' },
  { key: 'thriller',  label: 'Thriller' },
  { key: 'fantasy',   label: 'Fantasy' },
  { key: 'lifestyle', label: 'Lifestyle' },
  { key: 'tech',      label: 'Tech' },
] as const

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Nouveautés' },
  { value: 'rating',    label: 'Meilleures notes' },
  { value: 'popularity',label: 'Popularité' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc',label: 'Prix décroissant' },
] as const

const FORMATS = [
  { value: 'hardcover', label: 'Relié' },
  { value: 'paperback', label: 'Broché' },
  { value: 'ebook',     label: 'Ebook' },
]

interface FilterSidebarProps {
  className?: string
}

export function FilterSidebar({ className }: FilterSidebarProps) {
  const router     = useRouter()
  const pathname   = usePathname()
  const params     = useSearchParams()

  const push = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString())
      if (value === null || value === '' || next.get(key) === value) {
        next.delete(key)
      } else {
        next.set(key, value)
        next.delete('page')
      }
      router.push(`${pathname}?${next.toString()}`)
    },
    [params, pathname, router],
  )

  const currentGenre  = params.get('genre')
  const currentSort   = params.get('sort') ?? 'newest'
  const currentFormat = params.get('format')

  return (
    <aside className={cn('flex flex-col gap-6', className)}>
      {/* Sort */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">
          Trier par
        </h3>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => push('sort', value)}
              className={cn(
                'text-left px-3 py-2 rounded-lg text-sm transition-colors duration-[var(--duration-fast)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                currentSort === value
                  ? 'bg-brand-50 text-brand-600 font-semibold'
                  : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Genres */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">
          Genre
        </h3>
        <div className="flex flex-wrap gap-2">
          {GENRES.map(({ key, label }) => (
            <FilterTag
              key={key}
              label={label}
              selected={currentGenre === key}
              onClick={() => push('genre', key)}
              color={undefined}
            />
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">
          Format
        </h3>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map(({ value, label }) => (
            <FilterTag
              key={value}
              label={label}
              selected={currentFormat === value}
              onClick={() => push('format', value)}
            />
          ))}
        </div>
      </div>

      {/* Reset */}
      {(currentGenre || currentFormat || params.get('sort')) && (
        <button
          onClick={() => router.push(pathname)}
          className="text-sm text-brand-600 hover:underline text-left focus-visible:outline-none"
        >
          Réinitialiser les filtres
        </button>
      )}
    </aside>
  )
}
