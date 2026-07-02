# Book of Knowledge — Component Inventory

All components are built with **Tailwind CSS v4**, **React 19**, and **TypeScript**. 
Icons use **Lucide React**. No component library dependency — all primitives are custom.

---

## Component List

| Component | File | Variants | Status |
|---|---|---|---|
| [Button](./button.md) | `components/ui/button.tsx` | primary, secondary, ghost, icon | Spec |
| [Badge](./badge.md) | `components/ui/badge.tsx` | genre, status, price | Spec |
| [BookCard](./book-card.md) | `components/books/book-card.tsx` | grid, list, featured | Spec |
| [Navigation](./navigation.md) | `components/layout/navbar.tsx` | desktop, mobile | Spec |
| [SearchInput](./search-input.md) | `components/ui/search-input.tsx` | default, expanded | Spec |
| [ProgressBar](./progress-bar.md) | `components/ui/progress-bar.tsx` | reading, compact | Spec |
| [RatingStars](./rating-stars.md) | `components/ui/rating-stars.tsx` | display, interactive | Spec |
| [ReviewCard](./review-card.md) | `components/books/review-card.tsx` | default | Spec |
| [CTABanner](./cta-banner.md) | `components/marketing/cta-banner.tsx` | dark, reading-club | Spec |
| [FilterSidebar](./filter-sidebar.md) | `components/catalog/filter-sidebar.tsx` | catalog | Spec |

---

## Component Anatomy (Shared Patterns)

### Card shell
All card-type components (BookCard, ReviewCard, FavoritesPanel) use this base:
```tsx
<article className="
  bg-surface-card rounded-card shadow-card
  overflow-hidden
  transition-shadow duration-base ease-default
  hover:shadow-hover
">
```

### Interactive element focus ring
All buttons, inputs, and interactive controls:
```tsx
className="
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-brand-600
  focus-visible:ring-offset-2
"
```

### Dark panel shell
Favorites panel, CTA banner, footer:
```tsx
<section className="bg-surface-dark text-text-inverse rounded-panel">
```

### Label / eyebrow text
Small uppercase labels above headings:
```tsx
<span className="text-xs font-semibold tracking-widest uppercase text-accent-500">
  NEW SEASON ARRIVALS
</span>
```

---

## File Conventions

```
app/
components/
  books/
    book-card.tsx        — BookCard (grid + list variants)
    review-card.tsx      — ReviewCard
  catalog/
    filter-sidebar.tsx   — FilterSidebar
  layout/
    navbar.tsx           — Top navigation
    footer.tsx           — Footer
  marketing/
    cta-banner.tsx       — Reading Club CTA
  ui/
    badge.tsx            — Genre, status, price badges
    button.tsx           — Button
    progress-bar.tsx     — Reading progress
    rating-stars.tsx     — Star rating display
    search-input.tsx     — Search field
```

Props interfaces live in the same file as the component (no separate `types.ts` per component). Global types go in `types/index.ts`.
