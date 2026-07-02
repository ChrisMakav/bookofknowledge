import { cn } from '@/lib/utils'

interface CTABannerProps {
  headline:    string
  description: string
  primaryCTA:  { label: string; href: string }
  secondaryCTA?: { label: string; href: string }
  className?:  string
}

export function CTABanner({
  headline,
  description,
  primaryCTA,
  secondaryCTA,
  className,
}: CTABannerProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-surface-dark rounded-3xl px-8 py-12 md:px-12 md:py-16',
        className,
      )}
      aria-labelledby="cta-headline"
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 30% 50%, #5B3BF5, transparent)',
        }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-4 max-w-lg">
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
          <a
            href={primaryCTA.href}
            className="inline-flex items-center justify-center h-11 px-6 rounded-lg text-sm font-semibold bg-accent-500 text-surface-dark hover:bg-accent-400 transition-colors duration-[var(--duration-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
          >
            {primaryCTA.label}
          </a>
          {secondaryCTA && (
            <a
              href={secondaryCTA.href}
              className="inline-flex items-center justify-center h-11 px-6 rounded-lg text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors duration-[var(--duration-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
            >
              {secondaryCTA.label}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
