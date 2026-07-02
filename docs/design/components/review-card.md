# ReviewCard

Displays a single reader review. Used in the "Reader Vibes" section on the book detail page.

---

## Anatomy

```
┌──────────────────────────────────────────┐
│  JS  Jordan S.              ★ ★ ★ ★ ☆   │
│                                           │
│  "Mind-bending. The pacing is like a     │
│   digital heartbeat. I couldn't put      │
│   it down!"                              │
│                                           │
│  FAST-PACED   IMMERSIVE                  │
└──────────────────────────────────────────┘
  ↑ Avatar initials + name
                     ↑ Star rating (full variant, sm size)
      ↑ Review text (italic, text-text-secondary)
                     ↑ Reader-applied vibe tags (small badges)
```

---

## Vibe Tags

Vibe tags are reader-applied labels on reviews (e.g., "FAST-PACED", "IMMERSIVE", "CHARACTER-DRIVEN").
They use `brand-50` background + `brand-600` text. Not genre colors — they're editorial tags.

```tsx
export function VibeTag({ label }: { label: string }) {
  return (
    <span className="inline-flex px-2 py-0.5 rounded-badge text-xs font-semibold tracking-wider uppercase bg-brand-50 text-brand-600">
      {label}
    </span>
  );
}
```

---

## Avatar Initials

Generated from the reviewer's name. Background uses a stable color derived from the name — not random on each render.

```tsx
function getAvatarColor(name: string): string {
  const colors = [
    '#7755FF', // brand-500
    '#5B3BF5', // brand-600
    '#00C8D4', // accent-500
    '#F09335', // genre-romance
    '#3CB97E', // genre-lifestyle
    '#4F7EF5', // genre-tech
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}
```

---

## TypeScript Interface

```tsx
interface ReviewCardProps {
  id:         string;
  reviewer:   string;        // "Jordan S."
  rating:     number;        // 0–5
  text:       string;
  vibeTags?:  string[];      // ["FAST-PACED", "IMMERSIVE"]
}
```

---

## Implementation

```tsx
// components/books/review-card.tsx
import { RatingStars } from '@/components/ui/rating-stars';
import { cn } from '@/lib/utils';

export function ReviewCard({ reviewer, rating, text, vibeTags }: ReviewCardProps) {
  const initials = getInitials(reviewer);
  const avatarColor = getAvatarColor(reviewer);

  return (
    <article
      className="flex flex-col gap-3 p-4 bg-surface-card rounded-card border border-border shadow-xs"
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
          <span className="text-sm font-semibold text-text-primary">{reviewer}</span>
        </div>
        <RatingStars value={rating} size="sm" variant="full" />
      </div>

      <blockquote className="text-sm text-text-secondary leading-relaxed italic">
        "{text}"
      </blockquote>

      {vibeTags && vibeTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {vibeTags.map(tag => (
            <VibeTag key={tag} label={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
```

---

## Review Score Summary

Below the review cards, the detail page shows aggregate score rings for Overall, Plot, Style, Pacing.
These use a circular progress indicator:

```
  4.9        98%         92%        85%
OVERALL      Plot        Style     Pacing
```

Each ring uses an SVG circle with a stroke-dasharray to show the percentage. The ring color:
- Overall: `brand-600` fill (solid circle, bold)
- Plot/Style/Pacing: `brand-600` stroke on `border-subtle` track

---

## Usage

```tsx
// Reviews grid (2 columns on md+)
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {reviews.slice(0, 4).map(review => (
    <ReviewCard key={review.id} {...review} />
  ))}
</div>

<button className="text-sm font-semibold text-brand-600 hover:text-brand-700">
  View All Reviews →
</button>
```

---

## Do / Don't

✓ Use `<blockquote>` for the review text — it's a quotation  
✓ Wrap quotes in typographic quote marks `"…"`  
✓ Derive avatar color from name, not randomly — prevents color changes on re-render  
✗ Don't show full star count if 0 reviews — skip the rating section  
✗ Don't truncate review text in the card — let it wrap naturally  
