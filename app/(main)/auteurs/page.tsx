import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { getAllAuthors } from '@/actions/authors'
import type { Author } from '@/types'

export const metadata: Metadata = {
  title: 'Nos Auteurs — Book of Knowledge',
  description: 'Découvrez les auteurs chrétiens dont les livres sont disponibles sur Book of Knowledge.',
}

function AuthorCard({ author }: { author: Author }) {
  return (
    <Link
      href={`/auteurs/${author.slug}`}
      className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-border bg-white hover:border-brand-300 hover:shadow-md transition-all duration-200 text-center"
    >
      {author.avatar_url ? (
        <div className="relative size-24 rounded-full overflow-hidden ring-4 ring-brand-50 group-hover:ring-brand-100 transition-all shrink-0">
          <Image
            src={author.avatar_url}
            alt={author.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      ) : (
        <div className="size-24 rounded-full shrink-0 bg-brand-100 flex items-center justify-center ring-4 ring-brand-50 group-hover:ring-brand-100 transition-all">
          <span className="text-3xl font-bold text-brand-600">{author.name[0]}</span>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h2 className="font-display text-base font-bold text-text-primary group-hover:text-brand-600 transition-colors leading-tight">
          {author.name}
        </h2>
        {author.bio && (
          <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
            {author.bio}
          </p>
        )}
      </div>

      <span className="text-xs font-semibold text-brand-600 group-hover:underline mt-auto">
        Voir les livres →
      </span>
    </Link>
  )
}

export default async function AuteursPage() {
  const authors = await getAllAuthors()

  return (
    <div className="bg-surface-page min-h-screen">

      {/* Hero */}
      <section
        className="py-16"
        style={{ background: 'linear-gradient(135deg, var(--color-surface-dark) 0%, #2D1B69 60%, #1E1B3A 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/20 text-accent-400 text-xs font-semibold uppercase tracking-wider border border-accent-500/30">
            <Users size={12} />
            Des voix qui édifient
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Nos Auteurs
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            Des auteurs chrétiens inspirants dont les écrits nourrissent la foi, développent le caractère et accomplissent les destinées.
          </p>
        </div>
      </section>

      {/* Authors grid */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          {authors.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <p className="text-text-muted text-lg">Aucun auteur disponible pour le moment.</p>
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
                {authors.length} auteur{authors.length > 1 ? 's' : ''} référencé{authors.length > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {authors.map((author) => (
                  <AuthorCard key={author.id} author={author} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA auteur */}
      <section className="py-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 border border-brand-100 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-lg font-bold text-text-primary mb-1">
                Vous êtes auteur chrétien ?
              </h3>
              <p className="text-sm text-text-secondary">
                Vous souhaitez que vos livres soient référencés sur Book of Knowledge ? Contactez-nous.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center justify-center h-10 px-6 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
            >
              Nous contacter →
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
