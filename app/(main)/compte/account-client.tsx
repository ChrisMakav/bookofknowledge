'use client'

import { useState } from 'react'
import Link from 'next/link'
import { logout } from '@/actions/auth'
import { BookCard } from '@/components/books/book-card'
import { cn } from '@/lib/utils'
import type { Book } from '@/types'

type Tab = 'orders' | 'favorites' | 'profile'

interface AccountClientProps {
  profile:   { full_name: string | null; email?: string; avatar_url?: string | null } | null
  orders:    { id: string; created_at: string; total: number; status: string; order_items?: unknown[] }[]
  favorites: { book_id: string; book?: unknown }[]
}

const STATUS_LABELS: Record<string, string> = {
  pending:    'En attente',
  paid:       'Payée',
  processing: 'En préparation',
  shipped:    'Expédiée',
  delivered:  'Livrée',
  cancelled:  'Annulée',
  refunded:   'Remboursée',
}

const STATUS_COLORS: Record<string, string> = {
  pending:    'text-amber-600  bg-amber-50',
  paid:       'text-green-700  bg-green-50',
  processing: 'text-brand-600  bg-brand-50',
  shipped:    'text-blue-700   bg-blue-50',
  delivered:  'text-green-700  bg-green-50',
  cancelled:  'text-red-600    bg-red-50',
  refunded:   'text-gray-600   bg-gray-100',
}

export function AccountClient({ profile, orders, favorites }: AccountClientProps) {
  const [tab, setTab] = useState<Tab>('orders')

  const tabs: { key: Tab; label: string }[] = [
    { key: 'orders',    label: `Commandes (${orders.length})` },
    { key: 'favorites', label: `Favoris (${favorites.length})` },
    { key: 'profile',   label: 'Profil' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border pb-0">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
              tab === key
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-text-secondary hover:text-text-primary',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Orders */}
      {tab === 'orders' && (
        <div className="flex flex-col gap-3">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <p className="font-semibold">Aucune commande</p>
              <Link href="/catalogue" className="text-sm text-brand-600 hover:underline mt-1 block">
                Explorer le catalogue
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-surface-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Commande #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full',
                        STATUS_COLORS[order.status] ?? 'text-text-muted bg-surface-subtle',
                      )}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="text-sm font-bold text-text-primary">
                      {order.total.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Favorites */}
      {tab === 'favorites' && (
        <div>
          {favorites.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <p className="font-semibold">Aucun favori</p>
              <p className="text-sm mt-1">Cliquez sur le cœur sur une fiche livre pour l&apos;ajouter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {favorites.map((fav) => {
                const book = fav.book as Book | undefined
                if (!book) return null
                return (
                  <BookCard
                    key={fav.book_id}
                    book={book}
                    author={(book as { author?: { name?: string } }).author?.name}
                  />
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Profile */}
      {tab === 'profile' && (
        <div className="bg-surface-card rounded-xl border border-border p-6 flex flex-col gap-4 max-w-md">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Nom</p>
            <p className="text-sm font-semibold text-text-primary">{profile?.full_name ?? '—'}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-error hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
