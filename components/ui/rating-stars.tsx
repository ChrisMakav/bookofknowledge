import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const sizeMap = {
  sm: { icon: 12 as const, text: 'text-xs' },
  md: { icon: 14 as const, text: 'text-sm' },
  lg: { icon: 18 as const, text: 'text-base' },
}

interface RatingStarsProps {
  value:    number        // 0–5, decimals supported
  count?:   number        // review count
  size?:    'sm' | 'md' | 'lg'
  variant?: 'compact' | 'full'
  className?: string
}

export function RatingStars({
  value,
  count,
  size    = 'md',
  variant = 'compact',
  className,
}: RatingStarsProps) {
  const { icon, text } = sizeMap[size]
  const display = value.toFixed(1)

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <Star size={icon} className="text-brand-600 fill-brand-600" aria-hidden />
        <span className={cn(text, 'font-semibold text-text-secondary')}>{display}</span>
        {count !== undefined && (
          <span className={cn(text, 'text-text-muted')}>
            ({count.toLocaleString('fr-FR')})
          </span>
        )}
      </div>
    )
  }

  // Full variant: 5 stars with partial fill
  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="img"
      aria-label={`Note : ${display} sur 5${count ? `, ${count.toLocaleString('fr-FR')} avis` : ''}`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const filled  = value >= i + 1
        const partial = !filled && value > i
        return (
          <span key={i} className="relative inline-flex">
            <Star size={icon} className="text-border-strong fill-current" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: partial ? `${(value - i) * 100}%` : filled ? '100%' : '0%' }}
            >
              <Star size={icon} className="text-brand-600 fill-brand-600" />
            </span>
          </span>
        )
      })}
      <span className={cn(text, 'font-semibold text-text-primary ml-1')}>{display}</span>
      {count !== undefined && (
        <span className={cn(text, 'text-text-muted')}>
          · {count.toLocaleString('fr-FR')} avis
        </span>
      )}
    </div>
  )
}
