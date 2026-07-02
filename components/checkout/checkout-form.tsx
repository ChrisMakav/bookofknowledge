'use client'

import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { AddressSchema, type AddressInput } from '@/lib/validations/checkout'
import { cn } from '@/lib/utils'

interface CheckoutFormProps {
  orderId:   string
  onSuccess: () => void
}

function Field({
  label,
  error,
  children,
}: {
  label:    string
  error?:   string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      {children}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}

const inputClass = cn(
  'h-10 w-full rounded-lg border border-border bg-surface-page px-3 text-sm text-text-primary',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:border-transparent',
  'transition-colors duration-[var(--duration-fast)]',
)

export function CheckoutForm({ orderId: _orderId, onSuccess }: CheckoutFormProps) {
  const stripe   = useStripe()
  const elements = useElements()
  const [stripeError, setStripeError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({
    resolver: zodResolver(AddressSchema),
    defaultValues: { country: 'FR', line2: '' },
  })

  async function onSubmit(_data: AddressInput) {
    if (!stripe || !elements) return

    setStripeError(null)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order=${_orderId}`,
      },
      redirect: 'if_required',
    })

    if (error) {
      setStripeError(error.message ?? 'Paiement refusé. Veuillez réessayer.')
      return
    }

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Shipping address */}
      <section>
        <h2 className="text-base font-semibold text-text-primary mb-4">Adresse de livraison</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Nom complet" error={errors.full_name?.message}>
              <input {...register('full_name')} className={inputClass} autoComplete="name" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Adresse" error={errors.line1?.message}>
              <input {...register('line1')} className={inputClass} autoComplete="address-line1" />
            </Field>
          </div>
          <Field label="Complément (optionnel)" error={errors.line2?.message}>
            <input {...register('line2')} className={inputClass} autoComplete="address-line2" />
          </Field>
          <Field label="Code postal" error={errors.postal_code?.message}>
            <input {...register('postal_code')} className={inputClass} autoComplete="postal-code" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Ville" error={errors.city?.message}>
              <input {...register('city')} className={inputClass} autoComplete="address-level2" />
            </Field>
          </div>
        </div>
      </section>

      {/* Stripe payment element */}
      <section>
        <h2 className="text-base font-semibold text-text-primary mb-4">Moyen de paiement</h2>
        <PaymentElement />
      </section>

      {stripeError && (
        <p role="alert" className="text-sm text-error bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {stripeError}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting || !stripe || !elements}
        className="w-full"
      >
        Confirmer et payer
      </Button>

      <p className="text-xs text-center text-text-muted">
        Paiement chiffré et sécurisé par Stripe. Vos données bancaires ne sont jamais stockées.
      </p>
    </form>
  )
}
