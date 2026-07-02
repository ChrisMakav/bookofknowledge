import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { adminGetAuthors } from '@/actions/admin/authors'
import { DataTable } from '@/components/admin/data-table'

export const metadata: Metadata = { title: 'Admin — Auteurs' }

export default async function AdminAuthorsPage() {
  const authors = await adminGetAuthors()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display text-text-primary">Auteurs</h1>
        <Link
          href="/admin/auteurs/nouveau"
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          <Plus size={15} />
          Nouvel auteur
        </Link>
      </div>

      <DataTable
        rows={authors}
        keyFn={(a) => a.id}
        columns={[
          {
            key: 'name', label: 'Auteur',
            render: (a) => (
              <div className="flex items-center gap-3">
                {a.avatar_url
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={a.avatar_url} alt="" className="size-8 rounded-full object-cover shrink-0" />
                  : <div className="size-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold shrink-0">{a.name[0]}</div>
                }
                <div>
                  <p className="font-medium text-text-primary">{a.name}</p>
                  <p className="text-xs text-text-muted">{a.slug}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'actions', label: '', className: 'w-16',
            render: (a) => (
              <Link
                href={`/admin/auteurs/${a.id}/modifier`}
                className="size-7 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-surface-subtle"
              >
                <Pencil size={13} />
              </Link>
            ),
          },
        ]}
      />
    </div>
  )
}
