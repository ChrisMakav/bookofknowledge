import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp, Star, Zap } from 'lucide-react'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getNewReleases, getBestsellers, getTrendingBooks } from '@/actions/books'
import { BookCard } from '@/components/books/book-card'
import type { Book } from '@/types'

export const metadata: Metadata = {
  title:       'Découvrir — Book of Knowledge',
  description: 'Explorez les sélections de la rédaction, les nouveautés et les livres incontournables.',
}

async function getStaffPicks(): Promise<Book[]> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('books')
    .select('*, author:authors(id, name, slug)')
    .eq('is_staff_pick', true)
    .order('created_at', { ascending: false })
    .limit(4)
  return (data ?? []) as Book[]
}

const GENRES = [
  { key: 'thriller',  label: 'Thriller',   emoji: '🔪', color: 'bg-red-50 text-red-700 hover:bg-red-100' },
  { key: 'romance',   label: 'Romance',    emoji: '💛', color: 'bg-pink-50 text-pink-700 hover:bg-pink-100' },
  { key: 'scifi',     label: 'Science-fiction', emoji: '🚀', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
  { key: 'fantasy',   label: 'Fantasy',    emoji: '🐉', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
  { key: 'lifestyle', label: 'Essais',     emoji: '📐', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
  { key: 'tech',      label: 'Tech',       emoji: '💻', color: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100' },
]

function SectionHeader({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType
  label: string
  href?: string
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-brand-600" />
        <h2 className="text-lg font-bold font-display text-text-primary">{label}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
        >
          Tout voir <ArrowRight size={14} />
        </Link>
      )}
    </div>
  )
}

function HeroBook({ book }: { book: Book }) {
  const author = (book as { author?: { name?: string; slug?: string } }).author
  return (
    <Link href={`/livres/${book.slug}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden bg-surface-dark min-h-[340px] flex items-end">
        {/* Background cover blurred */}
        {book.cover_url && (
          <div className="absolute inset-0">
            <Image src={book.cover_url} alt="" fill className="object-cover opacity-20 blur-sm scale-110" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/60 to-transparent" />
          </div>
        )}

        <div className="relative flex gap-6 p-6 md:p-8 items-end">
          {/* Cover */}
          {book.cover_url && (
            <div className="relative w-24 md:w-32 shrink-0 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-2 ring-white/10 transition-transform duration-300 group-hover:scale-[1.03]">
              <Image src={book.cover_url} alt={book.title} fill className="object-cover" sizes="128px" priority />
            </div>
          )}

          {/* Text */}
          <div className="flex flex-col gap-2 pb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-400">
              Sélection de la rédaction
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold font-display text-white leading-tight group-hover:text-accent-300 transition-colors">
              {book.title}
            </h3>
            {author?.name && (
              <p className="text-sm text-white/60">par {author.name}</p>
            )}
            {book.description && (
              <p className="text-sm text-white/50 leading-relaxed line-clamp-2 max-w-lg mt-1 hidden md:block">
                {book.description}
              </p>
            )}
            <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-400 group-hover:gap-2.5 transition-all">
              Lire la fiche <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function StaffPickCard({ book, index }: { book: Book; index: number }) {
  const author = (book as { author?: { name?: string; slug?: string } }).author
  return (
    <Link href={`/livres/${book.slug}`} className="group flex gap-4 p-4 rounded-xl hover:bg-surface-subtle transition-colors">
      <div className="relative w-14 shrink-0 aspect-[2/3] rounded-lg overflow-hidden shadow-md">
        {book.cover_url
          ? <Image src={book.cover_url} alt={book.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="56px" />
          : <div className="w-full h-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">{index + 1}</div>
        }
      </div>
      <div className="flex flex-col gap-1 justify-center min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-500">#{index + 1} coup de cœur</span>
        <p className="text-sm font-bold text-text-primary truncate">{book.title}</p>
        {author?.name && <p className="text-xs text-text-muted truncate">{author.name}</p>}
        {book.price_hardcover && (
          <p className="text-sm font-bold text-brand-600 mt-0.5">{book.price_hardcover.toFixed(2)} €</p>
        )}
      </div>
    </Link>
  )
}

export default async function DecouvrirPage() {
  const [staffPicks, newReleases, bestsellers, trending] = await Promise.all([
    getStaffPicks(),
    getNewReleases(),
    getBestsellers(),
    getTrendingBooks(),
  ])

  const heroBook   = staffPicks[0]
  const otherPicks = staffPicks.slice(1)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-16">

      {/* ── Hero + Staff Picks ─────────────────────────────────────────────── */}
      {staffPicks.length > 0 && (
        <section>
          <SectionHeader icon={Sparkles} label="Sélection de la rédaction" href="/catalogue" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            {heroBook && <HeroBook book={heroBook} />}

            {otherPicks.length > 0 && (
              <div className="flex flex-col divide-y divide-border">
                {otherPicks.map((book, i) => (
                  <StaffPickCard key={book.id} book={book} index={i + 1} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Genres ────────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader icon={Zap} label="Explorer par univers" />
        <div className="flex flex-wrap gap-3">
          {GENRES.map(({ key, label, emoji, color }) => (
            <Link
              key={key}
              href={`/catalogue?genre=${key}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${color}`}
            >
              <span>{emoji}</span> {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Nouveautés ────────────────────────────────────────────────────── */}
      {newReleases.length > 0 && (
        <section>
          <SectionHeader icon={Zap} label="Nouveautés" href="/catalogue?sort=newest" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {newReleases.map((book) => {
              const a = (book as { author?: { name?: string } }).author
              return <BookCard key={book.id} book={book} author={a?.name} />
            })}
          </div>
        </section>
      )}

      {/* ── Bestsellers ───────────────────────────────────────────────────── */}
      {bestsellers.length > 0 && (
        <section>
          <SectionHeader icon={Star} label="Bestsellers" href="/catalogue?sort=rating" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {bestsellers.map((book) => {
              const a = (book as { author?: { name?: string } }).author
              return <BookCard key={book.id} book={book} author={a?.name} />
            })}
          </div>
        </section>
      )}

      {/* ── Tendances ─────────────────────────────────────────────────────── */}
      {trending.length > 0 && (
        <section>
          <SectionHeader icon={TrendingUp} label="Tendances" href="/catalogue?sort=popularity" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {trending.slice(0, 5).map((book) => {
              const a = (book as { author?: { name?: string } }).author
              return <BookCard key={book.id} book={book} author={a?.name} />
            })}
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="rounded-2xl bg-brand-600 px-8 py-10 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-extrabold font-display text-white">
          Prêt à explorer tout le catalogue ?
        </h2>
        <p className="text-brand-100 text-sm max-w-md">
          Des milliers de livres vous attendent — filtrez par genre, prix et format.
        </p>
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-600 font-bold text-sm hover:bg-brand-50 transition-colors"
        >
          Voir tout le catalogue <ArrowRight size={16} />
        </Link>
      </section>

    </div>
  )
}
