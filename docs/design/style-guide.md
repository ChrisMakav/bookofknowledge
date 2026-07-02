# Book of Knowledge — Style Guide

**Product:** Digital bookstore and reading companion  
**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Geist Sans

Reference screens: `docs/design/references/`

---

## Brand

Book of Knowledge is a platform for readers who take their reading seriously — and take pleasure in it. The tone is warm but precise: like a knowledgeable friend who reads voraciously and wants to share what they've found. The product celebrates books as cultural objects. Covers are beautiful things. The platform should feel like it knows that.

**Brand character:** Curated. Vibrant. Personal. Not academic, not mass-market.

---

## Visual Principles

### 1. Books take center stage
Cover art is the hero of every screen. Never crop, compress, or skew it. Layouts frame and celebrate covers — they do not compete with them. Preserve the 2:3 portrait ratio at all times.

### 2. Purple is earned, not defaulted
Brand purple (`brand-600: #5B3BF5`) marks what readers care most about: active nav, CTA, progress, prices. Use it with intention. When in doubt, use `surface-subtle` (`#F0EEFF`) instead of reaching for more purple.

### 3. Information has density
This is a catalog and library tool. Compact, scannable layouts are appropriate and expected. Don't over-pad; let readers find things fast. 16px card padding is the minimum floor — below that things feel cramped.

### 4. Dark mode lives in deliberate panels only
`surface-dark` (`#1E1B3A`) creates drama and contrast. It belongs in the Favorites panel, the Reading Club CTA banner, and the footer. The main application is light. Dark backgrounds are not a general-purpose aesthetic tool here.

### 5. Motion serves discovery
Hover lifts on book cards, progress bar fills on mount, skeleton loaders — animation should feel like turning a page: quick and purposeful. One orchestrated moment per screen is enough. Scattered micro-effects read as noise.

---

## Color System

### Palette

| Token | Hex | Usage |
|---|---|---|
| `brand-600` | `#5B3BF5` | Primary CTA, active nav, progress bars, prices |
| `brand-400` | `#9276FF` | Hover tints, secondary indicators |
| `brand-100` | `#E4DDFF` | Tag backgrounds, selected states |
| `brand-50`  | `#F0EEFF` | Subtle hover backgrounds |
| `accent-500` | `#00C8D4` | Status badges, CTA in dark panels |
| `surface-page` | `#F7F5FF` | Page background (catalog, library) |
| `surface-card` | `#FFFFFF` | Card backgrounds |
| `surface-dark` | `#1E1B3A` | Dark panels (Favorites, CTA banner) |
| `text-primary` | `#0F0D26` | Headlines, body copy |
| `text-secondary` | `#5A5870` | Author names, descriptions |
| `text-muted` | `#9795A8` | Timestamps, captions |

### Genre badge colors (fixed identifiers)

These are identity colors for genres, not theming choices. Never remap them.

| Genre | Token | Hex |
|---|---|---|
| Sci-Fi | `genre-scifi` | `#00B8C8` |
| Romance | `genre-romance` | `#F09335` |
| Thriller | `genre-thriller` | `#E8458A` |
| Fantasy | `genre-fantasy` | `#7B5CF5` |
| Lifestyle | `genre-lifestyle` | `#3CB97E` |
| Technology | `genre-tech` | `#4F7EF5` |

### Color usage rules

**Use `brand-600` for:** Primary buttons, active navigation link, book prices, reading progress bars, links, star ratings (filled).

**Use `accent-500` for:** "NEW SEASON ARRIVALS" badge, "BESTSELLER" badge, primary CTA button inside dark panels (`surface-dark`).

**Use `surface-page` for:** Background of catalog, library, and discover views. Not the home hero — that uses white or a gradient.

**Do not use purple for:** Decorative dividers, general icons, backgrounds of non-interactive elements. Every instance of brand purple should be interactive or informational. Diluting the signal makes CTAs less readable.

---

## Typography

### Fonts

| Role | Family | Usage |
|---|---|---|
| Display | Plus Jakarta Sans | Hero headlines, large book titles |
| Body / UI | Geist Sans (loaded via `next/font/google`) | Navigation, labels, body copy, prices |
| Mono | Geist Mono | Code excerpts only |

**Adding Plus Jakarta Sans** (add to `app/layout.tsx`):
```tsx
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  weight: ['700', '800'],
});
```

Then update `--font-display` in tokens.css:
```css
--font-display: var(--font-plus-jakarta), var(--font-sans);
```

### Type scale

| Name | Size | Weight | Leading | Tracking | Usage |
|---|---|---|---|---|---|
| Display XL | 72px / 4.5rem | 800 | 1.0 | −0.025em | Hero headline |
| Display L | 60px / 3.75rem | 800 | 1.0 | −0.025em | Section hero |
| H1 | 48px / 3rem | 700 | 1.0 | −0.025em | Book title (detail page) |
| H2 | 36px / 2.25rem | 700 | 1.2 | −0.015em | Section headings ("My Collection") |
| H3 | 24px / 1.5rem | 600 | 1.35 | 0 | Panel titles, card headers |
| H4 | 20px / 1.25rem | 600 | 1.5 | 0 | Subsection labels |
| Body L | 18px / 1.125rem | 400 | 1.65 | 0 | Feature descriptions |
| Body | 16px / 1rem | 400 | 1.5 | 0 | General content |
| Body S | 14px / 0.875rem | 400 | 1.5 | 0 | Author names, meta |
| Caption | 12px / 0.75rem | 500 | 1.0 | +0.05em | Labels, genre badges |

### Typography rules

- **Display text** (72–48px): Always `font-display`, weight 700–800, tracking tight. Never italic.
- **Book titles in cards**: Body S (`text-sm`) weight 600, single line truncated. NOT display face — display is reserved for featured/hero contexts.
- **Prices**: `text-base` or `text-lg`, weight 700, `text-brand-600`. Sizes mirror importance.
- **Author names**: `text-sm`, weight 400, `text-text-secondary`.
- **Progress labels** ("65% Read"): `text-xs`, weight 500, `text-text-muted`, all-caps.
- **Genre badges**: `text-xs`, weight 700, `tracking-widest`, uppercase.

---

## Spacing

Base unit: 4px. All spacing is a multiple of 4px.

### Component-level patterns

| Context | Value | Tailwind |
|---|---|---|
| Card padding (default) | 16px | `p-4` |
| Card padding (featured) | 20px | `p-5` |
| Stack gap (elements in card) | 8px | `gap-2` |
| Stack gap (tight pairs — title + author) | 4px | `gap-1` |
| Section vertical padding | 48px | `py-12` |
| Section horizontal padding (mobile) | 24px | `px-6` |
| Section horizontal padding (desktop) | 32px | `px-8` |
| Nav height | 64px | `h-16` |
| Sidebar width | 240px | `w-60` |
| Content max-width | 1280px | `max-w-7xl` |

---

## Border Radius

| Token | Size | Usage |
|---|---|---|
| `rounded-sm` | 6px | Small UI elements |
| `rounded-lg` (`radius-button`) | 12px | Buttons, inputs |
| `rounded-xl` (`radius-card`) | 16px | Book cards |
| `rounded-2xl` (`radius-panel`) | 20px | Stats panel, Favorites panel |
| `rounded-3xl` (`radius-banner`) | 24px | Reading Club CTA banner |
| `rounded-full` (`radius-badge`) | 9999px | Genre badges, avatar, pill tags |

Book card images use `rounded-lg` to match the card's inner content, not the card outer radius. This prevents the overflow mismatch.

---

## Shadows

All shadows carry a purple tint (`rgba(91, 59, 245, …)`) to stay harmonious with the brand palette. Never use grey box shadows.

| Token | Usage |
|---|---|
| `shadow-sm` (`shadow-card`) | Resting state of cards |
| `shadow-md` (`shadow-hover`) | Hovered card, open dropdown |
| `shadow-lg` (`shadow-panel`) | Modal overlays, sticky nav |
| `shadow-xl` (`shadow-modal`) | Full-screen overlays |

---

## Motion

| Speed | Duration | Use case |
|---|---|---|
| Fast | 150ms | Hover color/background changes, focus rings |
| Base | 200ms | Button presses, dropdown open, icon rotations |
| Slow | 300ms | Card hover lift, sidebar slide in/out |
| Slower | 500ms | Progress bar fill on mount, chart draw, FAB appear |

**Easing:**
- `ease-default` (`cubic-bezier(0.4, 0, 0.2, 1)`) — standard, most transitions
- `ease-spring` (`cubic-bezier(0.34, 1.56, 0.64, 1)`) — card lift, FAB appear

**One rule:** Orchestrate, don't scatter. If a section has a page-load animation, that's the animation for the page. Adding hover animations on top of entrance animations creates noise. Choose which interaction type carries the motion and let the other be static.

Always respect `prefers-reduced-motion`. The tokens.css base styles handle this globally.

---

## Iconography

Use **Lucide React** (`lucide-react`). Icons default to `currentColor` — they inherit the text color of their parent.

Sizing:
- `size={16}` — inline with text labels
- `size={20}` — most UI contexts (nav, card actions)
- `size={24}` — primary actions (cart, user avatar in nav)

Key icons by context:

| Context | Icon |
|---|---|
| Nav: cart | `ShoppingCart` |
| Nav: user | `CircleUser` |
| Nav: search | `Search` |
| Sidebar: trending | `TrendingUp` |
| Sidebar: new releases | `BookOpen` |
| Sidebar: awards | `Award` |
| Sidebar: staff picks | `Star` |
| Sidebar: tags/genre | `Tag` |
| Book: favorite | `Heart` |
| Book: share | `Share2` |
| Book: buy | `ShoppingCart` |
| UI: grid view | `LayoutGrid` |
| UI: list view | `List` |
| UI: next page | `ChevronRight` |
| UI: prev page | `ChevronLeft` |
| FAB: add book | `Plus` |

Icons inside dark panels (`surface-dark`) should be `text-text-inverse` or `text-text-inverse-muted`.

---

## Do / Don't

### DO
- Use cover art at its native 2:3 portrait ratio
- Keep `brand-600` for interactive and active elements only
- Show reading progress on every book in the library — it's the core data
- Use genre colors as identity markers (SCI-FI is always `genre-scifi`, never a random color)
- Pair dark panels (`surface-dark`) with white text and `accent-500` CTAs

### DON'T
- Use `surface-dark` for general page backgrounds — it's a deliberate moment, not a mode
- Mix genre badge colors (SCI-FI cyan on a Thriller card, etc.)
- Compress or stretch book cover images
- Apply `brand-600` to decorative elements — it dilutes the CTA signal
- Add border-radius to book cover images larger than the card's radius
- Italicize display headlines
- Use more than two motion behaviors on the same UI element

---

## Tailwind v4 Integration

Tailwind v4 reads `@theme` in CSS — no `tailwind.config.js` needed.

**Step 1:** Import the token file in `app/globals.css`:
```css
@import "tailwindcss";
@import "../docs/design/tokens.css";
```

**Step 2:** Use generated utility classes:
```tsx
// Colors
<div className="bg-brand-600 text-text-inverse" />
<span className="text-genre-scifi" />

// Border radius
<div className="rounded-card shadow-card" />
<span className="rounded-badge" />

// Typography
<h1 className="font-display text-5xl font-extrabold tracking-tight" />
```

**Step 3:** For values not in the scale, use arbitrary values:
```tsx
<div className="bg-[#5B3BF5]" />       // one-off color
<div className="rounded-[14px]" />      // one-off radius
```

Arbitrary values are acceptable for one-off overrides but should not replace tokens for any value used more than once.
