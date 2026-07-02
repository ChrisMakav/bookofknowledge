# Navigation

Top navigation bar. Fixed, spans full width, sits above all page content.
Height: 64px (`h-16`). Background: `surface-card` with subtle bottom border.

---

## Anatomy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Book of Knowledge     Discover    Catalog    Library*   Community        🔍  🛒  👤 │
└─────────────────────────────────────────────────────────────────────────────┘
  ↑ Logo             ↑ Nav links (center)                    ↑ Actions (right)
                       * active = text-brand-600
                         + underline indicator
```

### Mobile (< 768px)
Icon-only actions (search, cart, user) stay visible. Nav links collapse behind a hamburger menu.

---

## Nav Link States

| State | Visual |
|---|---|
| Default | `text-text-secondary`, no decoration |
| Hover | `text-text-primary`, `bg-surface-subtle` pill |
| Active | `text-brand-600`, underline via `border-b-2 border-brand-600` |
| Focus | `ring-2 ring-brand-600 ring-offset-2` |

The underline indicator is always 2px and `brand-600`. It sits below the text, not through it.

---

## Search Behavior

On desktop: search field is visible inline (`max-w-64`, `SearchInput` component).
On mobile: search icon opens a full-width overlay input.

---

## TypeScript Interface

```tsx
interface NavItem {
  label: string;
  href:  string;
}

interface NavbarProps {
  items?: NavItem[];
  cartCount?: number;
}
```

---

## Implementation

```tsx
// components/layout/navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, CircleUser } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import { cn } from '@/lib/utils';

const defaultItems: NavItem[] = [
  { label: 'Discover', href: '/discover' },
  { label: 'Catalog',  href: '/catalog'  },
  { label: 'Library',  href: '/library'  },
  { label: 'Community',href: '/community'},
];

export function Navbar({ items = defaultItems, cartCount = 0 }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 bg-surface-card border-b border-border">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center gap-8">

        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold text-text-primary shrink-0 font-display
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-sm"
        >
          Book of Knowledge
        </Link>

        {/* Nav links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {items.map(({ label, href }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative px-3 py-1.5 text-sm font-medium rounded-lg',
                  'transition-colors duration-fast',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                  isActive
                    ? 'text-brand-600'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle',
                )}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute bottom-0 inset-x-3 h-0.5 bg-brand-600 rounded-full"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="hidden md:block">
          <SearchInput placeholder="Search stories…" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
            className="relative size-9 flex items-center justify-center rounded-lg text-text-secondary
                       hover:bg-surface-subtle hover:text-text-primary transition-colors duration-fast
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 size-4 flex items-center justify-center
                               bg-brand-600 text-white text-[10px] font-bold rounded-full">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          <button
            aria-label="Account"
            className="size-9 flex items-center justify-center rounded-lg text-text-secondary
                       hover:bg-surface-subtle hover:text-text-primary transition-colors duration-fast
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          >
            <CircleUser size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
```

---

## Page offset

All pages need top padding to clear the fixed nav:
```tsx
// app/layout.tsx or individual page layouts
<main className="pt-16">
  {children}
</main>
```

---

## Do / Don't

✓ Use `'use client'` — `usePathname` requires client rendering  
✓ `aria-label="Main navigation"` on the `<nav>` element  
✓ Show cart count as `9+` when it exceeds 9  
✓ Keep the nav height exactly `h-16` — page layouts depend on `pt-16`  
✗ Don't use `router.push` for nav links — use `<Link>` for performance  
✗ Don't show the search field on mobile inline — it breaks the layout  
✗ Don't add a logo icon separate from the text — "Book of Knowledge" is the brand mark  
