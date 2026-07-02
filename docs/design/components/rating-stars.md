# RatingStars

Displays a numeric rating as filled/empty star icons.
Two contexts: compact inline (BookCard), detailed (book detail page with review breakdown).

---

## Anatomy (Inline)

```
★ 4.9
↑   ↑
filled star   numeric value (text-sm, text-text-secondary)
(text-brand-600)
```

Uses a single filled-star icon + numeric value. Not 5 individual star icons — this is the compact variant for cards where space is tight.

---

## Anatomy (Full / Review)

```
★ ★ ★ ★ ★   4.9
↑ ↑ ↑ ↑ ↑     ↑
5 stars          numeric
(partial fills supported)
```

Used on the book detail page and in ReviewCards.

---

## TypeScript Interface

```tsx
interface RatingStarsProps {
  value: number;         // 0–5, decimals supported (4.7)
  count?: number;        // review count, e.g. 2403
  size?: 'sm' | 'md' | 'lg';
  variant?: 'compact' | 'full';
}
```

---

## Implementation

```tsx
// components/ui/rating-stars.tsx
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const sizeMap = {
  sm: { icon: 12, text: 'text-xs' },
  md: { icon: 14, text: 'text-sm' },
  lg: { icon: 18, text: 'text-base' },
};

export function RatingStars({
  value,
  count,
  size = 'md',
  variant = 'compact',
}: RatingStarsProps) {
  const { icon, text } = sizeMap[size];

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1">
        <Star
          size={icon}
          className="text-brand-600 fill-brand-600"
          aria-hidden
        />
        <span className={cn(text, 'font-semibold text-text-secondary')}>
          {value.toFixed(1)}
        </span>
        {count !== undefined && (
          <span className={cn(text, 'text-text-muted')}>
            ({count.toLocaleString()})
          </span>
        )}
      </div>
    );
  }

  // Full variant: 5 stars with partial fill
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`Rating: ${value.toFixed(1)} out of 5${count ? `, ${count.toLocaleString()} reviews` : ''}`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const filled = value >= i + 1;
        const partial = !filled && value > i;
        return (
          <span key={i} className="relative inline-flex">
            {/* Empty star */}
            <Star size={icon} className="text-border-strong" fill="currentColor" />
            {/* Filled overlay (full or partial) */}
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: partial ? `${(value - i) * 100}%` : filled ? '100%' : '0%' }}
            >
              <Star size={icon} className="text-brand-600 fill-brand-600" />
            </span>
          </span>
        );
      })}
      <span className={cn(text, 'font-semibold text-text-primary ml-1')}>
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className={cn(text, 'text-text-muted')}>
          · {count.toLocaleString()} Reviews
        </span>
      )}
    </div>
  );
}
```

---

## Usage

```tsx
// BookCard (compact, no count)
<RatingStars value={4.9} size="sm" />

// BookCard (compact, with count — detail page header)
<RatingStars value={4.9} count={2403} size="md" variant="compact" />

// Book detail page (full 5-star row)
<RatingStars value={4.9} count={2403} size="lg" variant="full" />

// ReviewCard (small, full stars)
<RatingStars value={4} size="sm" variant="full" />
```

---

## Do / Don't

✓ Use `aria-label` on the full variant — screen readers need the numeric context  
✓ Display one decimal place consistently (`4.9`, not `4.90` or `5`)  
✓ Show review count in parentheses when available  
✗ Don't render 5 separate icon buttons in the compact variant — it's too wide for cards  
✗ Don't round `4.7` to `5` — display the actual value  
