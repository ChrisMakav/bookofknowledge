# Badge

Small, high-density label for genres, status, and price/rating indicators.

---

## Variants

### Genre Badge
Identifies the genre of a book. Color is a fixed identifier — never changes based on context.

Displayed as a colored pill with a dark overlay on book cover images, or as a standalone pill in the filter sidebar / book detail page.

**On cover (overlay):** Dark background + colored text for legibility over varied cover art.
**Off cover (filter tags):** Colored `brand-50`–`brand-100` range fill + darker text.

### Status Badge
System-level status. Used for "BESTSELLER #1", "NEW SEASON ARRIVALS", "STAFF PICK", "EDITOR'S CHOICE".
Always uses `accent-500` (cyan) background. White text.

### Price Badge
Inline price display within a card or detail page. Not a pill shape — it's bold text with `text-brand-600`.

### Progress Chip
Small percentage badge on reading cards. E.g. "+12% from last month". Pill shape, `brand-50` background, `brand-600` text.

---

## Anatomy (Genre Badge on Cover)

```
┌─────────────────┐
│  SCI-FI         │  ← 12px / bold / uppercase / tracking-widest
└─────────────────┘
  ↑
  bg: semi-transparent dark overlay
  text-color: genre-scifi (#00B8C8)
  border-radius: full (pill)
  padding: 2px 8px
```

---

## TypeScript Interface

```tsx
type GenreKey = 'scifi' | 'romance' | 'thriller' | 'fantasy' | 'lifestyle' | 'tech';

interface GenreBadgeProps {
  genre: GenreKey;
  onCover?: boolean;   // true = dark overlay background (for use on cover images)
}

interface StatusBadgeProps {
  label: string;       // e.g. "BESTSELLER #1", "STAFF PICK"
}

interface ProgressChipProps {
  value: string;       // e.g. "+12% from last month"
}
```

---

## Implementation

```tsx
// components/ui/badge.tsx

const genreColors: Record<GenreKey, string> = {
  scifi:     '#00B8C8',
  romance:   '#F09335',
  thriller:  '#E8458A',
  fantasy:   '#7B5CF5',
  lifestyle: '#3CB97E',
  tech:      '#4F7EF5',
};

const genreLabels: Record<GenreKey, string> = {
  scifi:     'SCI-FI',
  romance:   'ROMANCE',
  thriller:  'THRILLER',
  fantasy:   'FANTASY',
  lifestyle: 'LIFESTYLE',
  tech:      'TECH',
};

export function GenreBadge({ genre, onCover = false }: GenreBadgeProps) {
  const color = genreColors[genre];

  if (onCover) {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-badge text-xs font-bold tracking-widest uppercase bg-black/60 backdrop-blur-sm"
        style={{ color }}
      >
        {genreLabels[genre]}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-badge text-xs font-bold tracking-widest uppercase"
      style={{ color, backgroundColor: `${color}1A` }}   // 10% opacity fill
    >
      {genreLabels[genre]}
    </span>
  );
}

export function StatusBadge({ label }: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-badge text-xs font-bold tracking-widest uppercase bg-accent-500 text-white">
      {label}
    </span>
  );
}

export function ProgressChip({ value }: ProgressChipProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-badge text-xs font-semibold bg-brand-50 text-brand-600">
      {value}
    </span>
  );
}
```

---

## Filter Sidebar Tags (Selectable Genre Tags)

In the catalog sidebar, genre tags are selectable. Selected state uses `brand-600` fill.

```tsx
interface FilterTagProps {
  genre: GenreKey;
  selected?: boolean;
  onClick?: () => void;
}

export function FilterTag({ genre, selected = false, onClick }: FilterTagProps) {
  const color = genreColors[genre];

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-badge text-xs font-bold tracking-widest uppercase',
        'transition-all duration-base ease-default',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1',
        selected
          ? 'bg-brand-600 text-white'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle',
      )}
      style={!selected ? { color } : undefined}
      aria-pressed={selected}
    >
      {genreLabels[genre]}
    </button>
  );
}
```

---

## Usage Examples

```tsx
// On a book cover image (absolute positioned)
<div className="relative">
  <img src={cover} alt={title} />
  <div className="absolute top-2 left-2">
    <GenreBadge genre="scifi" onCover />
  </div>
</div>

// In a book detail page (off cover)
<GenreBadge genre="thriller" />
<GenreBadge genre="scifi" />

// Status
<StatusBadge label="BESTSELLER #1" />
<StatusBadge label="STAFF PICK" />
<StatusBadge label="NEW SEASON ARRIVALS" />

// Progress chip (reading stats)
<ProgressChip value="+12% from last month" />
```

---

## Do / Don't

✓ Always uppercase genre labels  
✓ Use `onCover` prop when badge overlays book artwork  
✓ Keep genre colors fixed — `scifi` is always cyan, `romance` always orange  
✗ Don't manually set genre colors inline — always use the `genre` prop  
✗ Don't stack more than 3 genre badges in a single card context  
✗ Don't use `StatusBadge` for genres — they have different visual weight  
