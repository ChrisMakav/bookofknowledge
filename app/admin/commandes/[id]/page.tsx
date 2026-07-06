import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { adminGetOrder } from '@/actions/admin/orders'
import { OrderStatusSelect } from '../order-status-select'
import { DeleteOrderButton } from '../delete-order-button'
import { cn } from '@/lib/utils'
import type { BookFormat, OrderItem, OrderStatus } from '@/types'

export const metadata: Metadata = { title: 'Admin — Détail commande' }

const FORMAT_LABELS: Record<BookFormat, string> = {
  hardcover: 'Relié',
  paperback: 'Broché',
  ebook:     'E-book',
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

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await adminGetOrder(id)
  if (!order) notFound()

  const address = order.shipping_address

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link
        href="/admin/commandes"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary w-fit"
      >
        <ArrowLeft size={16} />
        Commandes
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">
            Commande #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {new Date(order.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'text-xs font-semibold px-2.5 py-1 rounded-full',
              STATUS_COLORS[order.status] ?? 'text-text-muted bg-surface-subtle',
            )}
          >
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
          <OrderStatusSelect orderId={order.id} current={order.status as OrderStatus} />
          {order.status === 'cancelled' && (
            <DeleteOrderButton orderId={order.id} redirectAfterDelete />
          )}
        </div>
      </div>

      {/* Customer */}
      <section className="bg-surface-card rounded-xl border border-border p-6">
        <h2 className="text-base font-semibold text-text-primary mb-3">Client</h2>
        <div className="text-sm flex flex-col gap-0.5">
          <p className="text-text-primary font-medium">{order.customer.full_name ?? '—'}</p>
          <p className="text-text-secondary">{order.customer.email ?? '—'}</p>
        </div>
      </section>

      {/* Items */}
      <section className="bg-surface-card rounded-xl border border-border p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">Articles</h2>
        <ul className="flex flex-col gap-4">
          {(order.order_items ?? []).map((item: OrderItem) => (
            <li key={item.id} className="flex gap-3">
              <div className="relative size-14 flex-shrink-0 rounded-md overflow-hidden bg-surface-subtle">
                {item.book?.cover_url && (
                  <Image
                    src={item.book.cover_url}
                    alt={item.book.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                )}
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {item.book?.title ?? 'Livre'}
                </p>
                <p className="text-xs text-text-secondary">
                  {FORMAT_LABELS[item.format as BookFormat]} · {item.quantity} × {item.unit_price.toFixed(2)} €
                </p>
              </div>
              <p className="text-sm font-semibold text-text-primary flex-shrink-0">
                {(item.unit_price * item.quantity).toFixed(2)} €
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Shipping address */}
      {address && (
        <section className="bg-surface-card rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold text-text-primary mb-3">Adresse de livraison</h2>
          <div className="text-sm text-text-secondary flex flex-col gap-0.5">
            <p className="text-text-primary font-medium">{address.full_name}</p>
            <p>{address.line1}</p>
            {address.line2 && <p>{address.line2}</p>}
            <p>{address.postal_code} {address.city}</p>
            <p>{address.country}</p>
          </div>
        </section>
      )}

      {/* Price breakdown */}
      <section className="bg-surface-card rounded-xl border border-border p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">Résumé</h2>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-text-secondary">
            <span>Sous-total</span>
            <span>{order.subtotal.toFixed(2)} €</span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Remise</span>
              <span>−{order.discount.toFixed(2)} €</span>
            </div>
          )}

          <div className="flex justify-between text-text-secondary">
            <span>TVA (20%)</span>
            <span>{order.tax.toFixed(2)} €</span>
          </div>

          <div className="flex justify-between text-text-secondary">
            <span>Frais de livraison</span>
            <span>{order.shipping_cost.toFixed(2)} €</span>
          </div>

          <div className="flex justify-between font-bold text-base text-text-primary pt-2 border-t border-border mt-1">
            <span>Total TTC</span>
            <span>{order.total.toFixed(2)} €</span>
          </div>
        </div>
      </section>

      {order.stripe_payment_intent_id && (
        <p className="text-xs text-text-muted">
          PaymentIntent Stripe : <span className="font-mono">{order.stripe_payment_intent_id}</span>
        </p>
      )}
    </div>
  )
}
