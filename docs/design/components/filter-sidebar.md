# FilterSidebar

Left-side catalog filter panel. Fixed width 240px on desktop, collapses to a bottom sheet on mobile.

---

## Anatomy

```
┌────────────────────────┐
│ Catalog                │  ← H3, font-semibold
│ Explore 24,000+ titles │  ← text-sm text-text-muted
│                        │
│ Categories             │  ← Section label (text-xs, uppercase, tracking-wider)
│ ──────────────────     │
│ ↗ Trending         →  │  ← Active: bg-brand-50, text-brand-600, bold
│ 📖 New Releases        │  ← Default: text-text-secondary
│ 🏆 Award Winners       │
│ ⭐ Staff Picks         │
│ 🏷 Tags / Genre        │
│                        │
│ Genres                 │  ← Section label
│ ──────────────────     │
│ [Sci-Fi] [Romance]     │  ← FilterTags (from Badge component)
│ [Tech] [Thriller]      │
│                        │
│ Price Range            │
│ ──────────────────     │
│ ○━━━━━━━━━━━━━━━○      │  ← Range slider
│ $0              $100+  │
│                        │
│ [Join Reading Club]    │  ← Primary button, full width
└────────────────────────┘
```

---

## Category Item States

| State | Visual |
|---|---|
| Default | `text-text-secondary`, no background |
| Hover | `bg-surface-subtle`, `text-text-primary` |
| Active | `bg-brand-50`, `text-brand-600`, `font-semibold` |
| Focus | `ring-2 ring-brand-600` |

---

## TypeScript Interface

```tsx
type CategoryKey = 'trending' | 'new-releases' | 'award-winners' | 'staff-picks' | 'tags';

interface FilterSidebarProps {
  activeCategory?: CategoryKey;
  onCategoryChange?: (key: CategoryKey) => void;
  activeGenres?: GenreKey[];
  onGenreToggle?: (genre: GenreKey) => void;
  priceRange?: [number, number];
  onPriceChange?: (range: [number, number]) => void;
}
```

---

## Implementation

```tsx
// components/catalog/filter-sidebar.tsx
import { TrendingUp, BookOpen, Award, Star, Tag } from 'lucide-react';
import { FilterTag } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = [
  { key: 'trending' as const,       label: 'Trending',      icon: TrendingUp },
  { key: 'new-releases' as const,   label: 'New Releases',  icon: BookOpen   },
  { key: 'award-winners' as const,  label: 'Award Winners', icon: Award      },
  { key: 'staff-picks' as const,    label: 'Staff Picks',   icon: Star       },
  { key: 'tags' as const,           label: 'Tags / Genre',  icon: Tag        },
] as const;

const availableGenres: GenreKey[] = ['scifi', 'romance', 'tech', 'thriller', 'fantasy', 'lifestyle'];

export function FilterSidebar({
  activeCategory = 'trending',
  onCategoryChange,
  activeGenres = [],
  onGenreToggle,
  priceRange = [0, 100],
  onPriceChange,
}: FilterSidebarProps) {
  return (
    <aside
      className="w-60 shrink-0 flex flex-col gap-6"
      aria-label="Catalog filters"
    >
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Catalog</h2>
        <p className="text-sm text-text-muted mt-0.5">Explore 24,000+ titles</p>
      </div>

      {/* Categories */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Categories
        </p>
        <div className="h-px bg-border mb-3" />
        <nav className="flex flex-col gap-0.5">
          {categories.map(({ key, label, icon: Icon }) => {
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => onCategoryChange?.(key)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm',
                  'transition-colors duration-fast text-left w-full',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                  isActive
                    ? 'bg-brand-50 text-brand-600 font-semibold'
                    : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
                )}
              >
                <Icon size={16} className="shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>
      </section>

      {/* Genres */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Genres
        </p>
        <div className="h-px bg-border mb-3" />
        <div className="flex flex-wrap gap-2">
          {availableGenres.map(genre => (
            <FilterTag
              key={genre}
              genre={genre}
              selected={activeGenres.includes(genre)}
              onClick={() => onGenreToggle?.(genre)}
            />
          ))}
        </div>
      </section>

      {/* Price Range */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Price Range
        </p>
        <div className="h-px bg-border mb-3" />
        <input
          type="range"
          min={0}
          max={100}
          value={priceRange[1]}
          onChange={(e) => onPriceChange?.([priceRange[0], Number(e.target.value)])}
          className="w-full accent-brand-600"
          aria-label="Maximum price"
        />
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>$0</span>
          <span>${priceRange[1]}+</span>
        </div>
      </section>

      {/* CTA */}
      <Button size="md" className="w-full mt-auto">
        Join Reading Club
      </Button>
    </aside>
  );
}
```

---

## Mobile (Bottom Sheet)

On mobile (`< md`), the sidebar becomes a bottom-sheet drawer triggered by a "Filters" button.
The drawer slides up from the bottom, covers 80% of screen height, and has the same content.

Implementation note: use the `dialog` element with `position: fixed; bottom: 0` and `slide-up` animation.

---

## Do / Don't

✓ `aria-label="Catalog filters"` on the `<aside>` element  
✓ `aria-current="true"` on the active category button  
✓ Keep "Join Reading Club" at the bottom — it's a secondary action  
✗ Don't include the sidebar on mobile inline — it takes too much vertical space  
✗ Don't hide inactive categories — all options should always be visible  
