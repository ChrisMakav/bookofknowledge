import { cn } from '@/lib/utils'
import type { GenreKey } from '@/types'

// ─── Catégorie colors ─────────────────────────────────────────────────────────

export const genreColors: Record<GenreKey, string> = {
  'biographie':                 '#4F7EF5',
  'caractere-de-christ':        '#7B5CF5',
  'combat-spirituel':           '#E8458A',
  'destinee':                   '#F09335',
  'developpement-personnel':    '#3CB97E',
  'entreprise':                 '#00B8C8',
  'femme':                      '#E8458A',
  'identite-en-christ':         '#7B5CF5',
  'leadership':                 '#F09335',
  'mariage-famille-celibat':    '#3CB97E',
  'ministere':                  '#7B5CF5',
  'packs':                      '#4F7EF5',
  'priere':                     '#00B8C8',
  'productivite':               '#F09335',
  'relations':                  '#3CB97E',
  'restauration-transformation':'#E8458A',
  'reussite':                   '#4F7EF5',
  'saint-esprit':               '#F09335',
}

export const genreLabels: Record<GenreKey, string> = {
  'biographie':                 'BIOGRAPHIE',
  'caractere-de-christ':        'CARACTÈRE DE CHRIST',
  'combat-spirituel':           'COMBAT SPIRITUEL',
  'destinee':                   'DESTINÉE',
  'developpement-personnel':    'DÉVELOPPEMENT PERSO',
  'entreprise':                 'ENTREPRISE',
  'femme':                      'FEMME',
  'identite-en-christ':         'IDENTITÉ EN CHRIST',
  'leadership':                 'LEADERSHIP',
  'mariage-famille-celibat':    'MARIAGE & FAMILLE',
  'ministere':                  'MINISTÈRE',
  'packs':                      'PACKS',
  'priere':                     'PRIÈRE',
  'productivite':               'PRODUCTIVITÉ',
  'relations':                  'RELATIONS',
  'restauration-transformation':'RESTAURATION',
  'reussite':                   'RÉUSSITE',
  'saint-esprit':               'SAINT-ESPRIT',
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
