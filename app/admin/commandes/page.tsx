import type { Metadata } from 'next'
import Link from 'next/link'
import { adminGetOrders } from '@/actions/admin/orders'
import { DataTable } from '@/components/admin/data-table'
import { OrderStatusSelect } from './order-status-select'
import { DeleteOrderButton } from './delete-order-button'
import type { OrderStatus } from '@/types'

export const metadata: Metadata = { title: 'Admin — Commandes' }

const STATUS_LABELS: Record<string, string> = {
  pending:    'En attente', paid: 'Payée', processing: 'En préparation',
  shipped:    'Expédiée',   delivered: 'Livrée', cancelled: 'Annulée', refunded: 'Remboursée',
}
const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50', paid: 'text-green-700 bg-green-50',
  processing: 'text-brand-600 bg-brand-50', shipped: 'text-blue-700 bg-blue-50',
  delivered: 'text-green-700 bg-green-50', cancelled: 'text-red-600 bg-red-50',
  refunded: 'text-gray-600 bg-gray-100',
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const { status, page } = await searchParams
  const { orders, total } = await adminGetOrders({
    status: status as OrderStatus | undefined,
    page:   parseInt(page ?? '1'),
  })

  const STATUSES: OrderStatus[] = ['pending','paid','processing','shipped','delivered','cancelled','refunded']

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-text-primary">Commandes</h1>
        <p className="text-sm text-text-secondary mt-0.5">{total} commande{total !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <a
          href="/admin/commandes"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!status ? 'bg-brand-600 text-white' : 'text-text-secondary hover:bg-surface-subtle'}`}
        >
          Toutes
        </a>
        {STATUSES.map((s) => (
          <a
            key={s}
            href={`/admin/commandes?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${status === s ? 'bg-brand-600 text-white' : 'text-text-secondary hover:bg-surface-subtle'}`}
          >
            {STATUS_LABELS[s]}
          </a>
        ))}
      </div>

      <DataTable
        rows={orders}
        keyFn={(o) => o.id}
        columns={[
          {
            key: 'id', label: 'Commande',
            render: (o) => (
              <Link
                href={`/admin/commandes/${o.id}`}
                className="font-mono text-xs text-brand-600 hover:underline"
              >
                #{o.id.slice(-8).toUpperCase()}
              </Link>
            ),
          },
          {
            key: 'date', label: 'Date',
            render: (o) => (
              <span className="text-text-secondary text-xs">
                {new Date(o.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            ),
          },
          {
            key: 'client', label: 'Client',
            render: (o) => (
              <span className="text-text-primary">
                {(o.profile as { full_name?: string | null } | null)?.full_name ?? '—'}
              </span>
            ),
          },
          {
            key: 'total', label: 'Total',
            render: (o) => <span className="font-bold text-brand-600">{o.total.toFixed(2)} €</span>,
          },
          {
            key: 'status', label: 'Statut',
            render: (o) => (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status] ?? ''}`}>
                {STATUS_LABELS[o.status] ?? o.status}
              </span>
            ),
          },
          {
            key: 'actions', label: 'Changer statut', className: 'w-44',
            render: (o) => <OrderStatusSelect orderId={o.id} current={o.status as OrderStatus} />,
          },
          {
            key: 'delete', label: '', className: 'w-12',
            render: (o) => o.status === 'cancelled' ? <DeleteOrderButton orderId={o.id} /> : null,
          },
        ]}
      />
    </div>
  )
}
