import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Commande confirmée',
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
      <div className="size-16 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 size={36} className="text-green-600" />
      </div>

      <div>
        <h1 className="text-2xl font-bold font-display text-text-primary">
          Merci pour votre commande !
        </h1>
        <p className="text-sm text-text-secondary mt-2 max-w-sm">
          Un email de confirmation a été envoyé. Votre commande est en cours de traitement.
        </p>
        {order && (
          <p className="text-xs text-text-muted mt-2 font-mono">
            Commande #{order.slice(-8).toUpperCase()}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Link
          href="/compte"
          className="inline-flex items-center justify-center h-10 px-5 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
        >
          Mes commandes
        </Link>
        <Link
          href="/catalogue"
          className="inline-flex items-center justify-center h-10 px-5 rounded-lg text-sm font-semibold border border-border text-text-secondary hover:bg-surface-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
        >
          Continuer vos achats
        </Link>
      </div>
    </div>
  )
}
