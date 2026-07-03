import type { Metadata } from 'next'
import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { getBestsellers } from '@/actions/books'
import { BookCard } from '@/components/books/book-card'

export const metadata: Metadata = {
  title: 'Bestsellers — Book of Knowledge',
  description: 'Les livres chrétiens les plus lus et les mieux notés sur Book of Knowledge.',
}

export default async function BestsellersPage() {
  const books = await getBestsellers()

  return (
    <div className="bg-surface-page min-h-screen">

      {/* Hero */}
      <section
        className="py-16"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #3d2c8d 60%, #1E1B3A 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold uppercase tracking-wider border border-yellow-500/30">
              <Trophy size={12} />
              Les plus lus
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Bestsellers
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            Les livres chrétiens les plus appréciés par notre communauté. Des œuvres qui transforment et édifient.
          </p>
        </div>
      </section>

      {/* Books grid */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          {books.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <p className="text-text-muted text-lg">Aucun bestseller pour le moment.</p>
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
                {books.length} livre{books.length > 1 ? 's' : ''} sélectionné{books.length > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {books.map((book, index) => (
                  <div key={book.id} className="relative">
                    {index < 3 && (
                      <div className="absolute -top-2 -left-2 z-10 size-7 rounded-full bg-yellow-400 text-yellow-900 text-xs font-extrabold flex items-center justify-center shadow">
                        {index + 1}
                      </div>
                    )}
                    <BookCard
                      book={book}
                      author={(book as { author?: { name?: string } }).author?.name}
                    />
                  </div>
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
            Découvrez aussi nos dernières parutions.
          </p>
          <div className="flex gap-3">
            <Link
              href="/nouveautes"
              className="inline-flex items-center justify-center h-10 px-6 rounded-lg text-sm font-semibold border border-brand-600 text-brand-600 hover:bg-brand-50 transition-colors"
            >
              Voir les nouveautés →
            </Link>
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center h-10 px-6 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
            >
              Tout le catalogue
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
