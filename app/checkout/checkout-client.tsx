'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Elements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { Tag } from 'lucide-react'
import { useCartStore } from '@/stores/cart.store'
import { createPaymentIntent } from '@/actions/orders'
import { getStripePromise } from '@/lib/stripe/client'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import type { BookFormat } from '@/types'

const FORMAT_LABELS: Record<BookFormat, string> = {
  hardcover: 'Relié',
  paperback: 'Broché',
  ebook:     'E-book',
}

export function CheckoutClient() {
  const router    = useRouter()
  const items     = useCartStore((s) => s.items)
  const promo     = useCartStore((s) => s.promo)
  const subtotal  = useCartStore((s) => s.subtotal())
  const clearCart = useCartStore((s) => s.clearCart)

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId,      setOrderId]      = useState<string | null>(null)
  const [error,        setError]        = useState<string | null>(null)

  const discount     = promo?.discount ?? 0
  const taxBase      = Math.max(0, subtotal - discount)
  const tax          = parseFloat((taxBase * 0.2).toFixed(2))
  const shippingCost = 4.90
  const totalTTC     = parseFloat((taxBase + tax + shippingCost).toFixed(2))

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/catalogue')
      return
    }

    createPaymentIntent({
      items,
      promoCodeId: promo?.id,
      shippingAddress: {
        full_name:   '',
        line1:       '',
        city:        '',
        postal_code: '',
        country:     'FR',
      },
    }).then(({ clientSecret, orderId, error }) => {
      if (error) { setError(error); return }
      setClientSecret(clientSecret)
      setOrderId(orderId)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-error font-semibold">{error}</p>
        <button
          onClick={() => router.push('/catalogue')}
          className="mt-4 text-sm text-brand-600 hover:underline"
        >
          Retourner au catalogue
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-8 items-start">

      {/* ── Left : form ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold font-display text-text-primary mb-6">Paiement</h1>

        {!clientSecret ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3 text-text-muted">
              <div className="size-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Préparation du paiement…</p>
            </div>
          </div>
        ) : (
          <Elements
            stripe={getStripePromise()}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary:    '#5B3BF5',
                  colorBackground: '#FFFFFF',
                  colorText:       '#0D0B1A',
                  fontFamily:      'system-ui, sans-serif',
                  borderRadius:    '8px',
                  spacingUnit:     '4px',
                },
              },
            }}
          >
            <CheckoutForm
              orderId={orderId!}
              onSuccess={() => {
                clearCart()
                router.push(`/checkout/success?order=${orderId}`)
              }}
            />
          </Elements>
        )}
      </div>

      {/* ── Right : order summary ────────────────────────────────────── */}
      <div className="lg:sticky lg:top-8 rounded-xl border border-border bg-surface-card p-6 flex flex-col gap-5">
        <h2 className="text-base font-semibold text-text-primary">Résumé de commande</h2>

        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={`${item.bookId}-${item.format}`} className="flex gap-3">
              <div className="relative size-14 flex-shrink-0 rounded-md overflow-hidden bg-surface-subtle">
                {item.cover && (
                  <Image src={item.cover} alt={item.title} fill className="object-cover" sizes="56px" />
                )}
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{item.title}</p>
                <p className="text-xs text-text-muted truncate">{item.author}</p>
                <p className="text-xs text-text-secondary">
                  {FORMAT_LABELS[item.format]} · {item.quantity} × {item.price.toFixed(2)} €
                </p>
              </div>
              <p className="text-sm font-semibold text-text-primary flex-shrink-0">
                {(item.price * item.quantity).toFixed(2)} €
              </p>
            </li>
          ))}
        </ul>

        <div className="border-t border-border" />

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-text-secondary">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>

          {discount > 0 && promo && (
            <div className="flex justify-between text-green-600">
              <span className="flex items-center gap-1">
                <Tag size={13} />
                {promo.code}
              </span>
              <span>−{discount.toFixed(2)} €</span>
            </div>
          )}

          <div className="flex justify-between text-text-secondary">
            <span>TVA (20%)</span>
            <span>{tax.toFixed(2)} €</span>
          </div>

          <div className="flex justify-between text-text-secondary">
            <span>Frais de livraison</span>
            <span>{shippingCost.toFixed(2)} €</span>
          </div>

          <div className="flex justify-between font-bold text-base text-text-primary pt-1 border-t border-border mt-1">
            <span>Total TTC</span>
            <span>{totalTTC.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  )
}
