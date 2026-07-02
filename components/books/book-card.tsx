'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { GenreBadge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/ui/progress-bar'
import { RatingStars } from '@/components/ui/rating-stars'
import { cn } from '@/lib/utils'
import type { Book, GenreKey } from '@/types'

interface ReadingProgress {
  percent:   number
  pagesRead: number
  totalPages:number
  finished:  boolean
}

interface BookCardProps {
  book:             Pick<Book, 'id' | 'slug' | 'title' | 'cover_url' | 'price_hardcover' | 'rating_avg'>
  author?:          string
  genre?:           GenreKey
  readingProgress?: ReadingProgress
  variant?:         'grid' | 'list'
  onFavorite?:      () => void
  isFavorited?:     boolean
  className?:       string
}

export function BookCard({
  book,
  author,
  genre,
  readingProgress,
  variant     = 'grid',
  onFavorite,
  isFavorited = false,
  className,
}: BookCardProps) {
  if (variant === 'list') {
    return <BookCardList book={book} author={author} genre={genre} readingProgress={readingProgress} className={className} />
  }

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'group relative flex flex-col bg-surface-card rounded-xl shadow-sm overflow-hidden cursor-pointer',
        'hover:shadow-md transition-shadow duration-300',
        className,
      )}
    >
      <Link href={`/livres/${book.slug}`} className="block flex flex-col h-full">
        {/* Cover */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg m-2 mb-0 shrink-0">
          <Image
            src={book.cover_url}
            alt={`${book.title}${author ? ` par ${author}` : ''}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
          />
          {genre && (
            <div className="absolute top-2 left-2">
              <GenreBadge genre={genre} onCover />
            </div>
          )}
          {onFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onFavorite()
              }}
              aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className={cn(
                'absolute top-2 right-2 size-7 flex items-center justify-center rounded-full',
                'bg-black/40 backdrop-blur-sm text-white',
                'transition-colors duration-[var(--duration-fast)]',
                'hover:bg-black/60',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              )}
            >
              <Heart
                size={14}
                className={isFavorited ? 'text-red-400' : 'text-white'}
                fill={isFavorited ? 'currentColor' : 'none'}
              />
            </button>
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-col gap-1 p-3 pt-2 flex-1">
          <p className="text-sm font-semibold text-text-primary truncate leading-snug">{book.title}</p>
          {author && <p className="text-xs text-text-secondary truncate">{author}</p>}

          {(book.price_hardcover !== null || book.rating_avg > 0) && (
            <div className="flex items-center justify-between mt-1">
              {book.price_hardcover !== null && (
                <span className="text-sm font-bold text-brand-600">
                  {book.price_hardcover.toFixed(2)} €
                </span>
              )}
              {book.rating_avg > 0 && (
                <RatingStars value={book.rating_avg} size="sm" />
              )}
            </div>
          )}

          {readingProgress && (
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex justify-between text-xs text-text-muted">
                <span className="font-medium uppercase tracking-wide">
                  {readingProgress.finished ? 'Terminé' : `${readingProgress.percent}% Lu`}
                </span>
                <span>{readingProgress.pagesRead} / {readingProgress.totalPages} p.</span>
              </div>
              <ProgressBar
                value={readingProgress.percent}
                finished={readingProgress.finished}
              />
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  )
}

// ─── List Variant ─────────────────────────────────────────────────────────────

function BookCardList({
  book,
  author,
  genre,
  readingProgress,
  className,
}: Omit<BookCardProps, 'variant' | 'onFavorite' | 'isFavorited'>) {
  return (
    <article
      className={cn(
        'flex gap-3 p-3 bg-surface-card rounded-xl shadow-sm',
        'hover:shadow-md transition-shadow duration-300',
        className,
      )}
    >
      <Link href={`/livres/${book.slug}`} className="contents">
        <div className="relative w-16 aspect-[2/3] shrink-0 rounded-lg overflow-hidden">
          <Image
            src={book.cover_url}
            alt={`${book.title}${author ? ` par ${author}` : ''}`}
            fill
            className="object-cover"
            sizes="64px"
          />
          {genre && (
            <div className="absolute top-1 left-1">
              <GenreBadge genre={genre} onCover />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">{book.title}</p>
          {author && <p className="text-xs text-text-secondary truncate">{author}</p>}
          <div className="flex items-center gap-2 mt-auto">
            {book.price_hardcover !== null && (
              <span className="text-sm font-bold text-brand-600">
                {book.price_hardcover.toFixed(2)} €
              </span>
            )}
            {book.rating_avg > 0 && (
              <RatingStars value={book.rating_avg} size="sm" />
            )}
          </div>
          {readingProgress && (
            <ProgressBar
              value={readingProgress.percent}
              finished={readingProgress.finished}
              size="sm"
            />
          )}
        </div>
      </Link>
    </article>
  )
}
