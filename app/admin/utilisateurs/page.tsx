import type { Metadata } from 'next'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { DataTable } from '@/components/admin/data-table'

export const metadata: Metadata = { title: 'Admin — Utilisateurs' }

export default async function AdminUsersPage() {
  const supabase = await getSupabaseServiceClient()
  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name, email, created_at, role')
    .order('created_at', { ascending: false })

  const rows = users ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-text-primary">Utilisateurs</h1>
        <p className="text-sm text-text-secondary mt-0.5">{rows.length} utilisateur{rows.length !== 1 ? 's' : ''}</p>
      </div>

      <DataTable
        rows={rows}
        keyFn={(u) => u.id}
        columns={[
          {
            key: 'user', label: 'Utilisateur',
            render: (u) => (
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold shrink-0">
                  {(u.full_name ?? u.email ?? '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-text-primary">{u.full_name ?? '—'}</p>
                  <p className="text-xs text-text-muted">{u.email ?? '—'}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'role', label: 'Rôle',
            render: (u) => (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                u.role === 'admin'
                  ? 'bg-brand-50 text-brand-600'
                  : 'bg-surface-subtle text-text-secondary'
              }`}>
                {u.role ?? 'utilisateur'}
              </span>
            ),
          },
          {
            key: 'date', label: 'Inscrit le',
            render: (u) => (
              <span className="text-text-secondary text-xs">
                {new Date(u.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}
