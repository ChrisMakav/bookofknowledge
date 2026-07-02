import { RatingStars } from '@/components/ui/rating-stars'
import { cn } from '@/lib/utils'
import type { Review } from '@/types'

const avatarColors = [
  '#7755FF', '#5B3BF5', '#00C8D4',
  '#F09335', '#3CB97E', '#4F7EF5',
]

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function getAvatarColor(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length]
}

function VibeTag({ label }: { label: string }) {
  return (
    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-50 text-brand-600">
      {label}
    </span>
  )
}

interface ReviewCardProps {
  review:     Review & { profile?: { full_name: string | null } }
  className?: string
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const name    = review.profile?.full_name ?? 'Lecteur anonyme'
  const initials   = getInitials(name)
  const avatarColor = getAvatarColor(name)

  return (
    <article
      className={cn(
        'flex flex-col gap-3 p-4 bg-surface-card rounded-xl border border-border shadow-xs',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: avatarColor }}
            aria-hidden
          >
            {initials}
          </div>
          <span className="text-sm font-semibold text-text-primary">{name}</span>
        </div>
        <RatingStars value={review.rating} size="sm" variant="full" />
      </div>

      {review.body && (
        <blockquote className="text-sm text-text-secondary leading-relaxed italic">
          &ldquo;{review.body}&rdquo;
        </blockquote>
      )}

      {review.vibe_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {review.vibe_tags.map((tag) => (
            <VibeTag key={tag} label={tag} />
          ))}
        </div>
      )}
    </article>
  )
}
