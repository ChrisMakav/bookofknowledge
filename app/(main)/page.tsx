import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, BookOpen, Shield } from 'lucide-react'
import { getFeaturedBooks, getNewReleases, getTrendingBooks } from '@/actions/books'
import { BookCard } from '@/components/books/book-card'
import { CTABanner } from '@/components/marketing/cta-banner'
import type { Book } from '@/types'

export const metadata: Metadata = {
  title: 'Book of Knowledge — Grandis dans la foi, un livre à la fois',
  description: 'La librairie chrétienne de référence. Des centaines de livres soigneusement sélectionnés pour nourrir ton âme, développer ton caractère et accomplir ta destinée.',
}

// ─── Sections ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Biographie',                      emoji: '📖', href: '/catalogue?genre=biographie',                color: '#4F7EF5' },
  { label: 'Caractère de Christ',             emoji: '✝️', href: '/catalogue?genre=caractere-de-christ',       color: '#7B5CF5' },
  { label: 'Combat spirituel',                emoji: '⚔️', href: '/catalogue?genre=combat-spirituel',          color: '#E8458A' },
  { label: 'Destinée',                        emoji: '🎯', href: '/catalogue?genre=destinee',                  color: '#F09335' },
  { label: 'Développement personnel',         emoji: '🌱', href: '/catalogue?genre=developpement-personnel',   color: '#3CB97E' },
  { label: 'Entreprise',                      emoji: '💼', href: '/catalogue?genre=entreprise',                color: '#00B8C8' },
  { label: 'Femme',                           emoji: '👑', href: '/catalogue?genre=femme',                     color: '#E8458A' },
  { label: 'Identité en Christ',              emoji: '🕊️', href: '/catalogue?genre=identite-en-christ',        color: '#7B5CF5' },
  { label: 'Leadership',                      emoji: '🏆', href: '/catalogue?genre=leadership',                color: '#F09335' },
  { label: 'Mariage, famille, célibat',       emoji: '❤️', href: '/catalogue?genre=mariage-famille-celibat',   color: '#3CB97E' },
  { label: 'Ministère',                       emoji: '🙏', href: '/catalogue?genre=ministere',                 color: '#7B5CF5' },
  { label: 'Packs',                           emoji: '📦', href: '/catalogue?genre=packs',                     color: '#4F7EF5' },
  { label: 'Prière',                          emoji: '🙌', href: '/catalogue?genre=priere',                    color: '#00B8C8' },
  { label: 'Productivité',                    emoji: '⚡', href: '/catalogue?genre=productivite',              color: '#F09335' },
  { label: 'Relations',                       emoji: '🤝', href: '/catalogue?genre=relations',                 color: '#3CB97E' },
  { label: 'Restauration & Transformation',   emoji: '🌟', href: '/catalogue?genre=restauration-transformation', color: '#E8458A' },
  { label: 'Réussite',                        emoji: '🚀', href: '/catalogue?genre=reussite',                  color: '#4F7EF5' },
  { label: 'Saint-Esprit',                    emoji: '🔥', href: '/catalogue?genre=saint-esprit',              color: '#F09335' },
]

const TRUST_FEATURES = [
  { icon: BookOpen, label: 'Livres chrétiens',      sub: 'Soigneusement sélectionnés' },
  { icon: Sparkles, label: 'Auteurs inspirants',    sub: 'Des voix qui édifient' },
  { icon: Shield,   label: 'Paiement sécurisé',    sub: 'Stripe, 3D Secure' },
]

function Section({
  title,
  seeAllHref,
  children,
}: {
  title:       string
  seeAllHref?: string
  children:    React.ReactNode
}) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-display text-text-primary">{title}</h2>
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="text-sm text-brand-600 font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded"
            >
              Voir tout
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}

function BookRow({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          author={(book as { author?: { name?: string } }).author?.name}
        />
      ))}
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="relative overflow-hidden min-h-[60vh] flex items-center"
      style={{
        background: 'linear-gradient(135deg, var(--color-surface-dark) 0%, #2D1B69 60%, #1E1B3A 100%)',
      }}
    >
      {/* Decorative orb */}
      <div
        className="absolute -top-24 -right-24 size-96 rounded-full opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #7755FF 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/20 text-accent-400 text-xs font-semibold uppercase tracking-wider border border-accent-500/30">
            <Sparkles size={12} />
            Librairie chrétienne de référence
          </span>

          <h1 className="font-display text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
            Grandis dans la foi,
            <br />
            <span className="text-accent-400">un livre à la fois</span>
          </h1>

          <p className="text-base md:text-lg text-text-inverse-muted leading-relaxed max-w-xl">
            Des centaines de livres chrétiens soigneusement sélectionnés pour
            nourrir ton âme, développer ton caractère et accomplir ta destinée.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors duration-[var(--duration-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
            >
              Explorer le catalogue
            </Link>
            <Link
              href="/decouvrir"
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors duration-[var(--duration-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Découvrir
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap gap-6 mt-2">
            {TRUST_FEATURES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={16} className="text-accent-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">{label}</p>
                  <p className="text-[11px] text-text-inverse-muted">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Category pills ───────────────────────────────────────────────────────────

function CategoryRail() {
  return (
    <section className="py-8 border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {CATEGORIES.map(({ label, emoji, href, color }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-border hover:shadow-sm transition-all duration-[var(--duration-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              style={{ color }}
            >
              <span>{emoji}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [featured, newReleases, trending] = await Promise.all([
    getFeaturedBooks(),
    getNewReleases(),
    getTrendingBooks(),
  ])

  return (
    <>
      <Hero />
      <CategoryRail />

      {trending.length > 0 && (
        <div className="bg-surface-page">
          <Section title="En ce moment" seeAllHref="/catalogue?sort=popularity">
            <BookRow books={trending} />
          </Section>
        </div>
      )}

      {newReleases.length > 0 && (
        <div className="bg-white">
          <Section title="Nouveautés" seeAllHref="/catalogue?sort=newest">
            <BookRow books={newReleases} />
          </Section>
        </div>
      )}

      {featured.length > 0 && (
        <div className="bg-surface-page">
          <Section title="Notre sélection" seeAllHref="/catalogue">
            <BookRow books={featured} />
          </Section>
        </div>
      )}

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <CTABanner
            headline="Votre prochaine transformation commence ici"
            description="Parcourez notre catalogue de livres chrétiens, découvrez des auteurs qui édifient et trouvez le livre qui changera votre vie."
            primaryCTA={{ label: 'Explorer le catalogue', href: '/catalogue' }}
            secondaryCTA={{ label: 'Découvrir', href: '/decouvrir' }}
          />
        </div>
      </div>
    </>
  )
}
