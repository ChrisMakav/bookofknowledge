# BookCard

The primary content unit across catalog, library, and discover views.
Cover art is the visual anchor — all other elements defer to it.

---

## Variants

### Grid (default)
Vertical card. Cover portrait at top, metadata below. Used in catalog grid and "My Collection".
Fixed width in grid: `min-w-[180px]` on mobile, `w-[200px]` on desktop.

### List
Horizontal card. Small cover thumbnail on the left, metadata on the right.
Used in the list-view toggle in "My Collection".

### Featured
Wide card that spans 2–3 columns. Includes synopsis excerpt and prominent CTA.
Used in "Personalized Picks" and "Editor's Choice".

---

## Anatomy (Grid Variant)

```
┌──────────────────────────────┐  ← rounded-card, shadow-card
│ ┌──────────────────────────┐ │
│ │                          │ │
│ │     COVER IMAGE          │ │  ← aspect-[2/3], object-cover, rounded-lg
│ │     (2:3 ratio)          │ │  ← Genre badge (absolute, top-left)
│ │                          │ │
│ └──────────────────────────┘ │
│                              │
│ The Creative Spark           │  ← text-sm font-semibold text-text-primary, truncate
│ Marcus Aurelius              │  ← text-xs text-text-secondary, truncate
│                              │
│ $19.99            ★ 4.8      │  ← price (brand-600, bold) + rating
│ ───────────────────────────  │
│ 65% Read          120/184 pg │  ← progress label + page count
│ ████████████░░░░░░░░░        │  ← ProgressBar
└──────────────────────────────┘
```

Reading progress section is **conditional** — only rendered for library items, not catalog items.

---

## Anatomy (List Variant)

```
┌──────────┬───────────────────────────────────────┐
│  Cover   │  The Creative Spark                   │
│  (2:3)   │  Marcus Aurelius                      │
│  64×96px │                                       │
│          │  $19.99  ★ 4.8                        │
│          │  ── 65% ─────────────────             │
└──────────┴───────────────────────────────────────┘
```

---

## Anatomy (Featured Variant)

```
┌──────────────────────────────────────────────────┐
│ EDITOR'S CHOICE  ★ 4.9                          │
│                                                  │
│  ┌────────┐  Title of the Book                  │
│  │ Cover  │  Author Name                        │
│  │        │                                     │
│  │        │  Short synopsis excerpt, one or    │
│  └────────┘  two sentences max.                 │
│                                                  │
│              [Read Now]                          │
└──────────────────────────────────────────────────┘
```

---

## TypeScript Interface

```tsx
interface BookCardProps {
  id:       string;
  title:    string;
  author:   string;
  cover:    string;           // image URL
  price?:   number;           // undefined = not for sale / library-only
  rating?:  number;           // 0–5
  genre?:   GenreKey;

  // Library-specific props (reading progress)
  readingProgress?: {
    percent:      number;     // 0–100
    pagesRead:    number;
    totalPages:   number;
    finished:     boolean;
  };

  // Featured variant
  synopsis?: string;

  variant?: 'grid' | 'list' | 'featured';
  onAddToCart?:    () => void;
  onAddToLibrary?: () => void;
  onFavorite?:     () => void;
  isFavorited?:    boolean;
}
```

---

## Implementation (Grid Variant)

```tsx
// components/books/book-card.tsx
import { Heart, ShoppingCart } from 'lucide-react';
import { GenreBadge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { RatingStars } from '@/components/ui/rating-stars';
import { cn } from '@/lib/utils';

export function BookCard({
  title, author, cover, price, rating, genre,
  readingProgress, variant = 'grid',
  onFavorite, isFavorited,
}: BookCardProps) {
  if (variant === 'list') return <BookCardList {...{ title, author, cover, price, rating, genre, readingProgress }} />;
  if (variant === 'featured') return <BookCardFeatured {...arguments[0]} />;

  return (
    <article
      className={cn(
        'group relative flex flex-col bg-surface-card rounded-card shadow-card overflow-hidden',
        'transition-all duration-slow ease-default',
        'hover:shadow-hover hover:-translate-y-0.5',
        'cursor-pointer',
      )}
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg m-2 mb-0 flex-shrink-0">
        <img
          src={cover}
          alt={`${title} by ${author}`}
          className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-[1.03]"
        />
        {genre && (
          <div className="absolute top-2 left-2">
            <GenreBadge genre={genre} onCover />
          </div>
        )}
        {onFavorite && (
          <button
            onClick={(e) => { e.stopPropagation(); onFavorite(); }}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            className={cn(
              'absolute top-2 right-2 size-7 flex items-center justify-center rounded-full',
              'bg-black/40 backdrop-blur-sm text-white',
              'transition-colors duration-fast',
              'hover:bg-black/60',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              isFavorited && 'text-red-400',
            )}
          >
            <Heart size={14} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Metadata */}
      <div className="flex flex-col gap-1 p-3 pt-2 flex-1">
        <p className="text-sm font-semibold text-text-primary truncate leading-snug">{title}</p>
        <p className="text-xs text-text-secondary truncate">{author}</p>

        {(price !== undefined || rating !== undefined) && (
          <div className="flex items-center justify-between mt-1">
            {price !== undefined && (
              <span className="text-sm font-bold text-brand-600">
                ${price.toFixed(2)}
              </span>
            )}
            {rating !== undefined && (
              <RatingStars value={rating} size="sm" />
            )}
          </div>
        )}

        {readingProgress && (
          <div className="mt-2 flex flex-col gap-1">
            <div className="flex justify-between text-xs text-text-muted">
              <span className="font-medium uppercase tracking-wide">
                {readingProgress.finished ? 'Finished' : `${readingProgress.percent}% Read`}
              </span>
              <span>{readingProgress.pagesRead} / {readingProgress.totalPages} pgs</span>
            </div>
            <ProgressBar
              value={readingProgress.percent}
              finished={readingProgress.finished}
            />
          </div>
        )}
      </div>
    </article>
  );
}
```

---

## Grid Layout

The card grid uses CSS grid with auto-fill for responsiveness:

```tsx
<div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 sm:gap-5">
  {books.map(book => <BookCard key={book.id} {...book} />)}
</div>
```

---

## Cover Image Requirements

| Attribute | Value |
|---|---|
| Aspect ratio | 2:3 (portrait) — strictly enforced with `aspect-[2/3]` |
| Object fit | `cover` — never `contain` (avoid letterboxing) |
| Alt text | `"[Title] by [Author]"` |
| Dimensions | Provide at minimum 400×600px source image |
| Format | WebP preferred, JPEG fallback |

Never apply border-radius to the `<img>` tag — apply it to the wrapper `<div>` instead. This ensures the `overflow-hidden` clips correctly.

---

## Do / Don't

✓ Always preserve the 2:3 cover aspect ratio  
✓ Show reading progress for library items, hide it for catalog items  
✓ Use `group-hover:scale-[1.03]` on the cover image — not on the entire card  
✓ Truncate title and author with `truncate` — cards have fixed width  
✗ Don't crop cover images — always use `object-cover` within a fixed-ratio container  
✗ Don't show price AND reading progress together — price is for catalog, progress for library  
✗ Don't add extra shadow on the cover image — the card already has `shadow-card`  
