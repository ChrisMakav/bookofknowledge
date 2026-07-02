'use client'

import { cn } from '@/lib/utils'
import type { Edition, BookFormat } from '@/types'

interface EditionSelectorProps {
  editions:    Edition[]
  selectedKey: BookFormat
  onSelect:    (key: BookFormat) => void
  className?:  string
}

export function EditionSelector({
  editions,
  selectedKey,
  onSelect,
  className,
}: EditionSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Choisir un format"
      className={cn('flex gap-2 flex-wrap', className)}
    >
      {editions.map(({ key, label, price }) => {
        const isSelected = selectedKey === key
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            aria-pressed={isSelected}
            className={cn(
              'flex flex-col items-center px-4 py-3 rounded-lg text-left',
              'transition-all duration-[var(--duration-fast)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
              isSelected
                ? 'border-2 border-text-primary bg-surface-card shadow-sm'
                : 'border border-border bg-surface-page hover:border-border-strong',
            )}
          >
            <span
              className={cn(
                'text-xs font-semibold uppercase tracking-wider',
                isSelected ? 'text-text-primary' : 'text-text-muted',
              )}
            >
              {label}
            </span>
            <span
              className={cn(
                'text-sm font-bold mt-0.5',
                isSelected ? 'text-brand-600' : 'text-text-secondary',
              )}
            >
              {price.toFixed(2)} €
            </span>
          </button>
        )
      })}
    </div>
  )
}
