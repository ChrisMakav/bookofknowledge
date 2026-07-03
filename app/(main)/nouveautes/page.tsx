import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { getNewReleases } from '@/actions/books'
import { BookCard } from '@/components/books/book-card'

export const metadata: Metadata = {
  title: 'Nouveautés — Book of Knowledge',
  description: 'Découvrez les dernières parutions de livres chrétiens sur Book of Knowledge.',
}

export default async function NouveautesPage() {
  const books = await getNewReleases()

  return (
    <div className="bg-surface-page min-h-screen">

      {/* Hero */}
      <section
        className="py-16"
        style={{ background: 'linear-gradient(135deg, var(--color-surface-dark) 0%, #2D1B69 60%, #1E1B3A 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/20 text-accent-400 text-xs font-semibold uppercase tracking-wider border border-accent-500/30">
              <Sparkles size={12} />
              Dernières parutions
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Nouveautés
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            Les derniers livres chrétiens ajoutés à notre catalogue, soigneusement sélectionnés pour édifier votre foi.
          </p>
        </div>
      </section>

      {/* Books grid */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          {books.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <p className="text-text-muted text-lg">Aucune nouveauté pour le moment.</p>
              <Link
                href="/catalogue"
                className="inline-flex items-center justify-center h-10 px-6 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
              >
                Explorer le catalogue
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-text-muted mb-8">
                {books.length} livre{books.length > 1 ? 's' : ''} disponible{books.length > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    author={(book as { author?: { name?: string } }).author?.name}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">
            Vous cherchez d&apos;autres livres ?
          </p>
          <Link
            href="/catalogue"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg text-sm font-semibold border border-brand-600 text-brand-600 hover:bg-brand-50 transition-colors"
          >
            Voir tout le catalogue →
          </Link>
        </div>
      </section>

    </div>
  )
}
