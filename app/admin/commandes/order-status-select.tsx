'use client'

import { updateOrderStatus } from '@/actions/admin/orders'
import type { OrderStatus } from '@/types'

const OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending',    label: 'En attente' },
  { value: 'paid',       label: 'Payée' },
  { value: 'processing', label: 'En préparation' },
  { value: 'shipped',    label: 'Expédiée' },
  { value: 'delivered',  label: 'Livrée' },
  { value: 'cancelled',  label: 'Annulée' },
  { value: 'refunded',   label: 'Remboursée' },
]

export function OrderStatusSelect({ orderId, current }: { orderId: string; current: OrderStatus }) {
  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await updateOrderStatus(orderId, e.target.value as OrderStatus)
  }

  return (
    <select
      defaultValue={current}
      onChange={handleChange}
      className="h-7 rounded border border-border bg-surface-page px-2 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
