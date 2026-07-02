# Button

Primary interactive control. Appears in CTA contexts, sidebar actions, and book purchase flows.

---

## Variants

### Primary
The dominant CTA. Used for "Buy Now", "Start Reading", "Claim My $1 Month".
Background: `brand-600`. White text. Hover darkens to `brand-700`.

### Secondary
Outline style. Used for "Add to Library", "Explore Genres", "Learn More" — complementary to a nearby primary.
Border: `brand-600`. Text: `brand-600`. Hover: `surface-subtle` fill.

### Ghost
No border, no background. Used for navigation actions, "View All →" links.
Text: `text-secondary`. Hover: `surface-subtle`.

### Icon
Square button with a single icon. Used for grid/list toggle, share, heart (favorite).
Size: 36×36px (`size-9`). Same focus ring as other variants.

---

## Sizes

| Size | Height | Padding | Font size | Usage |
|---|---|---|---|---|
| sm | 32px (`h-8`) | `px-3` | `text-sm` | Compact contexts (card actions) |
| md | 40px (`h-10`) | `px-4` | `text-sm` | Default |
| lg | 48px (`h-12`) | `px-6` | `text-base` | Hero CTA, sidebar CTA |

---

## States

| State | Visual |
|---|---|
| Default | As specified per variant |
| Hover | Darker background (primary), subtle fill (secondary/ghost), `scale-[1.01]` |
| Active / pressed | `scale-[0.98]`, slightly darker |
| Focus visible | `ring-2 ring-brand-600 ring-offset-2` |
| Disabled | `opacity-50 cursor-not-allowed`, no hover effects |
| Loading | Spinner icon replaces label, disabled interaction |

---

## TypeScript Interface

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;        // optional leading icon
  iconAfter?: React.ReactNode;   // optional trailing icon
}
```

---

## Implementation

```tsx
// components/ui/button.tsx
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  primary:   'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
  secondary: 'border border-brand-600 text-brand-600 hover:bg-surface-subtle active:bg-brand-100',
  ghost:     'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
  icon:      'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
};

const sizes = {
  sm: 'h-8 px-3 text-sm rounded-button gap-1.5',
  md: 'h-10 px-4 text-sm rounded-button gap-2',
  lg: 'h-12 px-6 text-base rounded-button gap-2.5',
};

const iconSizes = {
  sm: 'size-8',
  md: 'size-9',
  lg: 'size-10',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconAfter,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isIcon = variant === 'icon';

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold',
        'transition-all duration-base ease-default',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-brand-600 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        isIcon ? iconSizes[size] : sizes[size],
        isIcon ? 'rounded-button' : '',
        variants[variant],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <>
          {icon}
          {children}
          {iconAfter}
        </>
      )}
    </button>
  );
}
```

---

## Usage Examples

```tsx
// Hero CTA
<Button size="lg">Start Reading</Button>

// Paired CTAs (primary + secondary)
<Button size="lg">Claim My $1 Month</Button>
<Button size="lg" variant="secondary">Learn More</Button>

// Buy Now (book detail page)
<Button size="lg" icon={<ShoppingCart size={18} />}>
  Buy Now — $24.99
</Button>

// Add to Library (outline)
<Button variant="secondary" size="lg" icon={<BookmarkPlus size={18} />}>
  Add to Library
</Button>

// Grid/List toggle
<Button variant="icon" size="md" aria-label="Grid view">
  <LayoutGrid size={20} />
</Button>

// Loading state
<Button loading>Purchasing…</Button>
```

---

## Dark Panel Variant

Inside `surface-dark` backgrounds (Favorites, CTA banner), the secondary button inverts:
```tsx
// bg-surface-dark context
<Button variant="secondary" className="border-white/30 text-white hover:bg-white/10">
  Learn More
</Button>

// Primary CTA in dark panel uses accent instead of brand
<Button className="bg-accent-500 text-surface-dark hover:bg-accent-400">
  Claim My $1 Month
</Button>
```

---

## Do / Don't

✓ Always include an accessible label for icon buttons (`aria-label`)  
✓ Pair a primary with a secondary when offering two choices — never two primaries  
✓ Use `size="lg"` for hero CTAs — they need breathing room  
✗ Don't use `brand-600` background inside `surface-dark` panels — use `accent-500`  
✗ Don't place more than one primary button in the same visual group  
✗ Don't truncate button text — buttons should always show their complete label  
