import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getBook } from '@/actions/books'
import { RatingStars } from '@/components/ui/rating-stars'
import { ReviewCard } from '@/components/books/review-card'
import { BookDetailClient } from './book-detail-client'
import type { Review } from '@/types'

interface BookPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params
  const book = await getBook(slug)
  if (!book) return { title: 'Livre introuvable' }

  return {
    title:       book.title,
    description: book.synopsis ?? book.description ?? undefined,
    openGraph: {
      title:  book.title,
      images: book.cover_url ? [book.cover_url] : [],
    },
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params
  const book = await getBook(slug)
  if (!book) notFound()

  const author     = (book as { author?: { name?: string; bio?: string } }).author
  const reviews    = ((book as { reviews?: Review[] }).reviews ?? []) as (Review & { profile?: { full_name: string | null } })[]
  const avgRating  = book.rating_avg ?? 0
  const reviewCount = book.review_count ?? 0

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
        {/* Cover */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={book.cover_url}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80vw, 280px"
              priority
            />
          </div>

          {/* Buy Box — client for interactivity */}
          <BookDetailClient book={book} />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-text-primary leading-tight">
              {book.title}
            </h1>
            {author && (
              <p className="mt-1 text-base text-text-secondary">
                par <span className="font-semibold text-text-primary">{author.name}</span>
              </p>
            )}
          </div>

          {avgRating > 0 && (
            <div className="flex items-center gap-3">
              <RatingStars value={avgRating} variant="full" size="md" />
              <span className="text-sm text-text-secondary">
                {avgRating.toFixed(1)} · {reviewCount} avis
              </span>
            </div>
          )}

          {(book.synopsis || book.description) && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted mb-2">Synopsis</h2>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                {book.synopsis ?? book.description}
              </p>
            </div>
          )}

          {/* Metadata */}
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {book.page_count && (
              <>
                <dt className="text-text-muted">Pages</dt>
                <dd className="font-medium text-text-primary">{book.page_count}</dd>
              </>
            )}
            {book.published_at && (
              <>
                <dt className="text-text-muted">Publication</dt>
                <dd className="font-medium text-text-primary">
                  {new Date(book.published_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </dd>
              </>
            )}
            {book.isbn && (
              <>
                <dt className="text-text-muted">ISBN</dt>
                <dd className="font-medium text-text-primary font-mono">{book.isbn}</dd>
              </>
            )}
          </dl>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-text-primary mb-3">Avis lecteurs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reviews.slice(0, 4).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
