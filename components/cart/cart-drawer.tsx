'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { X, Trash2, Plus, Minus, ShoppingBag, Tag, CheckCircle } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useCartStore } from '@/stores/cart.store'
import { validatePromoCode } from '@/actions/promo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const formatLabels: Record<string, string> = {
  hardcover: 'Relié',
  paperback: 'Broché',
  ebook:     'Ebook',
}

export function CartDrawer() {
  const isOpen      = useCartStore((s) => s.isCartOpen)
  const items       = useCartStore((s) => s.items)
  const subtotal    = useCartStore((s) => s.subtotal())
  const totalPrice  = useCartStore((s) => s.totalPrice())
  const promo       = useCartStore((s) => s.promo)
  const applyPromo  = useCartStore((s) => s.applyPromo)
  const clearPromo  = useCartStore((s) => s.clearPromo)
  const setCartOpen = useCartStore((s) => s.setCartOpen)
  const removeItem  = useCartStore((s) => s.removeItem)
  const update      = useCartStore((s) => s.updateQuantity)

  const [promoInput, setPromoInput]   = useState('')
  const [promoError, setPromoError]   = useState<string | null>(null)
  const [isPending, startTransition]  = useTransition()

  function handleApplyPromo() {
    setPromoError(null)
    startTransition(async () => {
      const result = await validatePromoCode(promoInput, subtotal)
      if (result.error) {
        setPromoError(result.error)
      } else if (result.data) {
        applyPromo(result.data)
        setPromoInput('')
      }
    })
  }

  function handleClearPromo() {
    clearPromo()
    setPromoInput('')
    setPromoError(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
            aria-hidden
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-surface-card shadow-xl flex flex-col"
            aria-label="Panier"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-text-primary">Mon Panier</h2>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Fermer le panier"
                className="size-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-text-muted" />
                  <div>
                    <p className="font-semibold text-text-primary">Votre panier est vide</p>
                    <p className="text-sm text-text-secondary mt-1">
                      Explorez notre catalogue pour trouver votre prochaine lecture.
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setCartOpen(false)}
                    className="mt-2"
                  >
                    <Link href="/catalogue">Explorer le catalogue</Link>
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.bookId}-${item.format}`}
                    className="flex gap-3 p-3 bg-surface-page rounded-xl"
                  >
                    <div className="relative w-12 aspect-[2/3] shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.cover}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{item.title}</p>
                      <p className="text-xs text-text-secondary">{item.author}</p>
                      <p className="text-xs text-text-muted mt-0.5">{formatLabels[item.format]}</p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => update(item.bookId, item.format, item.quantity - 1)}
                            aria-label="Diminuer la quantité"
                            className="size-6 flex items-center justify-center rounded text-text-secondary hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium text-text-primary w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => update(item.bookId, item.format, item.quantity + 1)}
                            aria-label="Augmenter la quantité"
                            className="size-6 flex items-center justify-center rounded text-text-secondary hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-brand-600">
                            {(item.price * item.quantity).toFixed(2)} €
                          </span>
                          <button
                            onClick={() => removeItem(item.bookId, item.format)}
                            aria-label={`Retirer ${item.title} du panier`}
                            className="size-6 flex items-center justify-center rounded text-text-muted hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-4 space-y-3">

                {/* Promo code */}
                {promo ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-600 shrink-0" />
                      <span className="text-xs font-semibold text-green-700">
                        {promo.code} — {promo.type === 'percentage' ? `${promo.value}%` : `${promo.value.toFixed(2)} €`} de réduction
                      </span>
                    </div>
                    <button
                      onClick={handleClearPromo}
                      className="text-text-muted hover:text-text-primary transition-colors"
                      aria-label="Supprimer le code promo"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(null) }}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                          placeholder="Code promo"
                          className="h-9 w-full pl-8 pr-3 text-sm rounded-lg border border-border bg-surface-page text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-600"
                        />
                      </div>
                      <button
                        onClick={handleApplyPromo}
                        disabled={isPending || !promoInput.trim()}
                        className="h-9 px-3 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
                      >
                        {isPending ? '…' : 'Appliquer'}
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-red-500">{promoError}</p>
                    )}
                  </div>
                )}

                {/* Totals */}
                {promo && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Sous-total</span>
                    <span className="text-text-primary">{subtotal.toFixed(2)} €</span>
                  </div>
                )}
                {promo && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">Réduction</span>
                    <span className="text-green-600 font-semibold">−{promo.discount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Total</span>
                  <span className="text-lg font-bold text-text-primary">
                    {totalPrice.toFixed(2)} €
                  </span>
                </div>

                <p className="text-xs text-text-muted">
                  Livraison et taxes calculées à la caisse.
                </p>
                <Link
                  href="/paiement"
                  onClick={() => setCartOpen(false)}
                  className={cn(
                    'flex items-center justify-center w-full h-12 rounded-lg',
                    'text-sm font-semibold text-white bg-brand-600',
                    'hover:bg-brand-700 transition-colors duration-[var(--duration-base)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
                  )}
                >
                  Passer à la caisse
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
