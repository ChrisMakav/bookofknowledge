import { cn } from '@/lib/utils'
import type { GenreKey } from '@/types'

// ─── Genre colors (fixed identifiers — never remap) ───────────────────────────

export const genreColors: Record<GenreKey, string> = {
  scifi:     '#00B8C8',
  romance:   '#F09335',
  thriller:  '#E8458A',
  fantasy:   '#7B5CF5',
  lifestyle: '#3CB97E',
  tech:      '#4F7EF5',
}

export const genreLabels: Record<GenreKey, string> = {
  scifi:     'SCI-FI',
  romance:   'ROMANCE',
  thriller:  'THRILLER',
  fantasy:   'FANTASY',
  lifestyle: 'LIFESTYLE',
  tech:      'TECH',
}

// ─── GenreBadge ───────────────────────────────────────────────────────────────

interface GenreBadgeProps {
  genre:    GenreKey
  onCover?: boolean
  className?: string
}

export function GenreBadge({ genre, onCover = false, className }: GenreBadgeProps) {
  const color = genreColors[genre]
  const label = genreLabels[genre]

  if (onCover) {
    return (
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-full',
          'text-xs font-bold tracking-widest uppercase',
          'bg-black/60 backdrop-blur-sm',
          className,
        )}
        style={{ color }}
      >
        {label}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full',
        'text-xs font-bold tracking-widest uppercase',
        className,
      )}
      style={{ color, backgroundColor: `${color}1A` }}
    >
      {label}
    </span>
  )
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  label:      string
  className?: string
}

export function StatusBadge({ label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full',
        'text-xs font-bold tracking-widest uppercase',
        'bg-accent-500 text-white',
        className,
      )}
    >
      {label}
    </span>
  )
}

// ─── ProgressChip ─────────────────────────────────────────────────────────────

interface ProgressChipProps {
  value:      string
  className?: string
}

export function ProgressChip({ value, className }: ProgressChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full',
        'text-xs font-semibold',
        'bg-brand-50 text-brand-600',
        className,
      )}
    >
      {value}
    </span>
  )
}

// ─── FilterTag (generic selectable pill) ─────────────────────────────────────

interface FilterTagProps {
  label:      string
  selected?:  boolean
  onClick?:   () => void
  color?:     string
  className?: string
}

export function FilterTag({ label, selected = false, onClick, color, className }: FilterTagProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full',
        'text-xs font-bold tracking-widest uppercase',
        'transition-all duration-[var(--duration-base)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1',
        selected
          ? 'bg-brand-600 text-white'
          : 'hover:bg-surface-subtle',
        className,
      )}
      style={!selected && color ? { color } : undefined}
    >
      {label}
    </button>
  )
}
