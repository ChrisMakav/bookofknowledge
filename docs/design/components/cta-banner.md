# CTABanner

Full-width dark promotional section. Used for "Join the Reading Club" on the Discover page.
The one place in the UI where `surface-dark` is used as a background — it should feel like a deliberate shift.

---

## Anatomy

```
┌──────────────────────────────────────────────────────────────────┐  bg-surface-dark
│                                                                  │  rounded-banner
│  Join the Reading Club                                           │  ← H2, text-white, font-display
│                                                                  │
│  Unlock unlimited access to 10,000+ titles, exclusive           │  ← text-sm, text-text-inverse-muted
│  author Q&As, and a community of fellow book lovers.            │
│  Get your first month for only $1.                              │
│                                                                  │
│  [Claim My $1 Month]  [Learn More]                              │  ← accent-500 primary + white outline secondary
│                                                                  │
│                                            📱 📱 📱             │  ← decorative device images (right-aligned)
└──────────────────────────────────────────────────────────────────┘
```

---

## Color Composition

| Element | Color |
|---|---|
| Background | `surface-dark` (#1E1B3A) |
| Headline | `text-inverse` (white) |
| Body text | `text-inverse-muted` (#B8B5D0) |
| Primary CTA | `accent-500` (#00C8D4) background, `surface-dark` text |
| Secondary CTA | Outline `border-white/30`, `text-white`, hover `bg-white/10` |
| Decorative border | `border-dark` (#2E2A50), subtle |

The primary CTA uses `accent-500`, not `brand-600`. Inside a dark panel, brand purple would be too close in luminosity to the background — cyan creates better contrast and signals a special offer.

---

## TypeScript Interface

```tsx
interface CTABannerProps {
  headline:    string;
  description: string;
  primaryCTA: {
    label: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    label: string;
    onClick: () => void;
  };
  decorativeImage?: string;   // optional right-side image URL
  className?: string;
}
```

---

## Implementation

```tsx
// components/marketing/cta-banner.tsx
import { cn } from '@/lib/utils';

export function CTABanner({
  headline,
  description,
  primaryCTA,
  secondaryCTA,
  decorativeImage,
  className,
}: CTABannerProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-surface-dark rounded-banner px-8 py-12',
        'md:px-12 md:py-16',
        className,
      )}
      aria-labelledby="cta-headline"
    >
      {/* Subtle radial glow — one visual flourish, not decorative clutter */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 30% 50%, #5B3BF5, transparent)',
        }}
        aria-hidden
      />

      <div className="relative flex flex-col md:flex-row items-center gap-8">
        {/* Content */}
        <div className="flex flex-col gap-4 max-w-lg">
          <h2
            id="cta-headline"
            className="font-display text-3xl md:text-4xl font-extrabold text-white leading-tight"
          >
            {headline}
          </h2>
          <p className="text-sm md:text-base text-text-inverse-muted leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <button
              onClick={primaryCTA.onClick}
              className="h-11 px-6 rounded-button text-sm font-semibold
                         bg-accent-500 text-surface-dark
                         hover:bg-accent-400 active:bg-accent-600
                         transition-colors duration-base
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
            >
              {primaryCTA.label}
            </button>

            {secondaryCTA && (
              <button
                onClick={secondaryCTA.onClick}
                className="h-11 px-6 rounded-button text-sm font-semibold
                           border border-white/30 text-white
                           hover:bg-white/10 active:bg-white/20
                           transition-colors duration-base
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
              >
                {secondaryCTA.label}
              </button>
            )}
          </div>
        </div>

        {/* Decorative image */}
        {decorativeImage && (
          <div className="shrink-0 md:ml-auto" aria-hidden>
            <img
              src={decorativeImage}
              alt=""
              className="w-48 md:w-64 object-contain drop-shadow-2xl"
            />
          </div>
        )}
      </div>
    </section>
  );
}
```

---

## Usage

```tsx
<CTABanner
  headline="Join the Reading Club"
  description="Unlock unlimited access to 10,000+ titles, exclusive author Q&As, and a community of fellow book lovers. Get your first month for only $1."
  primaryCTA={{ label: 'Claim My $1 Month', onClick: handleJoin }}
  secondaryCTA={{ label: 'Learn More', onClick: handleLearnMore }}
  decorativeImage="/images/reading-club-devices.webp"
  className="mx-4 md:mx-8"
/>
```

---

## Radial Glow

The subtle purple radial gradient is the "one visual risk" in this component. It grounds the banner in the brand palette without making the background feel flat. The gradient opacity stays at 0.20 — higher than that it competes with the copy.

---

## Do / Don't

✓ Use `accent-500` (cyan) for the primary CTA — not `brand-600`  
✓ Keep the `aria-labelledby` to label the section for screen readers  
✓ `alt=""` on the decorative image — it's presentational  
✓ Apply `rounded-banner` (`1.5rem`) — the large radius is part of the design language  
✗ Don't fill the entire page background with `surface-dark` — this is a sectional component  
✗ Don't add text shadows or extra glow effects on top of the radial gradient  
✗ Don't remove the secondary CTA — pairing "Claim" + "Learn More" is the correct purchase funnel  
