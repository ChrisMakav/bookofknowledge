import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MessageSquare, TrendingUp, Users } from 'lucide-react'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title:       'Communauté — Book of Knowledge',
  description: 'Découvrez les avis et les lectures de la communauté Book of Knowledge.',
}

async function getRecentReviews() {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('reviews')
    .select('id, rating, body, vibe_tags, created_at, book:books(title, slug, cover_url), profile:profiles(full_name, avatar_url)')
    .not('body', 'is', null)
    .order('created_at', { ascending: false })
    .limit(12)
  return data ?? []
}

async function getTopReviewers() {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('reviews')
    .select('profile:profiles(full_name, avatar_url)')
    .limit(100)

  // Count per profile
  const counts: Record<string, { full_name: string; avatar_url: string | null; count: number }> = {}
  for (const r of data ?? []) {
    const p = (r as { profile?: { full_name?: string; avatar_url?: string | null } }).profile
    if (!p?.full_name) continue
    const key = p.full_name
    if (!counts[key]) counts[key] = { full_name: p.full_name, avatar_url: p.avatar_url ?? null, count: 0 }
    counts[key].count++
  }

  return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 8)
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= value ? 'text-amber-400 fill-amber-400' : 'text-border'}
        />
      ))}
    </div>
  )
}

export default async function CommunautePage() {
  const [reviews, topReviewers] = await Promise.all([
    getRecentReviews(),
    getTopReviewers(),
  ])

  const totalReviews = reviews.length

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-12">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold font-display text-text-primary">Communauté</h1>
        <p className="text-text-secondary text-sm">Avis, lectures et découvertes partagées par nos lecteurs.</p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { icon: MessageSquare, label: 'Avis publiés',   value: totalReviews },
          { icon: Users,         label: 'Lecteurs actifs', value: topReviewers.length },
          { icon: TrendingUp,    label: 'Livres notés',   value: reviews.length },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-surface-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="size-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-brand-600" />
            </div>
            <div>
              <p className="text-xl font-bold font-display text-text-primary">{value}</p>
              <p className="text-xs text-text-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">

        {/* ── Avis récents ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={18} className="text-brand-600" />
            <h2 className="text-lg font-bold font-display text-text-primary">Avis récents</h2>
          </div>

          {reviews.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center bg-surface-card rounded-xl border border-border">
              <MessageSquare size={32} className="text-text-muted opacity-40" />
              <p className="text-text-muted text-sm">Aucun avis pour l'instant.</p>
              <p className="text-xs text-text-muted">Soyez le premier à noter un livre !</p>
              <Link href="/catalogue" className="mt-1 text-sm font-semibold text-brand-600 hover:underline">
                Parcourir le catalogue →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((review) => {
                const r = review as {
                  id: string
                  rating: number
                  body?: string
                  vibe_tags?: string[]
                  created_at: string
                  book?:    { title?: string; slug?: string; cover_url?: string }
                  profile?: { full_name?: string; avatar_url?: string | null }
                }
                return (
                  <article key={r.id} className="bg-surface-card border border-border rounded-xl p-4 flex gap-4">
                    {/* Book cover */}
                    {r.book?.cover_url && r.book.slug && (
                      <Link href={`/livres/${r.book.slug}`} className="shrink-0">
                        <div className="relative w-12 aspect-[2/3] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <Image src={r.book.cover_url} alt={r.book.title ?? ''} fill className="object-cover" sizes="48px" />
                        </div>
                      </Link>
                    )}

                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {r.book?.slug && (
                            <Link href={`/livres/${r.book.slug}`} className="text-sm font-bold text-text-primary hover:text-brand-600 transition-colors line-clamp-1">
                              {r.book.title}
                            </Link>
                          )}
                          <p className="text-xs text-text-muted mt-0.5">
                            par {r.profile?.full_name ?? 'Lecteur anonyme'} ·{' '}
                            {new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                          </p>
                        </div>
                        <Stars value={r.rating} />
                      </div>

                      {/* Body */}
                      {r.body && (
                        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">{r.body}</p>
                      )}

                      {/* Vibe tags */}
                      {r.vibe_tags && r.vibe_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {r.vibe_tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        {/* ── Sidebar : Top lecteurs ────────────────────────────────── */}
        <aside className="flex flex-col gap-6">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-brand-600" />
              <h2 className="text-base font-bold font-display text-text-primary">Top lecteurs</h2>
            </div>

            {topReviewers.length === 0 ? (
              <p className="text-sm text-text-muted">Aucun lecteur actif pour l'instant.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {topReviewers.map((reader, i) => (
                  <div key={reader.full_name} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <span className="text-xs font-bold text-text-muted w-5 text-right shrink-0">#{i + 1}</span>
                    {reader.avatar_url ? (
                      <div className="relative size-8 rounded-full overflow-hidden shrink-0">
                        <Image src={reader.avatar_url} alt={reader.full_name} fill className="object-cover" sizes="32px" />
                      </div>
                    ) : (
                      <div className="size-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-brand-600">{reader.full_name[0]}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{reader.full_name}</p>
                      <p className="text-xs text-text-muted">{reader.count} avis</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* CTA rejoindre */}
          <div className="bg-brand-50 rounded-xl p-4 flex flex-col gap-3 border border-brand-100">
            <p className="text-sm font-bold text-brand-800">Rejoignez la communauté</p>
            <p className="text-xs text-brand-700 leading-relaxed">
              Notez vos lectures, partagez vos avis et découvrez les coups de cœur des autres lecteurs.
            </p>
            <Link
              href="/catalogue"
              className="text-center text-xs font-bold px-3 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
            >
              Commencer à lire →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
