'use client'

import { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/stores/cart.store'
import { createPaymentIntent } from '@/actions/orders'
import { getStripePromise } from '@/lib/stripe/client'
import { CheckoutForm } from '@/components/checkout/checkout-form'

export function CheckoutClient() {
  const router  = useRouter()
  const items   = useCartStore((s) => s.items)
  const total   = useCartStore((s) => s.totalPrice())
  const clearCart = useCartStore((s) => s.clearCart)

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId,      setOrderId]      = useState<string | null>(null)
  const [error,        setError]        = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/catalogue')
      return
    }

    createPaymentIntent({
      items,
      shippingAddress: {
        full_name:   '',
        line1:       '',
        city:        '',
        postal_code: '',
        country:     'FR',
      },
    }).then(({ clientSecret, orderId, error }) => {
      if (error) {
        setError(error)
        return
      }
      setClientSecret(clientSecret)
      setOrderId(orderId)
    })
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

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

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-text-muted">
          <div className="size-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Préparation du paiement…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-text-primary">Paiement</h1>
        <p className="text-sm text-text-secondary mt-1">
          Total : <span className="font-bold text-text-primary">{(total * 1.2).toFixed(2)} €</span> TTC
        </p>
      </div>

      <Elements
        stripe={getStripePromise()}
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary:       '#5B3BF5',
              colorBackground:    '#FFFFFF',
              colorText:          '#0D0B1A',
              fontFamily:         'system-ui, sans-serif',
              borderRadius:       '8px',
              spacingUnit:        '4px',
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
    </div>
  )
}
