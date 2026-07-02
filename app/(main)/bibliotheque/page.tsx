import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Heart, ShoppingBag, BookOpen } from 'lucide-react'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getFavorites } from '@/actions/favorites'
import { getOrders } from '@/actions/orders'
import { BookCard } from '@/components/books/book-card'
import type { Book } from '@/types'

export const metadata: Metadata = { title: 'Ma Bibliothèque — Book of Knowledge' }

export default async function BibliothequeePage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion?redirectTo=/bibliotheque')

  const [favorites, orders] = await Promise.all([
    getFavorites(),
    getOrders(),
  ])

  type FavBook = { title: string; slug: string; cover_url: string; id: string; price_hardcover: number; rating_avg: number; author?: { name?: string } }
  const favBooks = favorites.map((f) => (f as unknown as { book: FavBook }).book).filter(Boolean)

  // Livres achetés (depuis les commandes payées)
  type OrderItem = { book?: { title: string; slug: string; cover_url: string } }
  const purchasedBooks = orders
    .filter((o: { status: string }) => o.status === 'paid' || o.status === 'delivered' || o.status === 'shipped')
    .flatMap((o: { order_items?: OrderItem[] }) =>
      (o.order_items ?? []).map((item) => item.book).filter(Boolean)
    ) as { title: string; slug: string; cover_url: string }[]

  const isEmpty = favBooks.length === 0 && purchasedBooks.length === 0

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-extrabold font-display text-text-primary">Ma Bibliothèque</h1>
        <p className="text-text-secondary text-sm mt-1">Vos favoris et vos achats au même endroit.</p>
      </div>

      {isEmpty && (
        <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
          <div className="size-16 rounded-full bg-brand-50 flex items-center justify-center">
            <BookOpen size={28} className="text-brand-400" />
          </div>
          <div>
            <p className="font-semibold text-text-primary">Votre bibliothèque est vide</p>
            <p className="text-sm text-text-muted mt-1">Ajoutez des livres à vos favoris ou passez une commande.</p>
          </div>
          <Link
            href="/decouvrir"
            className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            Découvrir des livres
          </Link>
        </div>
      )}

      {/* ── Favoris ─────────────────────────────────────────────────── */}
      {favBooks.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Heart size={18} className="text-brand-600" />
            <h2 className="text-lg font-bold font-display text-text-primary">
              Favoris <span className="text-text-muted font-normal text-sm ml-1">({favBooks.length})</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {favBooks.map((book) => (
              <BookCard key={book.id} book={book as unknown as Book} author={book.author?.name} />
            ))}
          </div>
        </section>
      )}

      {/* ── Livres achetés ──────────────────────────────────────────── */}
      {purchasedBooks.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag size={18} className="text-brand-600" />
            <h2 className="text-lg font-bold font-display text-text-primary">
              Mes achats <span className="text-text-muted font-normal text-sm ml-1">({purchasedBooks.length})</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {purchasedBooks.map((book, i) => (
              <Link key={`${book.slug}-${i}`} href={`/livres/${book.slug}`} className="group flex flex-col bg-surface-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg m-2 mb-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                </div>
                <div className="p-3 pt-2">
                  <p className="text-sm font-semibold text-text-primary truncate">{book.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Commandes récentes ──────────────────────────────────────── */}
      {orders.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold font-display text-text-primary">Commandes récentes</h2>
            <Link href="/compte" className="text-sm text-brand-600 hover:underline">Voir tout</Link>
          </div>
          <div className="flex flex-col divide-y divide-border border border-border rounded-xl overflow-hidden bg-surface-card">
            {orders.slice(0, 5).map((order: {
              id: string
              created_at: string
              total: number
              status: string
            }) => {
              const STATUS: Record<string, { label: string; color: string }> = {
                pending:    { label: 'En attente',     color: 'text-amber-600 bg-amber-50' },
                paid:       { label: 'Payée',          color: 'text-green-700 bg-green-50' },
                processing: { label: 'En préparation', color: 'text-brand-600 bg-brand-50' },
                shipped:    { label: 'Expédiée',       color: 'text-blue-700 bg-blue-50' },
                delivered:  { label: 'Livrée',         color: 'text-green-700 bg-green-50' },
                cancelled:  { label: 'Annulée',        color: 'text-red-600 bg-red-50' },
              }
              const s = STATUS[order.status] ?? { label: order.status, color: 'text-text-muted bg-surface-subtle' }
              return (
                <div key={order.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-text-primary font-mono">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-text-muted">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                    <span className="text-sm font-bold text-brand-600">{order.total.toFixed(2)} €</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
