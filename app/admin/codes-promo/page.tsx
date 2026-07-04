import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { adminGetPromoCodes } from '@/actions/admin/promo-codes'
import { DataTable } from '@/components/admin/data-table'
import { PromoCodeToggle } from '@/components/admin/promo-code-toggle'
import { DeletePromoButton } from '@/components/admin/delete-promo-button'

export const metadata: Metadata = { title: 'Admin — Codes promo' }

export default async function AdminPromoCodesPage() {
  const codes = await adminGetPromoCodes()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Codes promo</h1>
          <p className="text-sm text-text-secondary mt-0.5">{codes.length} code{codes.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/codes-promo/nouveau"
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          <Plus size={15} />
          Nouveau code
        </Link>
      </div>

      <DataTable
        rows={codes}
        keyFn={(c) => c.id}
        empty="Aucun code promo. Créez-en un pour lancer des promotions."
        columns={[
          {
            key: 'code', label: 'Code',
            render: (c) => (
              <span className="font-mono font-bold text-text-primary tracking-wider">{c.code}</span>
            ),
          },
          {
            key: 'type', label: 'Réduction',
            render: (c) => (
              <span className="text-sm font-semibold text-brand-600">
                {c.type === 'percentage' ? `${c.value}%` : `${Number(c.value).toFixed(2)} €`}
              </span>
            ),
          },
          {
            key: 'usage', label: 'Utilisations',
            render: (c) => (
              <span className="text-sm text-text-secondary">
                {c.used_count} {c.usage_limit !== null ? `/ ${c.usage_limit}` : '/ ∞'}
              </span>
            ),
          },
          {
            key: 'expires', label: 'Expire le',
            render: (c) => (
              <span className="text-xs text-text-muted">
                {c.expires_at
                  ? new Date(c.expires_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '—'}
              </span>
            ),
          },
          {
            key: 'active', label: 'Actif',
            render: (c) => <PromoCodeToggle id={c.id} active={c.active} />,
          },
          {
            key: 'actions', label: '', className: 'w-12',
            render: (c) => <DeletePromoButton id={c.id} code={c.code} />,
          },
        ]}
      />
    </div>
  )
}
