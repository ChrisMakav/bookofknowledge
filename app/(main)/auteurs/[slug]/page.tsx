import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAuthor, getAuthorBooks } from '@/actions/authors'
import { BookCard } from '@/components/books/book-card'

interface AuthorPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthor(slug)
  if (!author) return { title: 'Auteur introuvable' }

  const description = author.bio ? author.bio.slice(0, 160) : `Découvrez tous les livres de ${author.name}.`

  return {
    title: author.name,
    description,
    openGraph: {
      title:       author.name,
      description,
      images:      author.avatar_url ? [author.avatar_url] : [],
    },
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type':    'Person',
        name:       author.name,
        description,
        image:      author.avatar_url ?? undefined,
        url:        `${process.env.NEXT_PUBLIC_APP_URL}/auteurs/${author.slug}`,
      }),
    },
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params
  const [author, books] = await Promise.all([
    getAuthor(slug),
    getAuthor(slug).then((a) => a ? getAuthorBooks(a.id) : []),
  ])

  if (!author) notFound()

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type':    'Person',
            name:       author.name,
            description: author.bio?.slice(0, 160),
            image:      author.avatar_url ?? undefined,
            url:        `${process.env.NEXT_PUBLIC_APP_URL}/auteurs/${author.slug}`,
          }),
        }}
      />

      {/* Header auteur */}
      <div className="flex flex-col sm:flex-row gap-8 items-start mb-12">
        {author.avatar_url ? (
          <div className="relative size-32 rounded-full overflow-hidden shrink-0 ring-4 ring-brand-100">
            <Image
              src={author.avatar_url}
              alt={author.name}
              fill
              className="object-cover"
              sizes="128px"
              priority
            />
          </div>
        ) : (
          <div className="size-32 rounded-full shrink-0 bg-brand-100 flex items-center justify-center ring-4 ring-brand-50">
            <span className="text-4xl font-bold text-brand-600">{author.name[0]}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-text-primary">
            {author.name}
          </h1>
          {author.bio && (
            <p className="text-base text-text-secondary leading-relaxed max-w-2xl">
              {author.bio}
            </p>
          )}
          <p className="text-sm font-medium text-text-muted">
            {books.length} livre{books.length !== 1 ? 's' : ''} publié{books.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Grille livres */}
      {books.length > 0 ? (
        <div>
          <h2 className="text-lg font-bold font-display text-text-primary mb-6">
            Tous les livres
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-text-muted text-sm">Aucun livre disponible pour cet auteur.</p>
      )}
    </div>
  )
}
